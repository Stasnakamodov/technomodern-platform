'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import ProductCard from './ProductCard'
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
const CARD_HEIGHT = 480 // Высота карточки в пикселях
const GAP = 24 // gap-6 = 24px
const OVERSCAN = 3 // Количество строк для предзагрузки

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
  const [containerHeight, setContainerHeight] = useState(0)
  const [columns, setColumns] = useState(4)

  // Определяем количество колонок на основе ширины
  useEffect(() => {
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

  // Обновление высоты контейнера
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Обработчик скролла
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)

    // Проверяем нужно ли загрузить ещё
    if (onLoadMore && hasMore && !isLoading) {
      const scrolledToBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < CARD_HEIGHT * 2
      if (scrolledToBottom) {
        onLoadMore()
      }
    }
  }, [onLoadMore, hasMore, isLoading])

  // Расчёт виртуализации
  const { visibleProducts, totalHeight, startIndex, offsetY } = useMemo(() => {
    const rowHeight = CARD_HEIGHT + GAP
    const totalRows = Math.ceil(products.length / columns)
    const totalHeight = totalRows * rowHeight

    // Определяем видимый диапазон строк
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
    const visibleRows = Math.ceil(containerHeight / rowHeight) + OVERSCAN * 2
    const endRow = Math.min(totalRows, startRow + visibleRows)

    // Индексы товаров
    const startIndex = startRow * columns
    const endIndex = Math.min(products.length, endRow * columns)

    return {
      visibleProducts: products.slice(startIndex, endIndex),
      totalHeight,
      startIndex,
      offsetY: startRow * rowHeight
    }
  }, [products, columns, scrollTop, containerHeight])

  // Если мало товаров - рендерим обычным способом
  if (products.length <= 20) {
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
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-300px)] overflow-auto"
      style={{ contain: 'strict' }}
    >
      {/* Внутренний контейнер с полной высотой */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Видимые элементы */}
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          <div
            className="grid gap-4 md:gap-6"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {visibleProducts.map((product, index) => (
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

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  )
}
