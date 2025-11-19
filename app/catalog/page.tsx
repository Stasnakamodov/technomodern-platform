'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, X, Plus, Minus, Package, ArrowLeft, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import ProductCard from './components/ProductCard'
import CategoryBrowser from './components/CategoryBrowser'
import CatalogHeader from '@/components/catalog/CatalogHeader'
import type { Product, CartItem } from '@/types/catalog.types'
import { supabase } from '@/lib/supabase'

export default function CatalogPageV2() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [showCategorySidebar, setShowCategorySidebar] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Загрузка поискового запроса и категории из URL при монтировании
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')

    if (urlSearch) {
      setSearchQuery(urlSearch)
    }

    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [searchParams])

  // Загрузка товаров из Supabase
  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        // Получаем все товары
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false })

        if (productsError) {
          console.error('Ошибка загрузки товаров:', productsError)
          setLoading(false)
          return
        }

        if (!productsData || productsData.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        // Получаем поставщиков и категории
        const { data: suppliersData } = await supabase
          .from('suppliers')
          .select('id, name')

        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, name')

        // Создаем мапы для быстрого поиска
        const suppliersMap = new Map(suppliersData?.map(s => [s.id, s.name]) || [])
        const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || [])

        // Преобразуем данные из Supabase в формат Product
        const transformedProducts: Product[] = productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description || '',
          images: p.images || [],
          category: categoriesMap.get(p.category_id) || 'Без категории',
          category_id: p.category_id, // Сохраняем UUID категории
          inStock: p.in_stock,
          minOrder: p.min_order,
          sku: p.sku,
          supplier_name: suppliersMap.get(p.supplier_id) || 'Неизвестный поставщик'
        }))

        setProducts(transformedProducts)
      } catch (error) {
        console.error('Критическая ошибка при загрузке каталога:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('technomodern_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Сохранение корзины в localStorage
  useEffect(() => {
    localStorage.setItem('technomodern_cart', JSON.stringify(cart))
  }, [cart])

  // Индикатор поиска с debounce
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery])

  // Добавление товара в корзину
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        supplier_name: product.supplier_name || 'Неизвестный поставщик',
        price: product.price,
        quantity: 1,
        total_price: product.price,
        currency: 'USD',
        image_url: product.images[0],
        sku: product.sku
      }
      setCart([...cart, cartItem])
    }
    setCartOpen(true)
  }

  // Изменение количества товара
  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity, total_price: newQuantity * item.price }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  // Удаление товара из корзины
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  // Подсчет суммы
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0)
  }

  // Фильтрация товаров с расширенным поиском
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim()

    // Расширенный поиск по 4 полям
    const matchesSearch = !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      (product.supplier_name?.toLowerCase().includes(query)) ||
      (product.sku?.toLowerCase().includes(query))

    // Фильтруем по названию категории (selectedCategory - это название, не ID)
    const matchesCategory = !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCategorySelect = (category: string, subcategory?: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory || '')
    setShowCategorySidebar(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - появляется после категорий */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 header-animate">
        <div className="header-container px-6 py-4 max-md:px-3 max-md:py-2">
          <div className="flex items-center gap-4 mb-4 max-md:mb-2 max-md:gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 max-md:gap-1 max-md:px-2">
                <ArrowLeft className="h-4 w-4 max-md:h-3 max-md:w-3" />
                <span className="max-md:text-xs">На главную</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 max-md:text-lg">Каталог товаров</h1>
          </div>

          <div className="flex items-center gap-4 max-md:gap-2">
            {/* Кнопка категорий (мобильная) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategorySidebar(!showCategorySidebar)}
              className="lg:hidden max-md:px-2 max-md:text-xs"
            >
              <Filter className="h-4 w-4 mr-2 max-md:mr-1 max-md:h-3 max-md:w-3" />
              <span className="max-md:hidden">Категории</span>
            </Button>

            {/* Новый компонент поиска с расширенным функционалом */}
            <div className="search-container-animate max-md:flex-1">
              <CatalogHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                totalProducts={products.length}
                filteredProducts={filteredProducts.length}
                isSearching={isSearching}
                onClearSearch={() => setSearchQuery('')}
              />
            </div>

            {/* Корзина */}
            <Button
              onClick={() => setCartOpen(!cartOpen)}
              variant="outline"
              className="relative h-12 px-4 max-md:h-9 max-md:px-2"
            >
              <ShoppingCart className="h-5 w-5 mr-2 max-md:h-4 max-md:w-4 max-md:mr-0" />
              <span className="hidden sm:inline max-md:hidden">Корзина</span>
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gray-900 text-white max-md:text-xs max-md:-top-1 max-md:-right-1">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Основной контент с пропорциями золотого сечения */}
      <div className="max-w-[1920px] mx-auto px-6 py-8 max-md:px-3 max-md:py-4">
        <div className="flex gap-8 max-md:gap-0">
          {/* Боковая панель категорий (десктоп) - появляется первой */}
          <div className={`
            ${showCategorySidebar ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto max-md:p-4' : 'hidden lg:block'}
            lg:static lg:w-[382px] lg:flex-shrink-0
          `}>
            {showCategorySidebar && (
              <div className="flex items-center justify-between mb-4 lg:hidden max-md:mb-3">
                <h2 className="text-xl font-bold max-md:text-lg">Категории</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategorySidebar(false)}
                  className="max-md:h-8 max-md:w-8 max-md:p-0"
                >
                  <X className="h-5 w-5 max-md:h-4 max-md:w-4" />
                </Button>
              </div>
            )}
            <CategoryBrowser
              products={products}
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
            />
          </div>

          {/* Сетка товаров - появляется последней */}
          <div className="flex-1">
            {/* Заголовок с пропорциями Fibonacci */}
            <div className="flex items-center justify-between mb-8 max-md:mb-4">
              <div>
                <h2 className="text-[40px] font-bold text-gray-900 leading-tight max-md:text-xl max-md:leading-snug">
                  {selectedCategory || 'Все товары'}
                </h2>
                {selectedSubcategory && (
                  <p className="text-[25px] text-gray-600 mt-2 max-md:text-base max-md:mt-1">{selectedSubcategory}</p>
                )}
              </div>
              <p className="text-[16px] text-gray-600 max-md:hidden">
                Найдено {filteredProducts.length} товаров
              </p>
            </div>

            {/* Индикатор загрузки */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-600">Загружаем товары из Supabase...</p>
                <p className="text-sm text-gray-400 mt-2">Загружено: {products.length}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">Товары не найдены</p>
                <p className="text-sm text-gray-400 mt-2">
                  Всего товаров: {products.length} | Фильтр: {selectedCategory || 'Все'} | Поиск: "{searchQuery}"
                </p>
              </div>
            ) : (
              /* Сетка товаров */
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Боковая панель корзины */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Header корзины */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Корзина</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {cart.length} товаров
              </p>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="h-16 w-16 mb-4" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                cart.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {item.supplier_name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-7 w-7 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 text-sm font-bold text-gray-900">
                          ${item.total_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Footer с итогом */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-2xl text-gray-900">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                  className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => alert('Функция создания заказа будет доступна скоро!')}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
