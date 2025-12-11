'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          setText: (text: string) => void
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
          }
        }
        sendData: (data: string) => void
        platform: string
        version: string
      }
    }
  }
}

interface Product {
  id: string
  name: string
  price: number | null
  min_order: number | null
  images: string[] | null
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
  product_count?: number
}

type SearchMode = 'none' | 'text' | 'photo' | 'link' | 'supplier'

// Supabase client - создаём один раз
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Проверяем наличие переменных окружения
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// SVG иконки
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LoaderIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export default function TelegramAppPage() {
  const [tg, setTg] = useState<Window['Telegram']>()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const initAttempts = useRef(0)
  const maxInitAttempts = 20

  // Поиск
  const [searchMode, setSearchMode] = useState<SearchMode>('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [supplierQuery, setSupplierQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Функция для добавления отладочной информации
  const addDebug = useCallback((msg: string) => {
    const timestamp = new Date().toISOString().slice(11, 23)
    console.log(`[TG App ${timestamp}]`, msg)
    setDebugInfo(prev => [...prev.slice(-9), `${timestamp}: ${msg}`])
  }, [])

  // Инициализация Telegram WebApp с retry логикой
  useEffect(() => {
    const initTelegram = () => {
      initAttempts.current++

      const telegram = window.Telegram?.WebApp

      if (telegram) {
        addDebug(`SDK найден! Platform: ${telegram.platform}, Version: ${telegram.version}`)

        try {
          telegram.ready()
          telegram.expand()
          setTg(window.Telegram)
          setSdkReady(true)
          addDebug('SDK инициализирован успешно')

          if (telegram.themeParams.bg_color) {
            document.body.style.backgroundColor = telegram.themeParams.bg_color
          }
        } catch (e) {
          addDebug(`Ошибка инициализации SDK: ${e}`)
        }
        return true
      }

      return false
    }

    if (initTelegram()) {
      return
    }

    addDebug('SDK не найден, ожидаем загрузки...')

    const interval = setInterval(() => {
      if (initTelegram() || initAttempts.current >= maxInitAttempts) {
        clearInterval(interval)

        if (initAttempts.current >= maxInitAttempts && !window.Telegram?.WebApp) {
          addDebug('Таймаут ожидания SDK - работаем без него')
          setSdkReady(true)
        }
      } else {
        addDebug(`Попытка ${initAttempts.current}/${maxInitAttempts}...`)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [addDebug])

  // Загрузка категорий
  const loadCategories = useCallback(async () => {
    if (!supabase) {
      setError('Ошибка конфигурации: Supabase не настроен')
      setLoading(false)
      return
    }

    try {
      addDebug('Загружаем категории...')

      const { data: allCategories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug, product_count')
        .gt('product_count', 0)
        .order('name')

      if (catError) throw catError

      addDebug(`Загружено ${allCategories?.length || 0} категорий`)
      setCategories(allCategories || [])

      if (allCategories && allCategories.length > 0) {
        const firstCat = allCategories[0]
        setSelectedCategory(firstCat.id)
        await loadProducts(firstCat.id)
      } else {
        addDebug('Нет категорий с товарами')
        setLoading(false)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      addDebug(`Ошибка загрузки: ${errorMsg}`)
      setError(`Ошибка загрузки каталога: ${errorMsg}`)
      setLoading(false)
    }
  }, [addDebug])

  // Загрузка товаров категории
  const loadProducts = useCallback(async (categoryId: string) => {
    if (!supabase) return

    setLoading(true)
    addDebug(`Загружаем товары категории ${categoryId}...`)

    try {
      const { data, error: prodError } = await supabase
        .from('products')
        .select('id, name, price, min_order, images, category_id')
        .eq('category_id', categoryId)
        .limit(20)

      if (prodError) throw prodError

      addDebug(`Загружено ${data?.length || 0} товаров`)
      setProducts(data || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      addDebug(`Ошибка загрузки товаров: ${errorMsg}`)
      setError(`Ошибка загрузки товаров: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }, [addDebug])

  useEffect(() => {
    if (sdkReady) {
      loadCategories()
    }
  }, [sdkReady, loadCategories])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchResults(null)
    setSearchMode('none')
    loadProducts(categoryId)
  }, [loadProducts])

  const handleProductClick = useCallback((product: Product) => {
    const telegram = tg?.WebApp
    if (telegram?.MainButton) {
      telegram.MainButton.setText(`Заказать: ${product.name.slice(0, 30)}...`)
      telegram.MainButton.show()
      telegram.MainButton.onClick(() => {
        telegram.sendData(JSON.stringify({
          action: 'order',
          product_id: product.id,
          product_name: product.name,
          price: product.price
        }))
      })
    }
  }, [tg])

  // Поиск по тексту
  const handleTextSearch = useCallback(async () => {
    if (!supabase || !searchQuery.trim()) return

    setSearchLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, min_order, images, category_id')
        .ilike('name', `%${searchQuery}%`)
        .limit(20)

      if (error) throw error
      setSearchResults(data || [])
      setSelectedCategory(null)
    } catch (err) {
      console.error('Ошибка поиска:', err)
    } finally {
      setSearchLoading(false)
    }
  }, [searchQuery])

  // Конвертация файла в base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  // Поиск по фото
  const handleImageSearch = useCallback(async () => {
    if (!selectedImage) return

    setSearchLoading(true)
    try {
      const base64Image = await fileToBase64(selectedImage)

      const response = await fetch('/api/catalog/search-by-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      })

      if (!response.ok) throw new Error('Ошибка поиска')

      const data = await response.json()
      setSearchResults(data.products || [])
      setSelectedCategory(null)
      setSearchMode('none')
    } catch (err) {
      console.error('Ошибка поиска по фото:', err)
      alert('Не удалось выполнить поиск по фото')
    } finally {
      setSearchLoading(false)
      setSelectedImage(null)
    }
  }, [selectedImage])

  // Поиск по ссылке
  const handleUrlSearch = useCallback(async () => {
    if (!urlInput.trim()) return

    setSearchLoading(true)
    try {
      const response = await fetch('/api/catalog/search-by-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      })

      if (!response.ok) throw new Error('Ошибка поиска')

      const data = await response.json()
      setSearchResults(data.products || [])
      setSelectedCategory(null)
      setSearchMode('none')
      setUrlInput('')
    } catch (err) {
      console.error('Ошибка поиска по URL:', err)
      alert('Не удалось выполнить поиск по ссылке')
    } finally {
      setSearchLoading(false)
    }
  }, [urlInput])

  // Закрыть панель поиска
  const closeSearchPanel = useCallback(() => {
    setSearchMode('none')
    setSelectedImage(null)
    setUrlInput('')
    setSupplierQuery('')
  }, [])

  // Тема
  const webapp = tg?.WebApp
  const bgColor = webapp?.themeParams?.bg_color || '#ffffff'
  const textColor = webapp?.themeParams?.text_color || '#000000'
  const buttonColor = webapp?.themeParams?.button_color || '#8B5CF6'
  const hintColor = webapp?.themeParams?.hint_color || '#e5e7eb'

  // Экран ошибки
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
          <p className="text-sm opacity-70 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              loadCategories()
            }}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: buttonColor, color: '#ffffff' }}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  // Начальная загрузка
  if (!sdkReady || (loading && categories.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: bgColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: buttonColor }}></div>
          <p className="mt-4" style={{ color: textColor }}>
            {!sdkReady ? 'Инициализация...' : 'Загрузка каталога...'}
          </p>
        </div>
      </div>
    )
  }

  const displayProducts = searchResults !== null ? searchResults : products

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b" style={{ backgroundColor: bgColor, borderColor: hintColor }}>
        <h1 className="text-xl font-bold mb-3">Каталог TechnoModern</h1>

        {/* Поисковая строка */}
        <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: hintColor }}>
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
            placeholder="Поиск товаров..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: textColor }}
          />

          {/* Кнопки функций поиска */}
          <div className="flex items-center gap-1 border-l pl-2" style={{ borderColor: textColor + '30' }}>
            <button
              onClick={() => setSearchMode(searchMode === 'photo' ? 'none' : 'photo')}
              className="p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: searchMode === 'photo' ? buttonColor + '30' : 'transparent',
                color: searchMode === 'photo' ? buttonColor : textColor + '80'
              }}
              title="Поиск по фото"
            >
              <CameraIcon />
            </button>
            <button
              onClick={() => setSearchMode(searchMode === 'link' ? 'none' : 'link')}
              className="p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: searchMode === 'link' ? '#22c55e30' : 'transparent',
                color: searchMode === 'link' ? '#22c55e' : textColor + '80'
              }}
              title="Поиск по ссылке"
            >
              <LinkIcon />
            </button>
            <button
              onClick={() => setSearchMode(searchMode === 'supplier' ? 'none' : 'supplier')}
              className="p-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: searchMode === 'supplier' ? '#f97316' + '30' : 'transparent',
                color: searchMode === 'supplier' ? '#f97316' : textColor + '80'
              }}
              title="Найти поставщика"
            >
              <GlobeIcon />
            </button>
          </div>
        </div>

        {/* Панель поиска по фото */}
        {searchMode === 'photo' && (
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: hintColor }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: buttonColor }}>
                  <CameraIcon />
                </div>
                <span className="font-medium text-sm">Поиск по фото</span>
              </div>
              <button onClick={closeSearchPanel} className="p-1 opacity-60">
                <CloseIcon />
              </button>
            </div>
            <p className="text-xs opacity-60 mb-3">Загрузите фото товара - найдём аналоги</p>

            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer" style={{ borderColor: hintColor }}>
              <UploadIcon />
              <span className="text-sm">{selectedImage ? selectedImage.name : 'Выберите фото'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <button
              onClick={handleImageSearch}
              disabled={!selectedImage || searchLoading}
              className="w-full mt-3 py-2.5 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: buttonColor }}
            >
              {searchLoading ? <LoaderIcon /> : 'Найти товар'}
            </button>
          </div>
        )}

        {/* Панель поиска по ссылке */}
        {searchMode === 'link' && (
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: hintColor }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                  <LinkIcon />
                </div>
                <span className="font-medium text-sm">Поиск по ссылке</span>
              </div>
              <button onClick={closeSearchPanel} className="p-1 opacity-60">
                <CloseIcon />
              </button>
            </div>
            <p className="text-xs opacity-60 mb-3">Вставьте ссылку на товар - найдём аналоги дешевле</p>

            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://aliexpress.com/item/..."
              className="w-full p-3 rounded-lg text-sm border-none outline-none"
              style={{ backgroundColor: bgColor, color: textColor }}
            />

            <button
              onClick={handleUrlSearch}
              disabled={!urlInput.trim() || searchLoading}
              className="w-full mt-3 py-2.5 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: '#22c55e' }}
            >
              {searchLoading ? <LoaderIcon /> : 'Найти аналоги'}
            </button>
          </div>
        )}

        {/* Панель поиска поставщика */}
        {searchMode === 'supplier' && (
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: hintColor }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                  <GlobeIcon />
                </div>
                <span className="font-medium text-sm">Найти поставщика</span>
              </div>
              <button onClick={closeSearchPanel} className="p-1 opacity-60">
                <CloseIcon />
              </button>
            </div>
            <p className="text-xs opacity-60 mb-3">Опишите товар - мы найдём надёжного поставщика</p>

            <textarea
              value={supplierQuery}
              onChange={(e) => setSupplierQuery(e.target.value)}
              placeholder="Опишите нужный товар..."
              rows={3}
              className="w-full p-3 rounded-lg text-sm border-none outline-none resize-none"
              style={{ backgroundColor: bgColor, color: textColor }}
            />

            <button
              onClick={() => {
                alert('Заявка отправлена! Мы свяжемся с вами.')
                closeSearchPanel()
              }}
              disabled={!supplierQuery.trim()}
              className="w-full mt-3 py-2.5 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: '#f97316' }}
            >
              Оставить заявку
            </button>
          </div>
        )}
      </div>

      {/* Результаты поиска */}
      {searchResults !== null && (
        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: hintColor }}>
          <span className="text-sm">Найдено: {searchResults.length} товаров</span>
          <button
            onClick={() => {
              setSearchResults(null)
              setSearchQuery('')
              if (selectedCategory) loadProducts(selectedCategory)
            }}
            className="text-sm font-medium"
            style={{ color: buttonColor }}
          >
            Сбросить
          </button>
        </div>
      )}

      {/* Categories */}
      {searchResults === null && (
        <div className="overflow-x-auto border-b" style={{ borderColor: hintColor }}>
          <div className="flex gap-2 p-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all text-sm"
                style={{
                  backgroundColor: selectedCategory === cat.id ? buttonColor : 'transparent',
                  color: selectedCategory === cat.id ? (webapp?.themeParams?.button_text_color || '#ffffff') : textColor,
                  border: selectedCategory === cat.id ? 'none' : `1px solid ${hintColor}`
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading || searchLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: buttonColor }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="rounded-2xl overflow-hidden border transition-all active:scale-95"
              style={{ borderColor: hintColor, backgroundColor: bgColor }}
            >
              {product.images && product.images.length > 0 ? (
                <div className="aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center" style={{ backgroundColor: hintColor }}>
                  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="p-2.5">
                <h3 className="font-medium text-xs line-clamp-2 mb-1">{product.name}</h3>
                {product.price && (
                  <p className="text-base font-bold" style={{ color: buttonColor }}>
                    {product.price.toLocaleString()} ₽
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {displayProducts.length === 0 && !loading && !searchLoading && (
        <div className="text-center p-12">
          <p className="opacity-70">
            {searchResults !== null ? 'Ничего не найдено' : 'Товары скоро появятся'}
          </p>
        </div>
      )}
    </div>
  )
}
