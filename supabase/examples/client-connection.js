/**
 * Пример подключения к Supabase - Клиентская часть
 * Используйте этот код в браузере / React / Next.js клиенте
 */

import { createClient } from '@supabase/supabase-js'

// Конфигурация
const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

// Создание клиента
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
// ============================================================================

// 1. Получить все товары
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(name, rating, verified),
      category:categories(name, slug)
    `)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Ошибка получения товаров:', error)
    return null
  }

  return data
}

// 2. Поиск товаров по названию
export async function searchProducts(query) {
  const { data, error } = await supabase
    .from('products')
    .select('*, supplier:suppliers(name, verified)')
    .textSearch('name', query, {
      type: 'websearch',
      config: 'russian'
    })
    .eq('in_stock', true)

  if (error) {
    console.error('Ошибка поиска:', error)
    return null
  }

  return data
}

// 3. Получить товары по категории
export async function getProductsByCategory(categoryId) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      supplier:suppliers(name, rating, verified)
    `)
    .eq('category_id', categoryId)
    .eq('in_stock', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Ошибка получения товаров категории:', error)
    return null
  }

  return data
}

// 4. Получить категории верхнего уровня
export async function getTopCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('level', 1)
    .order('display_order')

  if (error) {
    console.error('Ошибка получения категорий:', error)
    return null
  }

  return data
}

// 5. Получить подкатегории
export async function getSubcategories(parentId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('display_order')

  if (error) {
    console.error('Ошибка получения подкатегорий:', error)
    return null
  }

  return data
}

// 6. Добавить товар в корзину
export async function addToCart(userId, productId, quantity, price) {
  const totalPrice = price * quantity

  const { data, error } = await supabase
    .from('project_carts')
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity: quantity,
      price: price,
      total_price: totalPrice,
      currency: 'USD'
    })
    .select()

  if (error) {
    console.error('Ошибка добавления в корзину:', error)
    return null
  }

  return data
}

// 7. Получить корзину пользователя
export async function getUserCart(userId) {
  const { data, error } = await supabase
    .from('project_carts')
    .select(`
      *,
      product:products(
        *,
        supplier:suppliers(name, verified)
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Ошибка получения корзины:', error)
    return null
  }

  return data
}

// 8. Обновить количество в корзине
export async function updateCartQuantity(userId, productId, newQuantity, price) {
  const { data, error } = await supabase
    .from('project_carts')
    .update({
      quantity: newQuantity,
      total_price: price * newQuantity
    })
    .eq('user_id', userId)
    .eq('product_id', productId)
    .select()

  if (error) {
    console.error('Ошибка обновления корзины:', error)
    return null
  }

  return data
}

// 9. Удалить товар из корзины
export async function removeFromCart(userId, productId) {
  const { error } = await supabase
    .from('project_carts')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('Ошибка удаления из корзины:', error)
    return false
  }

  return true
}

// 10. Получить общую сумму корзины
export async function getCartTotal(userId) {
  const { data, error } = await supabase
    .from('project_carts')
    .select('total_price')
    .eq('user_id', userId)

  if (error) {
    console.error('Ошибка подсчета суммы:', error)
    return 0
  }

  const total = data.reduce((sum, item) => sum + parseFloat(item.total_price), 0)
  return total
}

// ============================================================================
// REAL-TIME ПОДПИСКИ (опционально)
// ============================================================================

// Подписка на изменения в товарах
export function subscribeToProducts(callback) {
  const channel = supabase
    .channel('products-changes')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      (payload) => {
        console.log('Изменение в товарах:', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channel
}

// Подписка на корзину пользователя
export function subscribeToCart(userId, callback) {
  const channel = supabase
    .channel(`cart-${userId}`)
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'project_carts',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Изменение в корзине:', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channel
}

console.log('✅ Supabase client initialized successfully!')
