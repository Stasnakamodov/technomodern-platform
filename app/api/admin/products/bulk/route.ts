import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface BulkProduct {
  name: string
  price: number | string
  category_slug?: string
  category_id?: string
  category_name?: string
  supplier_name?: string
  supplier_id?: string
  description?: string
  images?: string | string[]
  sku?: string
  in_stock?: boolean | string
  min_order?: number | string
  specifications?: string | Record<string, string>
  tags?: string | string[]
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ row: number; message: string; data?: any }>
  created: Array<{ id: string; name: string }>
  createdCategories: string[]
  createdSuppliers: string[]
  linkedToExisting: number // Товары, привязанные к существующим (от других поставщиков)
}

// POST - массовая загрузка товаров
export async function POST(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { products, options } = body as {
      products: BulkProduct[]
      options?: {
        skipDuplicates?: boolean
        autoCreateCategories?: boolean
        autoCreateSuppliers?: boolean
        updateExisting?: boolean
        linkToExisting?: boolean // Привязывать к существующим товарам (для разных поставщиков)
      }
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Массив товаров пуст или некорректен' },
        { status: 400 }
      )
    }

    const opts = {
      skipDuplicates: options?.skipDuplicates ?? true,
      autoCreateCategories: options?.autoCreateCategories ?? false,
      autoCreateSuppliers: options?.autoCreateSuppliers ?? false,
      updateExisting: options?.updateExisting ?? false,
      linkToExisting: options?.linkToExisting ?? true, // По умолчанию привязываем к существующим
    }

    // Загружаем справочники
    const [categoriesRes, suppliersRes] = await Promise.all([
      supabase.from('categories').select('id, name, slug'),
      supabase.from('suppliers').select('id, name')
    ])

    const categoriesMap = new Map<string, string>()
    const categoriesByName = new Map<string, string>()
    ;(categoriesRes.data || []).forEach(c => {
      categoriesMap.set(c.slug, c.id)
      categoriesByName.set(c.name.toLowerCase(), c.id)
    })

    const suppliersMap = new Map<string, string>()
    ;(suppliersRes.data || []).forEach(s => {
      suppliersMap.set(s.name.toLowerCase(), s.id)
    })

    // Загружаем существующие SKU для проверки дубликатов
    const existingSkus = new Map<string, string>()
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id, sku')
      .not('sku', 'is', null)

    ;(existingProducts || []).forEach(p => {
      if (p.sku) existingSkus.set(p.sku.toLowerCase(), p.id)
    })

    const result: ImportResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      created: [],
      createdCategories: [],
      createdSuppliers: [],
      linkedToExisting: 0,
    }

    // Загружаем существующие товары для поиска дубликатов по названию
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, name, sku, price')

    const existingProductsByName = new Map<string, { id: string; price: number }>()
    ;(allProducts || []).forEach(p => {
      // Нормализуем название для сравнения
      const normalizedName = normalizeProductName(p.name)
      existingProductsByName.set(normalizedName, { id: p.id, price: p.price })
    })

    // Обрабатываем каждый товар
    for (let i = 0; i < products.length; i++) {
      const row = i + 1 // Номер строки (1-based для пользователя)
      const product = products[i]

      try {
        // Валидация обязательных полей
        if (!product.name || String(product.name).trim() === '') {
          result.errors.push({ row, message: 'Отсутствует название товара', data: product })
          result.failed++
          continue
        }

        const price = parseFloat(String(product.price))
        if (isNaN(price) || price < 0) {
          result.errors.push({ row, message: `Некорректная цена: ${product.price}`, data: product })
          result.failed++
          continue
        }

        const sku = product.sku?.trim() || null
        const normalizedName = normalizeProductName(String(product.name))

        // Подготавливаем данные товара
        const productData = await prepareProductData(
          product, price, sku, categoriesMap, categoriesByName, suppliersMap, opts, result
        )

        // Определяем поставщика для связи
        let supplierId = productData.supplier_id

        // Проверяем, существует ли такой товар по названию
        const existingByName = existingProductsByName.get(normalizedName)

        // Также проверяем по SKU
        const existingBySku = sku ? existingSkus.get(sku.toLowerCase()) : null

        if (existingByName && opts.linkToExisting && supplierId) {
          // Товар с таким названием уже есть - привязываем поставщика
          const linked = await linkProductToSupplier(
            existingByName.id,
            supplierId,
            price,
            sku,
            productData.in_stock,
            productData.min_order
          )

          if (linked) {
            // Обновляем лучшую цену товара
            await updateProductBestPrice(existingByName.id)
            result.linkedToExisting++
            result.success++
          } else {
            result.errors.push({ row, message: 'Ошибка привязки к существующему товару', data: product })
            result.failed++
          }
          continue
        }

        if (existingBySku) {
          // Дубликат по SKU
          if (opts.updateExisting) {
            const { error } = await supabase
              .from('products')
              .update({ ...productData, updated_at: new Date().toISOString() })
              .eq('id', existingBySku)

            if (error) {
              result.errors.push({ row, message: `Ошибка обновления: ${error.message}`, data: product })
              result.failed++
            } else {
              // Добавляем связь с поставщиком
              if (supplierId) {
                await linkProductToSupplier(existingBySku, supplierId, price, sku, productData.in_stock, productData.min_order)
                await updateProductBestPrice(existingBySku)
              }
              result.success++
              result.created.push({ id: existingBySku, name: String(product.name) })
            }
            continue
          } else if (opts.skipDuplicates) {
            result.skipped++
            continue
          } else {
            result.errors.push({ row, message: `Дубликат SKU: ${sku}`, data: product })
            result.failed++
            continue
          }
        }

        // Создаём новый товар
        const { data: insertedProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select('id, name')
          .single()

        if (error) {
          result.errors.push({ row, message: `Ошибка вставки: ${error.message}`, data: product })
          result.failed++
        } else {
          result.success++
          result.created.push(insertedProduct)

          // Запоминаем для следующих итераций
          if (sku) existingSkus.set(sku.toLowerCase(), insertedProduct.id)
          existingProductsByName.set(normalizedName, { id: insertedProduct.id, price })

          // Добавляем связь с поставщиком
          if (supplierId) {
            await linkProductToSupplier(insertedProduct.id, supplierId, price, sku, productData.in_stock, productData.min_order)
          }
        }
      } catch (err: any) {
        result.errors.push({ row, message: err.message || 'Неизвестная ошибка', data: product })
        result.failed++
      }
    }

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error: any) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера: ' + error.message },
      { status: 500 }
    )
  }
}

