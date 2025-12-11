'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import ProductCard from './ProductCard'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/catalog.types'

interface VirtualizedProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

// Константы для расчёта размеров
const CARD_HEIGHT = 420 // Уменьшил для более точного расчёта
const GAP = 24 // gap-6 = 24px
const OVERSCAN = 4 // Увеличил предзагрузку для плавности

// Используем useLayoutEffect на клиенте, useEffect на сервере
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function VirtualizedProductGrid({
  products,
  onAddToCart,
  onViewDetails,
  onLoadMore,
  hasMore = false,
  isLoading = false
}: VirtualizedProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(800) // Дефолтная высота вместо 0
  const [columns, setColumns] = useState(4)

  // Ref для отслеживания последнего количества товаров (для стабилизации при загрузке)
  const prevProductsLengthRef = useRef(products.length)

  // Определяем количество колонок на основе ширины
  useIsomorphicLayoutEffect(() => {
    const updateColumns = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth
      if (width < 640) setColumns(1)       // sm
      else if (width < 768) setColumns(1)  // md
      else if (width < 1024) setColumns(2) // lg
      else if (width < 1280) setColumns(3) // xl
      else setColumns(4)                   // 2xl+
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Обновление высоты контейнера с ResizeObserver для точности
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return

    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight
        if (height > 0) {
          setContainerHeight(height)
        }
      }
    }

    // Сразу обновляем
    updateHeight()

    // ResizeObserver для отслеживания изменений
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  // Стабилизация скролла при добавлении товаров
  useEffect(() => {
    if (products.length > prevProductsLengthRef.current) {
      // Товары добавились - не сбрасываем скролл
      prevProductsLengthRef.current = products.length
    } else if (products.length < prevProductsLengthRef.current) {
      // Товары уменьшились (новая категория) - сбрасываем скролл
      setScrollTop(0)
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
      prevProductsLengthRef.current = products.length
    }
  }, [products.length])

  // Обработчик скролла с throttle через requestAnimationFrame
  const scrollRAF = useRef<number | null>(null)
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement

    // Throttle через RAF
    if (scrollRAF.current) return
    scrollRAF.current = requestAnimationFrame(() => {
      setScrollTop(target.scrollTop)
      scrollRAF.current = null
    })

    // Проверяем нужно ли загрузить ещё (без throttle для быстрой реакции)
    if (onLoadMore && hasMore && !isLoading) {
      const scrolledToBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < CARD_HEIGHT * 3
      if (scrolledToBottom) {
        onLoadMore()
      }
    }
  }, [onLoadMore, hasMore, isLoading])

  // Cleanup RAF при размонтировании
  useEffect(() => {
    return () => {
      if (scrollRAF.current) {
        cancelAnimationFrame(scrollRAF.current)
      }
    }
  }, [])

  // Расчёт виртуализации с защитой от деления на 0
  const { visibleProducts, totalHeight, offsetY } = useMemo(() => {
    const rowHeight = CARD_HEIGHT + GAP
    const totalRows = Math.ceil(products.length / columns)
    const totalHeight = totalRows * rowHeight

    // Защита от containerHeight = 0
    const safeContainerHeight = Math.max(containerHeight, 400)

    // Определяем видимый диапазон строк
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
    const visibleRows = Math.ceil(safeContainerHeight / rowHeight) + OVERSCAN * 2
    const endRow = Math.min(totalRows, startRow + visibleRows)

    // Индексы товаров
    const startIndex = startRow * columns
    const endIndex = Math.min(products.length, endRow * columns)

    return {
      visibleProducts: products.slice(startIndex, endIndex),
      totalHeight,
      offsetY: startRow * rowHeight
    }
  }, [products, columns, scrollTop, containerHeight])

  // Если мало товаров - рендерим обычным способом
  if (products.length <= 50) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
            onViewDetails={() => onViewDetails(product)}
          />
        ))}

        {/* Кнопка загрузки для обычного грида */}
        {hasMore && (
          <div className="col-span-full flex justify-center mt-8">
            <Button
              onClick={onLoadMore}
              disabled={isLoading}
              variant="outline"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                'Загрузить ещё'
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto"
      style={{ contain: 'layout style' }}
    >
      {/* Внутренний контейнер с полной высотой */}
      <div style={{ height: totalHeight, position: 'relative', minHeight: '100%' }}>
        {/* Видимые элементы */}
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
            willChange: 'transform'
          }}
        >
          <div
            className="grid gap-4 md:gap-6"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                style={{ height: CARD_HEIGHT }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => onAddToCart(product)}
                  onViewDetails={() => onViewDetails(product)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Индикатор загрузки внизу */}
      {isLoading && (
        <div className="sticky bottom-0 left-0 right-0 flex justify-center py-4 bg-gradient-to-t from-gray-50 to-transparent">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            <span className="text-sm text-gray-600">Загрузка...</span>
          </div>
        </div>
      )}

      {/* Кнопка "Загрузить ещё" если автозагрузка не сработала */}
      {hasMore && !isLoading && (
        <div className="sticky bottom-4 left-0 right-0 flex justify-center">
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            Загрузить ещё
          </Button>
        </div>
      )}
    </div>
  )
}
