'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CatalogDebugPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Загрузка товаров
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      // Загрузка категорий
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')

      const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || [])
      setCategories(categoriesMap)

      // Преобразование
      const transformed = productsData?.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: categoriesMap.get(p.category_id) || 'Без категории',
        category_id: p.category_id,
      })) || []

      setProducts(transformed)
      setLoading(false)
    }

    loadData()
  }, [])

  const beautyCategoryName = 'Красота и здоровье'
  const filteredBeauty = products.filter(p => p.category === beautyCategoryName)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Отладка каталога</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Статистика</h2>
            <p>Всего товаров: {products.length}</p>
            <p>Всего категорий: {categories.size}</p>
            <p>Товаров в "Красота и здоровье": {filteredBeauty.length}</p>
          </div>

          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Товары в "Красота и здоровье" (первые 20)</h2>
            <div className="space-y-2">
              {filteredBeauty.slice(0, 20).map((product, index) => (
                <div key={product.id} className="p-3 border rounded">
                  <p className="font-semibold">{index + 1}. {product.name}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-xs text-gray-400">ID: {product.category_id}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Проверка велосипедов</h2>
            {products.filter(p => p.name.includes('Велосипед')).slice(0, 10).map((bike, index) => (
              <div key={bike.id} className={`p-3 border rounded mb-2 ${bike.category === beautyCategoryName ? 'bg-red-100' : 'bg-green-50'}`}>
                <p className="font-semibold">{index + 1}. {bike.name}</p>
                <p className="text-sm">Category: {bike.category}</p>
                <p className="text-xs text-gray-400">ID: {bike.category_id}</p>
                {bike.category === beautyCategoryName && (
                  <p className="text-red-600 font-bold">❌ ОШИБКА: Велосипед в категории "Красота и здоровье"!</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
