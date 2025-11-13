/**
 * Тест загрузки каталога из Supabase
 * Диагностический скрипт для проверки данных
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testCatalogLoad() {
  console.log('🔍 Тестируем загрузку каталога...\n')

  try {
    // Шаг 1: Загрузка товаров
    console.log('1️⃣ Загружаем товары...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(5) // Только 5 для теста

    if (productsError) {
      console.error('❌ Ошибка загрузки товаров:', productsError)
      return
    }

    console.log(`✅ Загружено товаров: ${productsData?.length || 0}`)
    if (productsData && productsData.length > 0) {
      console.log('📦 Первый товар:', JSON.stringify(productsData[0], null, 2))
    }

    // Шаг 2: Загрузка поставщиков
    console.log('\n2️⃣ Загружаем поставщиков...')
    const { data: suppliersData, error: suppliersError } = await supabase
      .from('suppliers')
      .select('id, name')

    if (suppliersError) {
      console.error('❌ Ошибка загрузки поставщиков:', suppliersError)
      return
    }

    console.log(`✅ Загружено поставщиков: ${suppliersData?.length || 0}`)

    // Шаг 3: Загрузка категорий
    console.log('\n3️⃣ Загружаем категории...')
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')

    if (categoriesError) {
      console.error('❌ Ошибка загрузки категорий:', categoriesError)
      return
    }

    console.log(`✅ Загружено категорий: ${categoriesData?.length || 0}`)

    // Шаг 4: Трансформация данных
    console.log('\n4️⃣ Трансформируем данные...')
    const suppliersMap = new Map(suppliersData?.map(s => [s.id, s.name]) || [])
    const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || [])

    const transformedProducts = productsData?.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description || '',
      images: p.images || [],
      category: categoriesMap.get(p.category_id) || 'Без категории',
      inStock: p.in_stock,
      minOrder: p.min_order,
      sku: p.sku,
      supplier_name: suppliersMap.get(p.supplier_id) || 'Неизвестный поставщик'
    }))

    console.log(`✅ Трансформировано товаров: ${transformedProducts?.length || 0}`)
    if (transformedProducts && transformedProducts.length > 0) {
      console.log('\n📦 Трансформированный товар:')
      console.log(JSON.stringify(transformedProducts[0], null, 2))
    }

    console.log('\n✅ Тест завершен успешно!')

  } catch (error: any) {
    console.error('\n❌ Критическая ошибка:', error.message)
    console.error('Stack:', error.stack)
  }
}

testCatalogLoad()
