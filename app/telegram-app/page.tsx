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

// Supabase client - создаём один раз
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Проверяем наличие переменных окружения
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

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
  const maxInitAttempts = 20 // 2 секунды максимум

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

          // Применяем тему
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

    // Пробуем сразу
    if (initTelegram()) {
      return
    }

    // Если SDK ещё не загружен, ждём с интервалом
    addDebug('SDK не найден, ожидаем загрузки...')

    const interval = setInterval(() => {
      if (initTelegram() || initAttempts.current >= maxInitAttempts) {
        clearInterval(interval)

        if (initAttempts.current >= maxInitAttempts && !window.Telegram?.WebApp) {
          addDebug('Таймаут ожидания SDK - работаем без него')
          setSdkReady(true) // Продолжаем работу без SDK
        }
      } else {
        addDebug(`Попытка ${initAttempts.current}/${maxInitAttempts}...`)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [addDebug])

  // Загрузка категорий - оптимизированная версия
  const loadCategories = useCallback(async () => {
    if (!supabase) {
      setError('Ошибка конфигурации: Supabase не настроен')
      setLoading(false)
      return
    }

    try {
      addDebug('Загружаем категории...')

      // Используем product_count из таблицы категорий вместо подсчёта всех товаров
      const { data: allCategories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug, product_count')
        .gt('product_count', 0) // Только категории с товарами
        .order('name')

      if (catError) {
        throw catError
      }

      addDebug(`Загружено ${allCategories?.length || 0} категорий`)

      setCategories(allCategories || [])

      // Загружаем товары первой категории
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

      if (prodError) {
        throw prodError
      }

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

  // Загружаем категории после инициализации SDK
  useEffect(() => {
    if (sdkReady) {
      loadCategories()
    }
  }, [sdkReady, loadCategories])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
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

          {/* Debug info */}
          <details className="mt-4 text-left text-xs opacity-50">
            <summary>Отладка</summary>
            <pre className="mt-2 p-2 rounded overflow-auto max-h-40" style={{ backgroundColor: hintColor }}>
              {debugInfo.join('\n')}
            </pre>
          </details>
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

          {/* Debug info при долгой загрузке */}
          {initAttempts.current > 5 && (
            <details className="mt-4 text-left text-xs opacity-50">
              <summary style={{ color: textColor }}>Отладка</summary>
              <pre className="mt-2 p-2 rounded overflow-auto max-h-32 text-xs" style={{ backgroundColor: hintColor, color: textColor }}>
                {debugInfo.join('\n')}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b" style={{
        backgroundColor: bgColor,
        borderColor: hintColor
      }}>
        <h1 className="text-2xl font-bold">Каталог TechnoModern</h1>
        {webapp?.initDataUnsafe?.user && (
          <p className="text-sm opacity-70">
            Привет, {webapp.initDataUnsafe.user.first_name}!
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="overflow-x-auto border-b" style={{ borderColor: hintColor }}>
        <div className="flex gap-2 p-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all"
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

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: buttonColor }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="rounded-2xl overflow-hidden border-2 transition-all active:scale-95"
              style={{
                borderColor: hintColor,
                backgroundColor: bgColor
              }}
            >
              {/* Product Image */}
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
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ backgroundColor: hintColor }}
                >
                  <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                {product.price && (
                  <p className="text-lg font-bold" style={{ color: buttonColor }}>
                    {product.price.toLocaleString()} ₽
                  </p>
                )}
                {product.min_order && (
                  <p className="text-xs opacity-70 mt-1">
                    Мин. заказ: {product.min_order} шт.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center p-12">
          <p className="opacity-70">Товары в этой категории скоро появятся</p>
        </div>
      )}
    </div>
  )
}
