/**
 * Пример подключения к Supabase - Серверная часть
 * Используйте этот код в API routes / Server-side
 * ⚠️ Service Role Key дает полный доступ - используйте ТОЛЬКО на сервере!
 */

import { createClient } from '@supabase/supabase-js'

// Конфигурация с Service Role Key (полный доступ)
const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'

// Создание админского клиента
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ============================================================================
// АДМИНИСТРАТИВНЫЕ ФУНКЦИИ
// ============================================================================

// 1. Создать поставщика (админ)
export async function createSupplier(supplierData) {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .insert([{
      name: supplierData.name,
      description: supplierData.description,
      country: supplierData.country || 'China',
      verified: supplierData.verified || false,
      rating: supplierData.rating || 0.00,
      logo_url: supplierData.logo_url
    }])
    .select()

  if (error) {
    console.error('Ошибка создания поставщика:', error)
    return null
  }

  return data[0]
}

// 2. Массовый импорт товаров
export async function bulkImportProducts(products) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(products)
    .select()

  if (error) {
    console.error('Ошибка импорта товаров:', error)
    return null
  }

  console.log(`✅ Импортировано ${data.length} товаров`)
  return data
}

// 3. Обновить рейтинг поставщика
export async function updateSupplierRating(supplierId, newRating) {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update({ rating: newRating })
    .eq('id', supplierId)
    .select()

  if (error) {
    console.error('Ошибка обновления рейтинга:', error)
    return null
  }

  return data[0]
}

// 4. Создать категорию
export async function createCategory(categoryData) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert([{
      name: categoryData.name,
      slug: categoryData.slug,
      icon: categoryData.icon,
      parent_id: categoryData.parent_id || null,
      level: categoryData.level || 1,
      display_order: categoryData.display_order || 0
    }])
    .select()

  if (error) {
    console.error('Ошибка создания категории:', error)
    return null
  }

  return data[0]
}

// 5. Массовое создание категорий
export async function bulkCreateCategories(categories) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert(categories)
    .select()

  if (error) {
    console.error('Ошибка создания категорий:', error)
    return null
  }

  console.log(`✅ Создано ${data.length} категорий`)
  return data
}

// 6. Получить статистику товаров по поставщикам
export async function getSupplierStats() {
  const { data, error } = await supabaseAdmin
    .rpc('get_supplier_stats')

  // Если RPC функции нет, используем обычный запрос
  if (error && error.code === '42883') {
    const { data: suppliers } = await supabaseAdmin
      .from('suppliers')
      .select(`
        id,
        name,
        verified,
        rating,
        products:products(count)
      `)

    return suppliers
  }

  if (error) {
    console.error('Ошибка получения статистики:', error)
    return null
  }

  return data
}

// 7. Удалить неактивные товары (без заказов)
export async function removeInactiveProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('orders', 0)
    .eq('views', 0)
    .select()

  if (error) {
    console.error('Ошибка удаления товаров:', error)
    return null
  }

  console.log(`🗑️ Удалено ${data.length} неактивных товаров`)
  return data
}

// 8. Обновить счетчик товаров в категории
export async function updateCategoryProductCount(categoryId) {
  // Подсчитываем товары
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)

  // Обновляем счетчик
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ product_count: count })
    .eq('id', categoryId)
    .select()

  if (error) {
    console.error('Ошибка обновления счетчика:', error)
    return null
  }

  return data[0]
}

// 9. Получить все корзины с деталями
export async function getAllCartsWithDetails() {
  const { data, error } = await supabaseAdmin
    .from('project_carts')
    .select(`
      *,
      product:products(
        name,
        sku,
        supplier:suppliers(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Ошибка получения корзин:', error)
    return null
  }

  return data
}

// 10. Очистить старые корзины (старше 30 дней)
export async function cleanupOldCarts() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabaseAdmin
    .from('project_carts')
    .delete()
    .lt('created_at', thirtyDaysAgo.toISOString())
    .select()

  if (error) {
    console.error('Ошибка очистки корзин:', error)
    return null
  }

  console.log(`🧹 Удалено ${data.length} старых корзин`)
  return data
}

// ============================================================================
// ПРЯМЫЕ SQL ЗАПРОСЫ (для сложных операций)
// ============================================================================

// Выполнить произвольный SQL запрос
export async function executeSQL(query) {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('execute_sql', { query: query })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Ошибка выполнения SQL:', err)
    return null
  }
}

// ============================================================================
// ЭКСПОРТ ДАННЫХ
// ============================================================================

// Экспорт всего каталога в JSON
export async function exportCatalog() {
  const [suppliers, categories, products] = await Promise.all([
    supabaseAdmin.from('suppliers').select('*'),
    supabaseAdmin.from('categories').select('*'),
    supabaseAdmin.from('products').select('*')
  ])

  return {
    suppliers: suppliers.data,
    categories: categories.data,
    products: products.data,
    exported_at: new Date().toISOString()
  }
}

console.log('✅ Supabase Admin client initialized successfully!')
console.log('⚠️  WARNING: Service Role Key active - use only on server!')
