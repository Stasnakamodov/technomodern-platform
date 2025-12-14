'use client'

import { useCallback, useEffect } from 'react'
import { useCartStore, CartItem } from '@/stores/cart-store'
import { getTelegramUser } from '@/lib/telegram'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

interface ProductToAdd {
  id: string
  name: string
  price: number
  image_url?: string
  supplier_name?: string
  sku?: string
}

export function useCart() {
  const items = useCartStore((state) => state.items)
  const telegramUser = useCartStore((state) => state.telegramUser)
  const isHydrated = useCartStore((state) => state.isHydrated)
  const isSyncing = useCartStore((state) => state.isSyncing)

  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const setTelegramUser = useCartStore((state) => state.setTelegramUser)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  // Инициализация Telegram пользователя
  useEffect(() => {
    if (!isHydrated) return

    const tgUser = getTelegramUser()
    if (tgUser && !telegramUser) {
      setTelegramUser(tgUser)
    }
  }, [isHydrated, telegramUser, setTelegramUser])

  // Добавить товар с toast уведомлением
  const addToCart = useCallback((product: ProductToAdd) => {
    const existingItem = items.find(item => item.id === product.id)
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      supplier_name: product.supplier_name,
      sku: product.sku,
    })

    // Toast уведомление
    toast.success(
      <div className="flex items-center gap-3">
        <Check className="h-4 w-4 text-green-600" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <p className="text-xs text-gray-500">
            {existingItem ? `Количество: ${newQuantity}` : 'Добавлено в корзину'}
          </p>
        </div>
      </div>,
      {
        duration: 2000,
      }
    )
  }, [items, addItem])

  // Изменить количество
  const changeQuantity = useCallback((productId: string, delta: number) => {
    const item = items.find(i => i.id === productId)
    if (!item) return

    const newQuantity = item.quantity + delta
    if (newQuantity <= 0) {
      removeItem(productId)
      toast.info('Товар удалён из корзины')
    } else {
      updateQuantity(productId, newQuantity)
    }
  }, [items, removeItem, updateQuantity])

  // Удалить товар
  const removeFromCart = useCallback((productId: string) => {
    removeItem(productId)
    toast.info('Товар удалён из корзины')
  }, [removeItem])

  // Очистить корзину
  const clearAllItems = useCallback(() => {
    clearCart()
    toast.info('Корзина очищена')
  }, [clearCart])

  return {
    // State
    items,
    telegramUser,
    isHydrated,
    isSyncing,

    // Computed
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    isEmpty: items.length === 0,

    // Actions
    addToCart,
    changeQuantity,
    removeFromCart,
    clearCart: clearAllItems,
    updateQuantity,
  }
}
