'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Простая тестовая страница для проверки загрузки данных из Supabase
 * Открыть: http://localhost:3000/catalog-test
 */
export default function CatalogTestPage() {
  const [status, setStatus] = useState<string>('Инициализация...')
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function test() {
      try {
        setStatus('🔄 Загружаем товары из Supabase...')
        console.log('🔄 Начинаем загрузку...')

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(10)

        console.log('📦 Ответ:', { data, error })

        if (error) {
          setError(`Ошибка: ${JSON.stringify(error)}`)
          setStatus('❌ Ошибка загрузки')
          return
        }

        if (!data || data.length === 0) {
          setStatus('⚠️ Товары не найдены')
          return
        }

        setProducts(data)
        setStatus(`✅ Загружено ${data.length} товаров`)
      } catch (err: any) {
        console.error('Ошибка:', err)
        setError(err.message)
        setStatus('❌ Критическая ошибка')
      }
    }

    test()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Тест загрузки каталога</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Статус</h2>
          <p className="text-lg">{status}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded">
              {error}
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Загруженные товары</h2>
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.id} className="border-b pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{product.name}</p>
                      <p className="text-gray-600">{product.price} ₽</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/catalog"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ← Вернуться к каталогу
          </a>
        </div>
      </div>
    </div>
  )
}