async function prepareProductData(
  product: BulkProduct,
  price: number,
  sku: string | null,
  categoriesMap: Map<string, string>,
  categoriesByName: Map<string, string>,
  suppliersMap: Map<string, string>,
  opts: { autoCreateCategories: boolean; autoCreateSuppliers: boolean },
  result: ImportResult
) {
  // Определяем категорию
  let categoryId: string | null = null
  if (product.category_id) {
    categoryId = product.category_id
  } else if (product.category_slug) {
    categoryId = categoriesMap.get(product.category_slug) || null
    if (!categoryId && opts.autoCreateCategories) {
      categoryId = await createCategory(product.category_slug, product.category_name || product.category_slug)
      if (categoryId) {
        categoriesMap.set(product.category_slug, categoryId)
        result.createdCategories.push(product.category_slug)
      }
    }
  } else if (product.category_name) {
    categoryId = categoriesByName.get(product.category_name.toLowerCase()) || null
    if (!categoryId && opts.autoCreateCategories) {
      const slug = slugify(product.category_name)
      categoryId = await createCategory(slug, product.category_name)
      if (categoryId) {
        categoriesMap.set(slug, categoryId)
        categoriesByName.set(product.category_name.toLowerCase(), categoryId)
        result.createdCategories.push(product.category_name)
      }
    }
  }

  // Определяем поставщика
  let supplierId: string | null = null
  if (product.supplier_id) {
    supplierId = product.supplier_id
  } else if (product.supplier_name) {
    supplierId = suppliersMap.get(product.supplier_name.toLowerCase()) || null
    if (!supplierId && opts.autoCreateSuppliers) {
      supplierId = await createSupplier(product.supplier_name)
      if (supplierId) {
        suppliersMap.set(product.supplier_name.toLowerCase(), supplierId)
        result.createdSuppliers.push(product.supplier_name)
      }
    }
  }

  // Обрабатываем изображения
  let images: string[] = []
  if (product.images) {
    if (Array.isArray(product.images)) {
      images = product.images.filter(Boolean)
    } else if (typeof product.images === 'string') {
      images = product.images.split(',').map(s => s.trim()).filter(Boolean)
    }
  }

  // Обрабатываем характеристики
  let specifications: Record<string, string> = {}
  if (product.specifications) {
    if (typeof product.specifications === 'object') {
      specifications = product.specifications
    } else if (typeof product.specifications === 'string') {
      // Формат: "Цвет:Чёрный|Размер:XL|Вес:100г"
      try {
        // Сначала пробуем JSON
        specifications = JSON.parse(product.specifications)
      } catch {
        // Если не JSON, парсим формат key:value|key:value
        product.specifications.split('|').forEach(pair => {
          const [key, value] = pair.split(':').map(s => s.trim())
          if (key && value) {
            specifications[key] = value
          }
        })
      }
    }
  }

  // Обрабатываем теги
  let tags: string[] = []
  if (product.tags) {
    if (Array.isArray(product.tags)) {
      tags = product.tags.filter(Boolean)
    } else if (typeof product.tags === 'string') {
      tags = product.tags.split(',').map(s => s.trim()).filter(Boolean)
    }
  }

  // Обрабатываем in_stock
  let inStock = true
  if (product.in_stock !== undefined) {
    if (typeof product.in_stock === 'boolean') {
      inStock = product.in_stock
    } else if (typeof product.in_stock === 'string') {
      const val = product.in_stock.toLowerCase()
      inStock = val === 'true' || val === '1' || val === 'да' || val === 'yes'
    }
  }

  return {
    name: String(product.name).trim(),
    price,
    sku,
    description: product.description?.trim() || null,
    category_id: categoryId,
    supplier_id: supplierId,
    images,
    specifications,
    tags,
    in_stock: inStock,
    min_order: parseInt(String(product.min_order)) || 1,
    currency: 'RUB',
  }
}

