// Fallback функции для работы каталога без Supabase
// Используют локальные JSON данные

import {
  LOCAL_CATEGORIES,
  LOCAL_PRODUCTS,
  LOCAL_SUPPLIERS,
  getCategoryById,
  getSupplierById,
  type LocalCategory,
  type LocalProduct
} from './local-catalog-data'

import type { ProductFilters, ProductResult, ProductsResponse, Category } from './catalog'

// Маппинг локального продукта в ProductResult
function mapLocalProduct(p: LocalProduct): ProductResult {
  const category = getCategoryById(p.category_id)
  const supplier = getSupplierById(p.supplier_id)

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    images: p.images,
    sku: p.sku,
    category_id: p.category_id,
    category_name: category?.name || 'Без категории',
    supplier_id: p.supplier_id,
    supplier_name: supplier?.name || 'Неизвестный поставщик',
    in_stock: p.in_stock,
    min_order: p.min_order,
    created_at: p.created_at
  }
}

// Получение категорий из локальных данных
export function getLocalCategories(): Category[] {
  return LOCAL_CATEGORIES.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    parent_id: cat.parent_id,
    level: cat.level,
    product_count: cat.product_count,
    subcategories_count: cat.subcategories_count
  }))
}

// Получение товаров из локальных данных
export function getLocalProducts(filters: ProductFilters): ProductsResponse {
  const {
    categoryId,
    search,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters

  let filtered = [...LOCAL_PRODUCTS]

  // Фильтр только в наличии
  filtered = filtered.filter(p => p.in_stock)

  // Фильтр по категории
  if (categoryId) {
    filtered = filtered.filter(p => p.category_id === categoryId)
  }

  // Поиск
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower)
    )
  }

  // Сортировка
  filtered.sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru')
        break
      case 'created_at':
      default:
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    return sortOrder === 'desc' ? -comparison : comparison
  })

  const total = filtered.length
  const offset = (page - 1) * limit
  const paged = filtered.slice(offset, offset + limit)

  return {
    products: paged.map(mapLocalProduct),
    total,
    page,
    limit,
    hasMore: page * limit < total
  }
}

// Получение товаров по дереву категорий (включая подкатегории)
export function getLocalProductsByCategoryTree(
  parentCategoryId: string,
  filters: Omit<ProductFilters, 'categoryId'>
): ProductsResponse {
  // Находим все подкатегории
  const categoryIds = [parentCategoryId]
  for (const cat of LOCAL_CATEGORIES) {
    if (cat.parent_id === parentCategoryId) {
      categoryIds.push(cat.id)
    }
  }

  const {
    search,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters

  let filtered = LOCAL_PRODUCTS.filter(p =>
    p.in_stock && categoryIds.includes(p.category_id)
  )

  // Поиск
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    )
  }

  // Сортировка
  filtered.sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru')
        break
      default:
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    return sortOrder === 'desc' ? -comparison : comparison
  })

  const total = filtered.length
  const offset = (page - 1) * limit
  const paged = filtered.slice(offset, offset + limit)

  return {
    products: paged.map(mapLocalProduct),
    total,
    page,
    limit,
    hasMore: page * limit < total
  }
}

// Получение одного товара
export function getLocalProduct(id: string): ProductResult | null {
  const product = LOCAL_PRODUCTS.find(p => p.id === id)
  if (!product) return null
  return mapLocalProduct(product)
}

// Проверка доступности Supabase
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return false

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      }
    })
    return response.ok
  } catch {
    return false
  }
}

// Статистика локальных данных
export function getLocalStats() {
  return {
    categories: LOCAL_CATEGORIES.length,
    products: LOCAL_PRODUCTS.length,
    suppliers: LOCAL_SUPPLIERS.length,
    inStock: LOCAL_PRODUCTS.filter(p => p.in_stock).length
  }
}
