'use client'

import React from 'react'
import { Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
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

    // Порядок отображения категорий
    const categoryOrder = [
      'Красота и здоровье',
      'Спорт и отдых',
      'Электроника',
      'Дом и сад',
      'Одежда',
      'Автотовары',
      'Мебель',
      'Строительство'
    ]

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        id: name,
        name,
        icon: data.icon,
        count: data.count
      }))
      .sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.name)
        const indexB = categoryOrder.indexOf(b.name)
        // Если категория не в списке, ставим в конец
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
      })
  }, [products])

  return (
    <div className="space-y-2">
      {/* Кнопка "Все товары" */}
      <div className="category-item">
        <Button
          variant={!selectedCategory ? "default" : "ghost"}
          className={`w-full justify-start h-12 max-md:h-10 ${
            !selectedCategory
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onCategorySelect('')}
        >
          <Package className="h-5 w-5 mr-3 max-md:h-4 max-md:w-4 max-md:mr-2" />
          <span className="font-semibold max-md:text-sm">Все товары</span>
        </Button>
      </div>

      {/* Список категорий - динамический */}
      {dynamicCategories.map(category => {
        const isSelected = selectedCategory === category.name

        return (
          <div key={category.id} className="category-item">
            {/* Основная категория */}
            <Button
              variant="ghost"
              className={`w-full justify-start h-14 max-md:h-12 ${
                isSelected ? "bg-gray-100 text-gray-900 font-semibold" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                onCategorySelect(category.name)
              }}
            >
              <span className="text-2xl mr-3 max-md:text-xl max-md:mr-2">{category.icon}</span>
              <span className="font-semibold flex-1 text-left text-base max-md:text-sm">{category.name}</span>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
