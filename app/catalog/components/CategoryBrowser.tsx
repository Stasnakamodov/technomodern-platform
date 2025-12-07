'use client'

import React, { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { Product } from '@/types/catalog.types'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  level: number
  product_count: number
}

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
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Иконки для корневых категорий
  const categoryIcons: Record<string, string> = {
    'Электроника': '💻',
    'Дом и быт': '🏠',
    'Строительство': '🏗️',
    'Автотовары': '🚗',
    'Здоровье и красота': '💄',
    'Здоровье и медицина': '💊',
    'Промышленность': '🏭'
  }

  // Загружаем категории из Supabase
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, icon, parent_id, level, product_count')
        .order('name')

      if (error) {
        console.error('Ошибка загрузки категорий:', error)
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }
    loadCategories()
  }, [])

  // Корневые категории (parent_id = null)
  const rootCategories = React.useMemo(() => {
    return categories.filter(c => c.parent_id === null)
  }, [categories])

  // Подкатегории по parent_id
  const getSubcategories = (parentId: string) => {
    return categories.filter(c => c.parent_id === parentId)
  }

  // Считаем товары для корневой категории (сумма по подкатегориям)
  const getRootCategoryProductCount = (rootId: string) => {
    const subcats = getSubcategories(rootId)
    return subcats.reduce((sum, sub) => sum + (sub.product_count || 0), 0)
  }

  // Переключение раскрытия категории
  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-100 rounded mb-2"></div>
          <div className="h-10 bg-gray-100 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
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

      {/* Иерархический список категорий */}
      {rootCategories.map(rootCategory => {
        const subcategories = getSubcategories(rootCategory.id)
        const hasSubcategories = subcategories.length > 0
        const isExpanded = expandedCategories.has(rootCategory.id)
        const totalProducts = getRootCategoryProductCount(rootCategory.id)
        const icon = rootCategory.icon || categoryIcons[rootCategory.name] || '📦'

        // Пропускаем пустые корневые категории
        if (totalProducts === 0) return null

        return (
          <div key={rootCategory.id} className="category-item">
            {/* Корневая категория */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={`flex-1 justify-start h-12 max-md:h-10 hover:bg-gray-100 ${
                  selectedCategory === rootCategory.name ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  if (hasSubcategories) {
                    toggleExpanded(rootCategory.id)
                  } else {
                    onCategorySelect(rootCategory.name)
                  }
                }}
              >
                <span className="text-xl mr-2 max-md:text-lg">{icon}</span>
                <span className="font-medium flex-1 text-left text-sm max-md:text-xs">{rootCategory.name}</span>
                <span className="text-xs text-gray-500 mr-2">{totalProducts}</span>
                {hasSubcategories && (
                  isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Подкатегории (если раскрыты) */}
            {hasSubcategories && isExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                {subcategories
                  .filter(sub => sub.product_count > 0)
                  .map(subcategory => {
                    const isSubSelected = selectedCategory === subcategory.name
                    return (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        className={`w-full justify-start h-10 max-md:h-9 text-sm max-md:text-xs ${
                          isSubSelected ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                        }`}
                        onClick={() => onCategorySelect(subcategory.name)}
                      >
                        <span className="flex-1 text-left">{subcategory.name}</span>
                        <span className="text-xs text-gray-400">{subcategory.product_count}</span>
                      </Button>
                    )
                  })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
