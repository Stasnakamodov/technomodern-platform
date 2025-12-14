import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Типы
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  supplier_name?: string
  sku?: string
}

interface TelegramUser {
  id: number
  firstName?: string
  lastName?: string
  username?: string
}

interface CartState {
  items: CartItem[]
  telegramUser: TelegramUser | null
  isHydrated: boolean
  isSyncing: boolean
  lastSyncedAt: number | null
}

interface CartActions {
  // Базовые операции
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void

  // Telegram
  setTelegramUser: (user: TelegramUser) => void

  // Синхронизация
  setItems: (items: CartItem[]) => void
  setSyncing: (syncing: boolean) => void
  setLastSyncedAt: (timestamp: number) => void

  // Hydration
  setHydrated: () => void

  // Computed (реализованы как функции)
  getTotalItems: () => number
  getTotalPrice: () => number
}

type CartStore = CartState & CartActions

const STORAGE_KEY = 'technomodern-cart'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      telegramUser: null,
      isHydrated: false,
      isSyncing: false,
      lastSyncedAt: null,

      // Базовые операции
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(i => i.id === item.id)

          if (existingIndex !== -1) {
            // Увеличиваем количество существующего товара
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + 1
            }
            return { items: newItems }
          }

          // Добавляем новый товар
          return {
            items: [...state.items, { ...item, quantity: 1 }]
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      // Telegram
      setTelegramUser: (user) => {
        set({ telegramUser: user })
      },

      // Синхронизация
      setItems: (items) => {
        set({ items })
      },

      setSyncing: (syncing) => {
        set({ isSyncing: syncing })
      },

      setLastSyncedAt: (timestamp) => {
        set({ lastSyncedAt: timestamp })
      },

      // Hydration
      setHydrated: () => {
        set({ isHydrated: true })
      },

      // Computed
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только сериализуемые данные
      partialize: (state) => ({
        items: state.items,
        telegramUser: state.telegramUser,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // После rehydration
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)

// Селекторы для оптимизации ререндеров
export const selectCartItems = (state: CartStore) => state.items
export const selectTelegramUser = (state: CartStore) => state.telegramUser
export const selectIsHydrated = (state: CartStore) => state.isHydrated
export const selectIsSyncing = (state: CartStore) => state.isSyncing
