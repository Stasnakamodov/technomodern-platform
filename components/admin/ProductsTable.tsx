'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Edit,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  sku?: string
  in_stock: boolean
  images?: string[]
  category_id?: string
  supplier_id?: string
  categories?: {
    id: string
    name: string
  } | { id: string; name: string }[]
  suppliers?: {
    id: string
    name: string
  } | { id: string; name: string }[]
}

interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

interface ProductsTableProps {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  currentPage: number
  totalPages: number
  searchParams: {
    search?: string
    category?: string
    supplier?: string
    stock?: string
  }
}

export function ProductsTable({
  products,
  categories,
  suppliers,
  currentPage,
  totalPages,
  searchParams
}: ProductsTableProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.search || '')

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(params.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    newParams.set('page', '1')
    router.push(`/admin/products?${newParams.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchValue || undefined })
  }

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(params.toString())
    newParams.set('page', page.toString())
    router.push(`/admin/products?${newParams.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Поиск по названию..."
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Найти
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={searchParams.category || ''}
              onChange={(e) => updateParams({ category: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={searchParams.supplier || ''}
              onChange={(e) => updateParams({ supplier: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Все поставщики</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>

            <select
              value={searchParams.stock || ''}
              onChange={(e) => updateParams({ stock: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Все товары</option>
              <option value="in_stock">В наличии</option>
              <option value="out_of_stock">Нет в наличии</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <Card className="overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            Товаров не найдено
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Image */}
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {product.sku && <span>Арт: {product.sku}</span>}
                    {product.categories && (
                      <span className="truncate">
                        {Array.isArray(product.categories)
                          ? product.categories[0]?.name
                          : product.categories.name}
                      </span>
                    )}
                    {product.suppliers && (
                      <span className="text-blue-600 truncate">
                        📦 {Array.isArray(product.suppliers)
                          ? product.suppliers[0]?.name
                          : product.suppliers.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Status */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">
                    {product.price?.toLocaleString('ru-RU')} ₽
                  </p>
                  <div className={cn(
                    'inline-flex items-center gap-1 mt-1 text-xs font-medium',
                    product.in_stock ? 'text-green-600' : 'text-red-600'
                  )}>
                    {product.in_stock ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        В наличии
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Нет в наличии
                      </>
                    )}
                  </div>
                </div>

                <Edit className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 px-4">
            Страница {currentPage} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