async function createCategory(slug: string, name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      slug: slugify(slug),
      name,
      level: 1,
      product_count: 0
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return null
  }
  return data.id
}

async function createSupplier(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({ name })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating supplier:', error)
    return null
  }
  return data.id
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

// Нормализация названия для сравнения (убираем пробелы, регистр, спецсимволы)
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]/gi, '') // Убираем всё кроме букв и цифр
    .trim()
}

// Добавление связи товар-поставщик
async function linkProductToSupplier(
  productId: string,
  supplierId: string,
  supplierPrice: number,
  supplierSku: string | null,
  inStock: boolean,
  minOrder: number
): Promise<boolean> {
  // Проверяем, нет ли уже такой связи
  const { data: existing } = await supabase
    .from('product_suppliers')
    .select('id, supplier_price')
    .eq('product_id', productId)
    .eq('supplier_id', supplierId)
    .single()

  if (existing) {
    // Обновляем существующую связь
    const { error } = await supabase
      .from('product_suppliers')
      .update({
        supplier_price: supplierPrice,
        supplier_sku: supplierSku,
        in_stock: inStock,
        min_order: minOrder,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    return !error
  }

  // Создаём новую связь
  const { error } = await supabase
    .from('product_suppliers')
    .insert({
      product_id: productId,
      supplier_id: supplierId,
      supplier_price: supplierPrice,
      supplier_sku: supplierSku,
      in_stock: inStock,
      min_order: minOrder
    })

  return !error
}

// Обновление основной цены товара (минимальная из всех поставщиков)
async function updateProductBestPrice(productId: string): Promise<void> {
  const { data: suppliers } = await supabase
    .from('product_suppliers')
    .select('supplier_price')
    .eq('product_id', productId)
    .eq('in_stock', true)
    .order('supplier_price', { ascending: true })
    .limit(1)

  if (suppliers && suppliers.length > 0) {
    await supabase
      .from('products')
      .update({ price: suppliers[0].supplier_price })
      .eq('id', productId)
  }
}
