'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ShoppingCart, X, Plus, Minus, Package, ArrowLeft, Filter, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown, Check
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategorySidebar from './CategorySidebar'
import { ProductGridSkeleton } from './ProductSkeleton'
import CatalogHeader from '@/components/catalog/CatalogHeader'

// Импорт типов из единого места
import type {
  ProductFromAPI,
  CategoryFromAPI,
  CartItem,
  SortBy,
  SortOrder,
  CatalogClientProps
} from '@/types/catalog.types'
import { apiProductToUI } from '@/types/catalog.types'

const PRODUCTS_PER_PAGE = 20

// Опции сортировки
const SORT_OPTIONS: { value: string; label: string; sortBy: SortBy; sortOrder: SortOrder }[] = [
  { value: 'created_at-desc', label: 'Сначала новые', sortBy: 'created_at', sortOrder: 'desc' },
  { value: 'created_at-asc', label: 'Сначала старые', sortBy: 'created_at', sortOrder: 'asc' },
  { value: 'price-asc', label: 'Сначала дешёвые', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Сначала дорогие', sortBy: 'price', sortOrder: 'desc' },
  { value: 'name-asc', label: 'По названию А-Я', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name-desc', label: 'По названию Я-А', sortBy: 'name', sortOrder: 'desc' },
]

export default function CatalogClient({
  initialProducts,
  initialCategories,
  initialTotal,
  initialHasMore,
  initialSortBy = 'created_at',
  initialSortOrder = 'desc'
}: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [products, setProducts] = useState<ProductFromAPI[]>(initialProducts)
  const [categories] = useState<CategoryFromAPI[]>(initialCategories)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Фильтры из URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategoryId, setSelectedCategoryId] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState<SortBy>(
    (searchParams.get('sortBy') as SortBy) || initialSortBy
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || initialSortOrder
  )

  // UI state
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [showCategorySidebar, setShowCategorySidebar] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductFromAPI | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Refs для AbortController и debounce
  const abortControllerRef = useRef<AbortController | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchedPages = useRef<Set<number>>(new Set())
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)
  const isLoadingMoreRef = useRef(false) // Защита от race condition

  // Загрузка товаров с API (с AbortController)
  const fetchProducts = useCallback(async (
    categoryId: string,
    search: string,
    pageNum: number,
    currentSortBy: SortBy,
    currentSortOrder: SortOrder,
    append: boolean = false
  ) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Создаём новый AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller

    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const params = new URLSearchParams()
      if (categoryId) {
        const cat = categories.find(c => c.id === categoryId)
        if (cat?.parent_id === null) {
          params.set('parent_category_id', categoryId)
        } else {
          params.set('category_id', categoryId)
        }
      }
      if (search) params.set('search', search)
      params.set('page', pageNum.toString())
      params.set('limit', PRODUCTS_PER_PAGE.toString())
      params.set('sortBy', currentSortBy)
      params.set('sortOrder', currentSortOrder)

      const res = await fetch(`/api/catalog/products?${params}`, {
        signal: controller.signal
      })

      const data = await res.json()

      if (data.error) {
        console.error('API error:', data.error)
        return
      }

      // DEBUG: логируем что получили от API
      console.log(`[Catalog] Page ${pageNum}: received ${data.products?.length || 0} products, total: ${data.total}, hasMore: ${data.hasMore}`)

      if (append) {
        // Дедупликация: добавляем только товары с новыми id
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newProducts = data.products.filter((p: ProductFromAPI) => !existingIds.has(p.id))
          console.log(`[Catalog] Append: prev=${prev.length}, new=${newProducts.length}, duplicates=${data.products.length - newProducts.length}`)
          return [...prev, ...newProducts]
        })
      } else {
        setProducts(data.products)
      }

      setTotal(data.total)
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      // Игнорируем ошибку отмены запроса
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      isLoadingMoreRef.current = false
    }
  }, [categories])

  // Обновление URL без перезагрузки (теперь с сортировкой)
  const updateURL = useCallback((
    categoryId: string,
    search: string,
    currentSortBy: SortBy,
    currentSortOrder: SortOrder
  ) => {
    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (search) params.set('search', search)
    // Сохраняем сортировку в URL только если не дефолтная
    if (currentSortBy !== 'created_at' || currentSortOrder !== 'desc') {
      params.set('sortBy', currentSortBy)
      params.set('sortOrder', currentSortOrder)
    }

    const newURL = params.toString() ? `/catalog?${params}` : '/catalog'
    router.push(newURL, { scroll: false })
  }, [router])

  // Выбор категории
  const handleCategorySelect = useCallback((categoryId: string, closeSidebar: boolean = true) => {
    setSelectedCategoryId(categoryId)
    setPage(1)
    updateURL(categoryId, searchQuery, sortBy, sortOrder)
    fetchProducts(categoryId, searchQuery, 1, sortBy, sortOrder, false)
    // Закрываем сайдбар только если явно указано (для подкатегорий и root без подкатегорий)
    if (closeSidebar) {
      setShowCategorySidebar(false)
    }
  }, [searchQuery, sortBy, sortOrder, updateURL, fetchProducts])

  // Поиск с debounce и отменой предыдущих запросов
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)

    // Очищаем предыдущий таймаут
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1)
      updateURL(selectedCategoryId, query, sortBy, sortOrder)
      fetchProducts(selectedCategoryId, query, 1, sortBy, sortOrder, false)
    }, 300)
  }, [selectedCategoryId, sortBy, sortOrder, updateURL, fetchProducts])

  // Изменение сортировки
  const handleSortChange = useCallback((value: string) => {
    const option = SORT_OPTIONS.find(o => o.value === value)
    if (!option) return

    setSortBy(option.sortBy)
    setSortOrder(option.sortOrder)
    setPage(1)
    updateURL(selectedCategoryId, searchQuery, option.sortBy, option.sortOrder)
    fetchProducts(selectedCategoryId, searchQuery, 1, option.sortBy, option.sortOrder, false)
  }, [selectedCategoryId, searchQuery, updateURL, fetchProducts])

  // Загрузить ещё
  const loadMore = useCallback(() => {
    // Двойная проверка: state + ref для защиты от race condition
    if (!hasMore || loadingMore || isLoadingMoreRef.current) return
    isLoadingMoreRef.current = true
    fetchProducts(selectedCategoryId, searchQuery, page + 1, sortBy, sortOrder, true)
  }, [hasMore, loadingMore, selectedCategoryId, searchQuery, page, sortBy, sortOrder, fetchProducts])

  // Prefetch следующей страницы для instant UX
  const prefetchNextPage = useCallback(() => {
    if (!hasMore || loading || loadingMore) return

    const nextPage = page + 1
    // Не префетчим если уже загрузили эту страницу
    if (prefetchedPages.current.has(nextPage)) return
    prefetchedPages.current.add(nextPage)

    const params = new URLSearchParams()
    if (selectedCategoryId) {
      const cat = categories.find(c => c.id === selectedCategoryId)
      if (cat?.parent_id === null) {
        params.set('parent_category_id', selectedCategoryId)
      } else {
        params.set('category_id', selectedCategoryId)
      }
    }
    if (searchQuery) params.set('search', searchQuery)
    params.set('page', nextPage.toString())
    params.set('limit', PRODUCTS_PER_PAGE.toString())
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)

    // Используем fetch с low priority для prefetch
    fetch(`/api/catalog/products?${params}`, {
      priority: 'low'
    } as RequestInit).catch(() => {
      // Игнорируем ошибки prefetch
    })
  }, [hasMore, loading, loadingMore, page, selectedCategoryId, searchQuery, sortBy, sortOrder, categories])

  // Сбрасываем prefetched pages при изменении фильтров
  useEffect(() => {
    prefetchedPages.current.clear()
  }, [selectedCategoryId, searchQuery, sortBy, sortOrder])

  // IntersectionObserver для prefetch когда пользователь близок к "Загрузить ещё"
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current
    if (!trigger) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          prefetchNextPage()
        }
      },
      { rootMargin: '400px' } // Начинаем prefetch за 400px до появления кнопки
    )

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [prefetchNextPage])

  // Синхронизация с URL при изменении
  useEffect(() => {
    const urlCategory = searchParams.get('category') || ''
    const urlSearch = searchParams.get('search') || ''
    const urlSortBy = (searchParams.get('sortBy') as SortBy) || 'created_at'
    const urlSortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc'

    const needsUpdate =
      urlCategory !== selectedCategoryId ||
      urlSearch !== searchQuery ||
      urlSortBy !== sortBy ||
      urlSortOrder !== sortOrder

    if (needsUpdate) {
      setSelectedCategoryId(urlCategory)
      setSearchQuery(urlSearch)
      setSortBy(urlSortBy)
      setSortOrder(urlSortOrder)
      fetchProducts(urlCategory, urlSearch, 1, urlSortBy, urlSortOrder, false)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Корзина - загрузка из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('technomodern_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        // Игнорируем невалидный JSON
      }
    }
  }, [])

  // Сохранение корзины
  useEffect(() => {
    localStorage.setItem('technomodern_cart', JSON.stringify(cart))
  }, [cart])

  // Добавление в корзину с toast уведомлением
  const addToCart = (product: ProductFromAPI) => {
    const existingItem = cart.find(item => item.id === product.id)
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity, total_price: newQuantity * item.price }
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
        currency: 'RUB',
        image_url: product.images[0],
        sku: product.sku || undefined
      }
      setCart([...cart, cartItem])
    }

    // Toast уведомление вместо открытия сайдбара
    toast.success(
      <div className="flex items-center gap-3">
        <Check className="h-4 w-4 text-green-600" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <p className="text-xs text-gray-500">
            {existingItem ? `Количество: ${newQuantity}` : 'Добавлено в корзину'}
          </p>
        </div>
      </div>,
      {
        duration: 2000,
        action: {
          label: 'Корзина',
          onClick: () => setCartOpen(true)
        }
      }
    )
  }

  // Изменение количества
  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity, total_price: newQuantity * item.price }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  // Удаление из корзины
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  // Общая сумма
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0)
  }

  // Название выбранной категории
  const selectedCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name || 'Категория'
    : 'Все товары'

  // Текущее значение сортировки для Select
  const currentSortValue = `${sortBy}-${sortOrder}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-4 max-md:px-3 max-md:py-2">
          <div className="flex items-center gap-4 max-md:gap-2">
            <Link href="/" className="inline-flex items-center gap-2 max-md:gap-1 px-3 py-2 max-md:px-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <ArrowLeft className="h-4 w-4 max-md:h-3 max-md:w-3" />
              <span className="max-md:text-xs">На главную</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 max-md:text-lg">Каталог товаров</h1>
          </div>
        </div>
      </div>

      {/* Sticky Search */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-6 py-2 max-md:px-3 max-md:py-2">
          <div className="flex items-center gap-4 max-md:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategorySidebar(!showCategorySidebar)}
              className="lg:hidden max-md:px-2 max-md:text-xs"
            >
              <Filter className="h-4 w-4 mr-2 max-md:mr-1 max-md:h-3 max-md:w-3" />
              <span className="max-md:hidden">Категории</span>
            </Button>

            <div className="flex-1">
              <CatalogHeader
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                totalProducts={total}
                filteredProducts={products.length}
                isSearching={loading}
                onClearSearch={() => handleSearchChange('')}
              />
            </div>

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

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-8 max-md:px-3 max-md:py-4">
        <div className="flex gap-8 max-md:gap-0">
          {/* Sidebar */}
          <div className={`
            ${showCategorySidebar ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto max-md:p-4' : 'hidden lg:block'}
            lg:static lg:w-[260px] lg:flex-shrink-0
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
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 max-md:mb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-[40px] font-bold text-gray-900 leading-tight max-md:text-xl max-md:leading-snug">
                  {selectedCategoryName}
                </h2>
                <p className="text-[16px] text-gray-600 mt-1 max-md:text-sm">
                  {loading ? 'Загрузка...' : `Найдено ${total} товаров`}
                </p>
              </div>

              {/* Сортировка */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500 max-md:hidden" />
                <Select value={currentSortValue} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] max-md:w-[140px] max-md:text-xs">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          {option.sortOrder === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading state - показываем скелетоны */}
            {loading && products.length === 0 ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">Товары не найдены</p>
                <p className="text-sm text-gray-400 mt-2">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={apiProductToUI(product)}
                      onAddToCart={() => addToCart(product)}
                      onViewDetails={() => {
                        setSelectedProduct(product)
                        setIsModalOpen(true)
                      }}
                    />
                  ))}
                </div>

                {/* Prefetch trigger - невидимый элемент для IntersectionObserver */}
                <div ref={loadMoreTriggerRef} className="h-1" aria-hidden="true" />

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={loadMore}
                      disabled={loadingMore}
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        `Загрузить ещё (${total - products.length} осталось)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md max-md:max-w-full bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-6 max-md:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl max-md:text-xl font-bold text-gray-900">Корзина</h2>
                <Button variant="ghost" size="sm" onClick={() => setCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{cart.length} товаров</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-md:p-4 space-y-4 max-md:space-y-3">
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
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                            unoptimized
                          />
                        </div>
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
                          {item.total_price.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 max-md:p-4 border-t border-gray-200 space-y-4 max-md:space-y-3">
                <div className="flex items-center justify-between text-lg max-md:text-base font-bold">
                  <span>Итого:</span>
                  <span className="text-2xl max-md:text-xl text-gray-900">
                    {getTotalPrice().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <Button
                  className="w-full h-12 max-md:h-10 text-base max-md:text-sm bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => alert('Функция создания заказа будет доступна скоро!')}
                >
                  <Package className="h-5 w-5 max-md:h-4 max-md:w-4 mr-2" />
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct ? apiProductToUI(selectedProduct) : null}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={() => {
          if (selectedProduct) addToCart(selectedProduct)
        }}
      />
    </div>
  )
}
