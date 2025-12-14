'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCartStore, selectIsHydrated, selectTelegramUser } from '@/stores/cart-store'
import { getTelegramWebApp, getTelegramUser } from '@/lib/telegram'

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const isHydrated = useCartStore(selectIsHydrated)
  const telegramUser = useCartStore(selectTelegramUser)
  const setTelegramUser = useCartStore((state) => state.setTelegramUser)
  const setItems = useCartStore((state) => state.setItems)
  const items = useCartStore((state) => state.items)
  const setSyncing = useCartStore((state) => state.setSyncing)
  const setLastSyncedAt = useCartStore((state) => state.setLastSyncedAt)

  const [isInitialized, setIsInitialized] = useState(false)

  // Инициализация Telegram пользователя
  useEffect(() => {
    if (!isHydrated || isInitialized) return

    const tgUser = getTelegramUser()
    if (tgUser) {
      setTelegramUser(tgUser)
    }
    setIsInitialized(true)
  }, [isHydrated, isInitialized, setTelegramUser])

  // Загрузка корзины с сервера при наличии Telegram пользователя
  useEffect(() => {
    if (!isInitialized || !telegramUser?.id) return

    const loadServerCart = async () => {
      try {
        setSyncing(true)
        const response = await fetch(`/api/cart?telegram_user_id=${telegramUser.id}`)

        if (!response.ok) {
          console.error('Failed to load cart from server')
          return
        }

        const serverCart = await response.json()

        if (serverCart.items && serverCart.items.length > 0) {
          // Мержим локальную и серверную корзины
          const merged = mergeCartItems(items, serverCart.items)
          setItems(merged)
        }

        setLastSyncedAt(Date.now())
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setSyncing(false)
      }
    }

    loadServerCart()
  }, [isInitialized, telegramUser?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Синхронизация корзины с сервером при изменениях
  const syncToServer = useCallback(async () => {
    if (!telegramUser?.id || !isInitialized) return

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_user_id: telegramUser.id,
          items,
        }),
      })
      setLastSyncedAt(Date.now())
    } catch (error) {
      console.error('Error syncing cart:', error)
    }
  }, [telegramUser?.id, items, isInitialized, setLastSyncedAt])

  // Debounced sync при изменении корзины
  useEffect(() => {
    if (!isInitialized || !telegramUser?.id) return

    const timeoutId = setTimeout(() => {
      syncToServer()
    }, 1000) // Debounce 1 секунда

    return () => clearTimeout(timeoutId)
  }, [items, syncToServer, isInitialized, telegramUser?.id])

  // Показываем скелетон пока не произошла hydration
  if (!isHydrated) {
    return <CartSkeleton>{children}</CartSkeleton>
  }

  return <>{children}</>
}

// Скелетон для начальной загрузки
function CartSkeleton({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Функция мержа корзин (серверная приоритетнее)
function mergeCartItems(
  localItems: { id: string; quantity: number }[],
  serverItems: { id: string; quantity: number }[]
) {
  const merged = new Map()

  // Сначала серверные (они более актуальные)
  serverItems.forEach(item => {
    merged.set(item.id, item)
  })

  // Добавляем локальные, которых нет на сервере
  localItems.forEach(item => {
    if (!merged.has(item.id)) {
      merged.set(item.id, item)
    }
  })

  return Array.from(merged.values())
}
