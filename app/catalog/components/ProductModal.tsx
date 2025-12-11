'use client'

import React, { useState, useEffect } from 'react'
import { X, ShoppingCart, Building2, Package, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from '@/types/catalog.types'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Сброс индекса при смене товара
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [product?.id])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const images = product.images || []
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    onAddToCart(product)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - центрированный с max-width */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 lg:p-6">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - абсолютно позиционированный */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Content - двухколоночный на десктопе */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Image Gallery */}
              <div className="relative bg-gray-50">
                {/* Main Image */}
                <div className="relative aspect-square">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-20 w-20 text-gray-300" />
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {hasMultipleImages && (
                  <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-gray-900 shadow-md'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="p-6 lg:p-10 flex flex-col">
                {/* Category & Stock */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs font-normal">
                    {product.category}
                  </Badge>
                  {product.inStock && (
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      В наличии
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h2>

                {/* Price Block */}
                <div className="bg-gray-50 rounded-xl p-5 mb-5">
                  <p className="text-sm text-gray-500 mb-1">Цена</p>
                  <p className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {product.price.toLocaleString('ru-RU')} <span className="text-2xl">₽</span>
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Мин. заказ: <strong>{product.minOrder} шт</strong></span>
                  </div>
                </div>

                {/* Supplier */}
                {product.supplier_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>Поставщик:</span>
                    <span className="font-medium text-gray-900">{product.supplier_name}</span>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="flex-1 mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Описание</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <p className="text-xs text-gray-400 mb-4">
                    Артикул: {product.sku}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-12"
                  >
                    Закрыть
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
