'use client'

import { useState, useRef, useCallback } from 'react'
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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Безопасность: проверка данных товара
  if (!product || !product.id || !product.name) {
    console.error('ProductCard: Некорректные данные товара', product)
    return null
  }

  // Фильтруем валидные изображения
  const validImages = product.images?.filter((_, index) => !imageErrors.has(index)) || []
  const hasValidImages = validImages.length > 0
  const hasMultipleImages = validImages.length > 1

  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }, [])

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }, [])

  // Обработчик скролла для обновления индикатора
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const itemWidth = container.clientWidth
      const newIndex = Math.round(scrollLeft / itemWidth)
      setCurrentImageIndex(newIndex)
    }
  }, [])

  // Определяем домен для внешних изображений
  const isExternalImage = (url: string): boolean => {
    return Boolean(url && (url.startsWith('http://') || url.startsWith('https://')))
  }

  return (
    <div
      className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer h-full"
      onClick={() => onViewDetails?.(product)}
    >
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-gray-200 hover:border-gray-300 bg-white overflow-hidden flex flex-col h-full min-h-[360px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px]">
        {/* Изображение товара */}
        <div className="relative w-full h-52 sm:h-52 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {hasValidImages ? (
            <>
              {/* Мобильная версия со свайпом (только если есть несколько валидных изображений) */}
              {hasMultipleImages && (
                <div className="md:hidden absolute inset-0">
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {validImages.map((imageUrl, idx) => {
                      // Находим оригинальный индекс для отслеживания загрузки
                      const originalIndex = product.images?.indexOf(imageUrl) ?? idx
                      return (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-full h-full snap-center relative"
                        >
                          <Image
                            src={imageUrl}
                            alt={`${product.name} - фото ${idx + 1}`}
                            fill
                            sizes="100vw"
                            className={`object-cover transition-all duration-300 ${
                              loadedImages.has(originalIndex) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            }`}
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            onLoad={() => handleImageLoad(originalIndex)}
                            onError={() => handleImageError(originalIndex)}
                            loading={idx === 0 ? "eager" : "lazy"}
                            unoptimized={isExternalImage(imageUrl)}
                          />
                          {!loadedImages.has(originalIndex) && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Индикаторы-точки */}
                  {validImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {validImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                            idx === currentImageIndex
                              ? 'bg-white w-3 shadow-md'
                              : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Десктоп версия или мобильная с одним изображением - показываем первую картинку */}
              <div className={hasMultipleImages ? 'hidden md:block h-full' : 'h-full'}>
                <Image
                  src={validImages[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className={`object-cover transition-all duration-300 ${
                    loadedImages.has(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  onLoad={() => handleImageLoad(0)}
                  onError={() => handleImageError(0)}
                  loading="lazy"
                  unoptimized={isExternalImage(validImages[0])}
                />
                {!loadedImages.has(0) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>

        <CardHeader className="pb-1 sm:pb-3">
          <div className="space-y-1 sm:space-y-2">
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

        <CardContent className="pt-0 space-y-2 sm:space-y-4 flex-1 flex flex-col">
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
