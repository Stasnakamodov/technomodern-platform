'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  MessageCircle,
  ShoppingCart,
  Building2,
  ImageIcon
} from "lucide-react"
import type { Product } from '@/types/catalog.types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  onContactSupplier?: (productId: string) => void
}

// Placeholder для изображений (1x1 серый пиксель в base64)
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEEBEAAB+AQAB//9k='

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onContactSupplier
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Безопасность: проверка данных товара
  if (!product || !product.id || !product.name) {
    console.error('ProductCard: Некорректные данные товара', product)
    return null
  }

  const hasValidImage = product.images && product.images.length > 0 && !imageError
  const imageUrl = hasValidImage ? product.images[0] : null

  // Определяем домен для внешних изображений
  const isExternalImage = imageUrl && (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  )

  return (
    <div
      className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer h-full"
      onClick={() => onViewDetails?.(product)}
    >
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-gray-200 hover:border-gray-300 bg-white overflow-hidden flex flex-col h-full min-h-[360px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px]">
        {/* Изображение товара */}
        <div className="relative w-full h-44 sm:h-52 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {imageUrl ? (
            <>
              {/* Next.js Image с оптимизацией */}
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-cover transition-all duration-300 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
                unoptimized={isExternalImage ? true : false}
              />
              {/* Скелетон пока изображение загружается */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            {/* Заголовок */}
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
              {product.name}
            </h3>

            {/* Поставщик */}
            {product.supplier_name && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4 flex-shrink-0" />
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
              <div className="font-bold text-xl sm:text-2xl text-gray-900">
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
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart?.(product)
              }}
              className="w-full h-10 sm:h-11 md:h-12 text-xs sm:text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              В корзину
            </Button>

            {/* Вторичные кнопки */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails?.(product)
                }}
                className="h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-gray-100"
              >
                <Eye className="h-3 w-3 mr-1" />
                Подробнее
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onContactSupplier?.(product.id)
                }}
                className="h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-gray-100"
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
