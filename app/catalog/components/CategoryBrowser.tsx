'use client'

import React from 'react'
import { Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from '@/types/catalog.types'

interface CategoryBrowserProps {
  products: Product[]
  onCategorySelect: (category: string, subcategory?: string) => void
  selectedCategory?: string
  selectedSubcategory?: string
}

export default function CategoryBrowser({
  products,
  onCategorySelect,
  selectedCategory
}: CategoryBrowserProps) {

  // Динамически строим список категорий из реальных товаров
  const dynamicCategories = React.useMemo(() => {
    // Если товары ещё не загрузились - возвращаем пустой массив
    if (!products || products.length === 0) {
      return []
    }

    const categoryMap = new Map<string, { count: number, icon: string }>()

    // Иконки для категорий
    const categoryIcons: Record<string, string> = {
      'Электроника': '💻',
      'Одежда': '👕',
      'Мебель': '🪑',
      'Строительство': '🏗️',
      'Автотовары': '🚗',
      'Дом и сад': '🏡',
      'Спорт и отдых': '⚽',
      'Красота и здоровье': '💄'
    }

    products.forEach(product => {
      const category = product.category || 'Без категории'
      const current = categoryMap.get(category) || { count: 0, icon: categoryIcons[category] || '📦' }
      categoryMap.set(category, { count: current.count + 1, icon: current.icon })
    })

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      id: name,
      name,
      icon: data.icon,
      count: data.count
    }))
  }, [products])

  return (
    <div className="space-y-2">
      {/* Кнопка "Все товары" */}
      <Button
        variant={!selectedCategory ? "default" : "ghost"}
        className={`w-full justify-start h-12 max-md:h-10 ${
          !selectedCategory
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onCategorySelect('')}
      >
        <Package className="h-5 w-5 mr-3 max-md:h-4 max-md:w-4 max-md:mr-2" />
        <span className="font-semibold max-md:text-sm">Все товары</span>
        <Badge variant="secondary" className="ml-auto max-md:text-xs">
          {products.length}
        </Badge>
      </Button>

      {/* Список категорий - динамический */}
      {dynamicCategories.map(category => {
        const isSelected = selectedCategory === category.name

        return (
          <div key={category.id} className="space-y-1">
            {/* Основная категория */}
            <Button
              variant="ghost"
              className={`w-full justify-start h-12 max-md:h-10 ${
                isSelected ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                onCategorySelect(category.name)
              }}
            >
              <span className="text-xl mr-3 max-md:text-base max-md:mr-2">{category.icon}</span>
              <span className="font-semibold flex-1 text-left max-md:text-sm">{category.name}</span>
              <Badge variant="secondary" className="mr-2 max-md:text-xs max-md:mr-1">
                {category.count}
              </Badge>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
