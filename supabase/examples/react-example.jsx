/**
 * Пример React компонента для работы с каталогом ТехноМодерн
 * Демонстрирует основные операции с товарами и корзиной
 */

import React, { useState, useEffect } from 'react'
import { supabase } from './client-connection'

// ============================================================================
// 1. КОМПОНЕНТ СПИСКА ТОВАРОВ
// ============================================================================

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
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

      if (error) throw error

      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Загрузка товаров...</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <div className="product-list">
      <h2>Каталог товаров ({products.length})</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 2. КАРТОЧКА ТОВАРА
// ============================================================================

function ProductCard({ product }) {
  const [addingToCart, setAddingToCart] = useState(false)

  async function handleAddToCart() {
    try {
      setAddingToCart(true)

      // ID пользователя (в реальном приложении из auth)
      const userId = 'user-123'

      const { data, error } = await supabase
        .from('project_carts')
        .insert([{
          user_id: userId,
          product_id: product.id,
          quantity: 1,
          price: product.price,
          total_price: product.price,
          currency: product.currency
        }])
        .select()

      if (error) throw error

      alert('Товар добавлен в корзину!')
    } catch (err) {
      alert('Ошибка: ' + err.message)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="product-card">
      {product.images && product.images[0] && (
        <img src={product.images[0]} alt={product.name} />
      )}

      <h3>{product.name}</h3>

      <div className="product-supplier">
        {product.supplier?.verified && <span>✓</span>}
        {product.supplier?.name}
        {product.supplier?.rating && (
          <span> ⭐ {product.supplier.rating}</span>
        )}
      </div>

      <div className="product-category">
        📂 {product.category?.name}
      </div>

      <div className="product-price">
        {product.price} {product.currency}
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="product-specs">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={addingToCart || !product.in_stock}
      >
        {addingToCart ? 'Добавление...' : 'В корзину'}
      </button>
    </div>
  )
}

// ============================================================================
// 3. КОМПОНЕНТ КОРЗИНЫ
// ============================================================================

export function ShoppingCart({ userId }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCart()

    // Real-time подписка на изменения корзины
    const channel = supabase
      .channel(`cart-${userId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_carts',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchCart() // Обновляем корзину при изменениях
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function fetchCart() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_carts')
        .select(`
          *,
          product:products(
            name,
            images,
            supplier:suppliers(name)
          )
        `)
        .eq('user_id', userId)

      if (error) throw error

      setCartItems(data)

      // Подсчитываем общую сумму
      const totalAmount = data.reduce((sum, item) =>
        sum + parseFloat(item.total_price), 0
      )
      setTotal(totalAmount)
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(cartItemId, productId, newQuantity, price) {
    try {
      const { error } = await supabase
        .from('project_carts')
        .update({
          quantity: newQuantity,
          total_price: price * newQuantity
        })
        .eq('id', cartItemId)

      if (error) throw error

      await fetchCart() // Обновляем корзину
    } catch (err) {
      alert('Ошибка обновления: ' + err.message)
    }
  }

  async function removeItem(cartItemId) {
    try {
      const { error } = await supabase
        .from('project_carts')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error

      await fetchCart() // Обновляем корзину
    } catch (err) {
      alert('Ошибка удаления: ' + err.message)
    }
  }

  if (loading) return <div>Загрузка корзины...</div>

  if (cartItems.length === 0) {
    return <div>Корзина пуста</div>
  }

  return (
    <div className="shopping-cart">
      <h2>Корзина ({cartItems.length})</h2>

      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          {item.product?.images?.[0] && (
            <img src={item.product.images[0]} alt={item.product.name} />
          )}

          <div className="cart-item-details">
            <h4>{item.product?.name}</h4>
            <p>Поставщик: {item.product?.supplier?.name}</p>
            <p>Цена: {item.price} {item.currency}</p>
          </div>

          <div className="cart-item-quantity">
            <button
              onClick={() => updateQuantity(
                item.id,
                item.product_id,
                item.quantity - 1,
                item.price
              )}
              disabled={item.quantity <= 1}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => updateQuantity(
                item.id,
                item.product_id,
                item.quantity + 1,
                item.price
              )}
            >
              +
            </button>
          </div>

          <div className="cart-item-total">
            {item.total_price} {item.currency}
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="remove-btn"
          >
            🗑️
          </button>
        </div>
      ))}

      <div className="cart-total">
        <h3>Итого: {total.toFixed(2)} USD</h3>
      </div>
    </div>
  )
}

// ============================================================================
// 4. КОМПОНЕНТ ПОИСКА
// ============================================================================

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setSearching(true)

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          supplier:suppliers(name, verified)
        `)
        .textSearch('name', query, {
          type: 'websearch',
          config: 'russian'
        })
        .eq('in_stock', true)

      if (error) throw error

      setResults(data)
    } catch (err) {
      console.error('Ошибка поиска:', err)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="product-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск товаров..."
        />
        <button type="submit" disabled={searching}>
          {searching ? 'Поиск...' : '🔍 Найти'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results">
          <h3>Найдено: {results.length}</h3>
          <div className="products-grid">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 5. КОМПОНЕНТ КАТЕГОРИЙ
// ============================================================================

export function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('level', 1)
        .order('display_order')

      if (error) throw error

      setCategories(data)
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Загрузка категорий...</div>

  return (
    <div className="category-list">
      <h2>Категории</h2>
      {categories.map(category => (
        <div key={category.id} className="category-item">
          {category.icon && <span>{category.icon}</span>}
          <span>{category.name}</span>
          {category.product_count > 0 && (
            <span className="count">({category.product_count})</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 6. ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================================================================

export default function CatalogApp() {
  const userId = 'user-123' // В реальном приложении из auth

  return (
    <div className="catalog-app">
      <header>
        <h1>ТехноМодерн - Каталог</h1>
        <ProductSearch />
      </header>

      <div className="app-layout">
        <aside>
          <CategoryList />
        </aside>

        <main>
          <ProductList />
        </main>

        <aside>
          <ShoppingCart userId={userId} />
        </aside>
      </div>
    </div>
  )
}
