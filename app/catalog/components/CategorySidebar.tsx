'use client'

import React, { useState, useMemo } from 'react'
import { Package, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  level: number
  product_count: number
}

interface CategorySidebarProps {
  categories: Category[]
  selectedCategoryId: string
  onCategorySelect: (categoryId: string, closeSidebar?: boolean) => void
}

const categoryIcons: Record<string, string> = {
  'Электроника': '💻',
  'Дом и быт': '🏠',
  'Строительство': '🏗️',
  'Автотовары': '🚗',
  'Здоровье и красота': '💄',
  'Здоровье и медицина': '💊',
  'Промышленность': '🏭'
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  onCategorySelect
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Root категории
  const rootCategories = useMemo(() => {
    return categories.filter(c => c.parent_id === null)
  }, [categories])

  // Подкатегории по parent_id
  const getSubcategories = (parentId: string) => {
    return categories.filter(c => c.parent_id === parentId)
  }

  // Считаем товары для root категории (сумма подкатегорий)
  const getRootCategoryProductCount = (rootId: string) => {
    const subcats = getSubcategories(rootId)
    return subcats.reduce((sum, sub) => sum + (sub.product_count || 0), 0)
  }

  // Проверка - выбрана ли эта категория или её подкатегория
  const isCategoryOrChildSelected = (categoryId: string) => {
    if (categoryId === selectedCategoryId) return true
    const subcats = getSubcategories(categoryId)
    return subcats.some(s => s.id === selectedCategoryId)
  }

  // Переключение раскрытия
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

  // Автоматически раскрываем категорию если выбрана её подкатегория
  React.useEffect(() => {
    if (selectedCategoryId) {
      const selectedCat = categories.find(c => c.id === selectedCategoryId)
      if (selectedCat?.parent_id) {
        setExpandedCategories(prev => new Set([...prev, selectedCat.parent_id!]))
      }
    }
  }, [selectedCategoryId, categories])

  return (
    <div className="space-y-1">
      {/* Все товары */}
      <div className="category-item">
        <Button
          variant={!selectedCategoryId ? "default" : "ghost"}
          className={`w-full justify-start h-12 max-md:h-10 ${
            !selectedCategoryId
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onCategorySelect('', true)}
        >
          <Package className="h-5 w-5 mr-3 max-md:h-4 max-md:w-4 max-md:mr-2" />
          <span className="font-semibold max-md:text-sm">Все товары</span>
        </Button>
      </div>

      {/* Категории */}
      {rootCategories.map(rootCategory => {
        const subcategories = getSubcategories(rootCategory.id)
        const hasSubcategories = subcategories.length > 0
        const isExpanded = expandedCategories.has(rootCategory.id)
        const totalProducts = getRootCategoryProductCount(rootCategory.id)
        const icon = rootCategory.icon || categoryIcons[rootCategory.name] || '📦'
        const isSelected = isCategoryOrChildSelected(rootCategory.id)

        // Пропускаем пустые категории
        if (totalProducts === 0) return null

        return (
          <div key={rootCategory.id} className="category-item">
            {/* Root категория */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={`flex-1 justify-start h-12 max-md:h-10 hover:bg-gray-100 ${
                  selectedCategoryId === rootCategory.id ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  if (hasSubcategories) {
                    // Только раскрываем/сворачиваем подкатегории, НЕ выбираем и НЕ загружаем товары
                    toggleExpanded(rootCategory.id)
                  } else {
                    // Нет подкатегорий — выбираем и закрываем
                    onCategorySelect(rootCategory.id, true)
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

            {/* Подкатегории */}
            {hasSubcategories && isExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                {subcategories
                  .filter(sub => sub.product_count > 0)
                  .map(subcategory => {
                    const isSubSelected = selectedCategoryId === subcategory.id
                    return (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        className={`w-full justify-start h-10 max-md:h-9 text-sm max-md:text-xs ${
                          isSubSelected ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                        }`}
                        onClick={() => onCategorySelect(subcategory.id, true)}
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
