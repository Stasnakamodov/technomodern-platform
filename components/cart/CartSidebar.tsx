'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingCart, Package, Trash2, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from '@/hooks/useCart'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    changeQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md max-md:max-w-full bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 max-md:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <h2 className="text-2xl max-md:text-xl font-bold text-gray-900">Корзина</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{totalItems} товаров</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 max-md:p-4 space-y-4 max-md:space-y-3">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Корзина пуста</p>
              <p className="text-sm mt-2">Добавьте товары из каталога</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onClose}
              >
                Перейти в каталог
              </Button>
            </div>
          ) : (
            items.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-3">
                  {item.image_url && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    {item.supplier_name && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.supplier_name}
                      </p>
                    )}

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeQuantity(item.id, -1)}
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeQuantity(item.id, 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Total for item */}
                    <div className="mt-2 text-right">
                      <span className="font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({item.price.toLocaleString('ru-RU')} × {item.quantity})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="p-6 max-md:p-4 border-t border-gray-200 space-y-4">
            {/* Clear cart button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить корзину
              </Button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Итого:</span>
              <span className="text-2xl text-gray-900">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Checkout buttons */}
            <div className="space-y-2">
              <Link href="/cart" onClick={onClose}>
                <Button className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800 text-white">
                  <Package className="h-5 w-5 mr-2" />
                  Оформить заказ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
              >
                Продолжить покупки
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
