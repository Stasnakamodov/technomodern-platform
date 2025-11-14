'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Eye,
  MessageCircle,
  ShoppingCart,
  Package,
  DollarSign,
  Building2,
  Image as ImageIcon
} from "lucide-react"
import type { Product } from '@/types/catalog.types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  onContactSupplier?: (productId: string) => void
}

// Категории товаров для ТехноМодерн
const CATEGORIES = {
  "Электроника": { name: "Электроника", icon: "💻", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Мебель": { name: "Мебель", icon: "🪑", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Одежда": { name: "Одежда", icon: "👕", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "Строительство": { name: "Строительство", icon: "🏗️", color: "bg-orange-50 text-orange-700 border-orange-200" },
  "Красота и здоровье": { name: "Красота и здоровье", icon: "💄", color: "bg-pink-50 text-pink-700 border-pink-200" },
  "Спорт и отдых": { name: "Спорт и отдых", icon: "⚽", color: "bg-green-50 text-green-700 border-green-200" },
  "Дом и сад": { name: "Дом и сад", icon: "🏡", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Текстиль": { name: "Текстиль", icon: "🧵", color: "bg-violet-50 text-violet-700 border-violet-200" },
  "Оборудование": { name: "Оборудование", icon: "⚙️", color: "bg-gray-50 text-gray-700 border-gray-200" },
  "Автотовары": { name: "Автотовары", icon: "🚗", color: "bg-red-50 text-red-700 border-red-200" }
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onContactSupplier
}: ProductCardProps) {
  // Безопасность: проверка данных товара
  if (!product || !product.id || !product.name) {
    console.error('❌ ProductCard: Некорректные данные товара', product)
    return null
  }

  const category = CATEGORIES[product.category as keyof typeof CATEGORIES] || CATEGORIES["Электроника"]

  return (
    <div className="hover:-translate-y-1 transition-transform duration-200">
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-gray-200 hover:border-purple-300 bg-white overflow-hidden flex flex-col min-h-[500px] max-md:min-h-[400px]">
        {/* Изображение товара */}
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {(product.images && product.images.length > 0) ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex items-center justify-center h-full fallback-icon ${(product.images && product.images.length > 0) ? 'hidden' : ''}`}>
            <ImageIcon className="h-16 w-16 text-gray-300" />
          </div>

          {/* Категория */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={`${category.color} backdrop-blur-sm bg-white/90`}>
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Badge>
          </div>

          {/* Наличие товара */}
          {product.inStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-green-50/90 text-green-700 border-green-200 backdrop-blur-sm">
                В наличии
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            {/* Заголовок */}
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
              {product.name}
            </h3>

            {/* Поставщик */}
            {product.supplier_name && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span className="line-clamp-1">{product.supplier_name}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
          {/* Цена и MOQ */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Цена</span>
              <div className="font-bold text-2xl text-purple-600">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">MOQ</span>
              <span className="text-gray-700 font-medium">
                {product.minOrder} шт
              </span>
            </div>
          </div>

          {/* Описание */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Действия */}
          <div className="space-y-2 pt-2 mt-auto">
            {/* Главная кнопка */}
            <Button
              size="lg"
              onClick={() => onAddToCart?.(product)}
              className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm hover:shadow-md transition-all"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              В корзину
            </Button>

            {/* Вторичные кнопки */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(product)}
                className="h-9 text-xs hover:bg-purple-50 hover:border-purple-300"
              >
                <Eye className="h-3 w-3 mr-1" />
                Подробнее
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContactSupplier?.(product.id)}
                className="h-9 text-xs hover:bg-purple-50 hover:border-purple-300"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Связаться
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
