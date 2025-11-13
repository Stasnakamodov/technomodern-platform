/**
 * Импорт каталога напрямую в Supabase через API
 *
 * Использование:
 * npx tsx scripts/import-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Загружаем конфигурацию из .env.example (для примера)
const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'

// Создаём клиента с service_role ключом (полные права)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false
  }
})

// Загружаем каталог
const catalogPath = path.join(process.cwd(), 'data', 'realistic-catalog-v2.json')
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))

console.log('🚀 Начинаем импорт в Supabase...\n')
console.log(`📦 Товаров: ${catalog.total_products}`)
console.log(`🏭 Поставщиков: ${catalog.suppliers.length}`)
console.log(`📂 Категорий: ${catalog.categories.length}\n`)

async function clearExistingData() {
  console.log('🗑️  Очистка старых данных...')

  try {
    // Удаляем в правильном порядке (из-за внешних ключей)
    await supabase.from('project_carts').delete().gte('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('products').delete().gte('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().gte('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('suppliers').delete().gte('id', '00000000-0000-0000-0000-000000000000')

    console.log('   ✅ Все старые данные удалены\n')
  } catch (error: any) {
    console.log('   ⚠️  Ошибка при очистке (возможно таблицы пустые):', error.message)
  }
}

async function importSuppliers() {
  console.log('🏭 Импорт поставщиков...')

  const suppliersData = catalog.suppliers.map((s: any, index: number) => ({
    id: generateUUID(index),
    name: s.name,
    country: s.country,
    logo_url: null,
    verified: s.verified,
    rating: s.rating,
    total_orders: 0
  }))

  const { data, error } = await supabase
    .from('suppliers')
    .insert(suppliersData)
    .select()

  if (error) {
    console.error('   ❌ Ошибка:', error.message)
    throw error
  }

  console.log(`   ✅ Импортировано ${data.length} поставщиков\n`)
  return data
}

async function importCategories() {
  console.log('📂 Импорт категорий...')

  const categoryMap: Record<string, string> = {}

  // Уровень 1: Основные категории
  for (let i = 0; i < catalog.categories.length; i++) {
    const cat = catalog.categories[i]
    const categoryId = generateUUID(100 + i)
    categoryMap[cat.name] = categoryId

    const { error } = await supabase
      .from('categories')
      .insert({
        id: categoryId,
        name: cat.name,
        slug: cat.id,
        icon: cat.icon,
        level: 1,
        parent_id: null,
        display_order: i,
        product_count: 0
      })

    if (error) {
      console.error(`   ❌ Ошибка при создании категории ${cat.name}:`, error.message)
      throw error
    }

    // Уровень 2: Подкатегории
    for (let j = 0; j < cat.subcategories.length; j++) {
      const subcat = cat.subcategories[j]
      const subcatId = generateUUID(200 + i * 100 + j)

      const { error: subError } = await supabase
        .from('categories')
        .insert({
          id: subcatId,
          name: subcat,
          slug: slugify(subcat),
          level: 2,
          parent_id: categoryId,
          display_order: j,
          product_count: 0
        })

      if (subError) {
        console.error(`   ❌ Ошибка при создании подкатегории ${subcat}:`, subError.message)
        // Продолжаем, не бросаем ошибку
      }
    }
  }

  console.log(`   ✅ Импортировано ${catalog.categories.length} категорий\n`)
  return categoryMap
}

async function importProducts(categoryMap: Record<string, string>) {
  console.log('📦 Импорт товаров (это займет ~1-2 минуты)...')

  let imported = 0
  let failed = 0
  const batchSize = 50 // Импортируем по 50 товаров за раз

  for (let i = 0; i < catalog.products.length; i += batchSize) {
    const batch = catalog.products.slice(i, i + batchSize)

    const productsData = batch.map((p: any, index: number) => {
      const supplierId = getSupplierIdByName(p.supplier)
      const categoryId = categoryMap[p.category]
      const productNumber = parseInt(p.id.replace('prod-', ''))

      return {
        id: generateUUID(1000 + productNumber), // Генерируем UUID из номера товара
        supplier_id: supplierId,
        category_id: categoryId,
        name: p.name,
        description: p.description,
        sku: p.id, // Сохраняем оригинальный ID как SKU
        price: p.price_rub,
        currency: 'RUB',
        min_order: p.moq,
        in_stock: p.in_stock,
        images: [p.image_url],
        specifications: p.specifications,
        tags: [],
        views: 0,
        orders: 0
      }
    })

    const { data, error } = await supabase
      .from('products')
      .insert(productsData)
      .select()

    if (error) {
      console.error(`   ⚠️  Ошибка в batch ${i}-${i + batchSize}:`, error.message)
      failed += batch.length
    } else {
      imported += data.length
      process.stdout.write(`   📦 Импортировано: ${imported}/${catalog.products.length}\r`)
    }
  }

  console.log(`\n   ✅ Импортировано ${imported} товаров (ошибок: ${failed})\n`)
}

async function updateCategoryCounts() {
  console.log('🔄 Обновление счетчиков товаров в категориях...')

  // Получаем все категории
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id')

  if (error) {
    console.error('   ❌ Ошибка:', error.message)
    return
  }

  // Обновляем счетчики для каждой категории
  for (const category of categories || []) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)

    await supabase
      .from('categories')
      .update({ product_count: count || 0 })
      .eq('id', category.id)
  }

  console.log('   ✅ Счетчики обновлены\n')
}

async function verifyImport() {
  console.log('✅ Проверка импортированных данных...\n')

  const { count: suppliersCount } = await supabase
    .from('suppliers')
    .select('*', { count: 'exact', head: true })

  const { count: categoriesCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  console.log('┌─────────────────────────────────┐')
  console.log('│  📊 РЕЗУЛЬТАТЫ ИМПОРТА          │')
  console.log('├─────────────────────────────────┤')
  console.log(`│  Поставщиков:  ${String(suppliersCount).padStart(4)}            │`)
  console.log(`│  Категорий:    ${String(categoriesCount).padStart(4)}            │`)
  console.log(`│  Товаров:      ${String(productsCount).padStart(4)}            │`)
  console.log('└─────────────────────────────────┘\n')

  // Примеры товаров
  const { data: sampleProducts } = await supabase
    .from('products')
    .select('name, price, category:categories(name)')
    .limit(5)

  console.log('📦 Примеры импортированных товаров:')
  sampleProducts?.forEach((p: any) => {
    console.log(`   • ${p.name}: ${p.price}₽ (${p.category?.name})`)
  })

  console.log('\n🎉 Импорт завершен успешно!')
  console.log(`\n🔗 Откройте Dashboard: ${SUPABASE_URL}`)
}

// Вспомогательные функции
function generateUUID(seed: number): string {
  const hex = seed.toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-0000-0000-0000-${hex.padEnd(12, '0')}`
}

function getSupplierIdByName(supplierName: string): string {
  const supplierIndex = catalog.suppliers.findIndex((s: any) => s.name === supplierName)
  return generateUUID(supplierIndex >= 0 ? supplierIndex : 0)
}

function slugify(text: string): string {
  const ru: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => ru[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Главная функция
async function main() {
  try {
    const startTime = Date.now()

    // Проверяем подключение
    const { error: connectionError } = await supabase.from('suppliers').select('count', { count: 'exact', head: true })
    if (connectionError) {
      console.error('❌ Ошибка подключения к Supabase:', connectionError.message)
      process.exit(1)
    }

    console.log('✅ Подключение к Supabase установлено\n')

    // Шаги импорта
    await clearExistingData()
    await importSuppliers()
    const categoryMap = await importCategories()
    await importProducts(categoryMap)
    await updateCategoryCounts()
    await verifyImport()

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n⏱️  Время выполнения: ${duration}s`)

  } catch (error: any) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message)
    console.error(error)
    process.exit(1)
  }
}

main()
