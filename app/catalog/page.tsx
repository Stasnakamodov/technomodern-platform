import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import CatalogClient from './components/CatalogClient'
import { getProductsDirect, getCategories } from '@/lib/catalog'
import type { ProductFromAPI, CategoryFromAPI } from '@/types/catalog.types'

// Метаданные для SEO
export const metadata = {
  title: 'Каталог товаров | ТехноМодерн',
  description: 'Оптовый каталог товаров от проверенных поставщиков. Электроника, дом и быт, строительство, автотовары и многое другое.',
}

// Revalidate каждые 60 секунд
export const revalidate = 60

// Loading component
function CatalogLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Загружаем каталог...</p>
      </div>
    </div>
  )
}

// Серверный компонент
async function CatalogContent() {
  try {
    // Загружаем данные на сервере параллельно
    const [productsData, categories] = await Promise.all([
      getProductsDirect({
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'desc'
      }),
      getCategories()
    ])

    return (
      <CatalogClient
        initialProducts={productsData.products as ProductFromAPI[]}
        initialCategories={categories as CategoryFromAPI[]}
        initialTotal={productsData.total}
        initialHasMore={productsData.hasMore}
      />
    )
  } catch (error) {
    console.error('Failed to load catalog:', error)

    // Fallback - пустой каталог
    return (
      <CatalogClient
        initialProducts={[]}
        initialCategories={[]}
        initialTotal={0}
        initialHasMore={false}
      />
    )
  }
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  )
}
