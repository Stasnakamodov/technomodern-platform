'use client'

import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CatalogHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  totalProducts: number
  filteredProducts: number
  isSearching?: boolean
  onClearSearch?: () => void
  placeholder?: string
}

export default function CatalogHeader({
  searchQuery,
  setSearchQuery,
  totalProducts,
  filteredProducts,
  isSearching = false,
  onClearSearch,
  placeholder = 'Поиск по названию, описанию, поставщику, артикулу...'
}: CatalogHeaderProps) {

  const handleClear = () => {
    setSearchQuery('')
    onClearSearch?.()
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 rounded-lg shadow-sm search-panel-animate">
      <div className="flex flex-col gap-4">
        {/* Поле поиска */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />

          {/* Индикатор загрузки */}
          {isSearching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
            </div>
          )}

          {/* Кнопка очистки */}
          {searchQuery && !isSearching && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Очистить поиск"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Счетчик товаров */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {searchQuery ? (
              <span>
                Найдено <span className="font-semibold text-purple-600">{filteredProducts}</span> из {totalProducts} товаров
              </span>
            ) : (
              <span>
                Всего <span className="font-semibold text-gray-900">{totalProducts}</span> товаров
              </span>
            )}
          </div>

          {searchQuery && filteredProducts === 0 && (
            <button
              onClick={handleClear}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Сбросить поиск
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
