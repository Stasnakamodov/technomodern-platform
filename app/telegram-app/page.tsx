'use client'

import { useEffect, useState } from 'react'
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
      }
    }
  }
}

interface Product {
  id: string
  name: string
  price: number | null
  min_order: number | null
  image_url: string | null
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TelegramAppPage() {
  const [tg, setTg] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Telegram WebApp
    const telegram = window.Telegram?.WebApp
    if (telegram) {
      telegram.ready()
      telegram.expand()
      setTg(telegram)

      // Apply theme
      if (telegram.themeParams.bg_color) {
        document.body.style.backgroundColor = telegram.themeParams.bg_color
      }
    }

    // Load categories
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) {
      setCategories(data)
      if (data.length > 0) {
        loadProducts(data[0].id)
        setSelectedCategory(data[0].id)
      }
    }
    setLoading(false)
  }

  const loadProducts = async (categoryId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .limit(20)

    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    loadProducts(categoryId)
  }

  const handleProductClick = (product: Product) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(`Заказать: ${product.name}`)
      tg.MainButton.show()
      tg.MainButton.onClick(() => {
        // Send data back to bot
        tg.sendData(JSON.stringify({
          action: 'order',
          product_id: product.id,
          product_name: product.name,
          price: product.price
        }))
      })
    }
  }

  const bgColor = tg?.themeParams?.bg_color || '#ffffff'
  const textColor = tg?.themeParams?.text_color || '#000000'
  const buttonColor = tg?.themeParams?.button_color || '#8B5CF6'

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4" style={{ color: textColor }}>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b" style={{
        backgroundColor: bgColor,
        borderColor: tg?.themeParams?.hint_color || '#e5e7eb'
      }}>
        <h1 className="text-2xl font-bold">Каталог TechnoModern</h1>
        {tg?.initDataUnsafe?.user && (
          <p className="text-sm opacity-70">
            Привет, {tg.initDataUnsafe.user.first_name}!
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="overflow-x-auto border-b" style={{
        borderColor: tg?.themeParams?.hint_color || '#e5e7eb'
      }}>
        <div className="flex gap-2 p-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === cat.id ? buttonColor : 'transparent',
                color: selectedCategory === cat.id ? (tg?.themeParams?.button_text_color || '#ffffff') : textColor,
                border: selectedCategory === cat.id ? 'none' : `1px solid ${tg?.themeParams?.hint_color || '#e5e7eb'}`
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
                borderColor: tg?.themeParams?.hint_color || '#e5e7eb',
                backgroundColor: tg?.themeParams?.bg_color || '#ffffff'
              }}
            >
              {/* Product Image */}
              {product.image_url ? (
                <div className="aspect-square relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ backgroundColor: tg?.themeParams?.hint_color || '#f3f4f6' }}
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
