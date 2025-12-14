// Типы для Telegram WebApp
interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface WebAppInitData {
  query_id?: string
  user?: TelegramUser
  auth_date: number
  hash: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: WebAppInitData
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean

  // Методы
  ready: () => void
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text?: string
    }>
  }, callback?: (buttonId: string) => void) => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

/**
 * Получить объект Telegram WebApp
 * @returns TelegramWebApp или null если не в Telegram
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp || null
}

/**
 * Проверить, запущено ли приложение в Telegram Mini App
 */
export function isTelegramMiniApp(): boolean {
  const tg = getTelegramWebApp()
  return Boolean(tg && tg.initData && tg.initData.length > 0)
}

/**
 * Получить данные пользователя Telegram
 * @returns Объект с данными пользователя или null
 */
export function getTelegramUser(): {
  id: number
  firstName?: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
} | null {
  const tg = getTelegramWebApp()
  if (!tg || !tg.initDataUnsafe?.user) return null

  const user = tg.initDataUnsafe.user
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    languageCode: user.language_code,
    isPremium: user.is_premium,
  }
}

/**
 * Получить сырые initData для валидации на сервере
 */
export function getTelegramInitData(): string | null {
  const tg = getTelegramWebApp()
  return tg?.initData || null
}

/**
 * Инициализировать Telegram WebApp
 * Вызывать при монтировании приложения
 */
export function initTelegramWebApp() {
  const tg = getTelegramWebApp()
  if (!tg) return

  // Сообщаем Telegram что приложение готово
  tg.ready()

  // Разворачиваем на весь экран
  tg.expand()

  // Включаем подтверждение закрытия если есть товары в корзине
  // (это можно включить/выключить динамически)
}

/**
 * Показать нативный alert Telegram
 */
export function showTelegramAlert(message: string, callback?: () => void) {
  const tg = getTelegramWebApp()
  if (tg) {
    tg.showAlert(message, callback)
  } else {
    alert(message)
    callback?.()
  }
}

/**
 * Показать нативный confirm Telegram
 */
export function showTelegramConfirm(
  message: string,
  callback: (confirmed: boolean) => void
) {
  const tg = getTelegramWebApp()
  if (tg) {
    tg.showConfirm(message, callback)
  } else {
    const result = confirm(message)
    callback(result)
  }
}

/**
 * Тактильная обратная связь
 */
export function hapticFeedback(
  type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy'
) {
  const tg = getTelegramWebApp()
  if (!tg?.HapticFeedback) return

  switch (type) {
    case 'success':
    case 'error':
    case 'warning':
      tg.HapticFeedback.notificationOccurred(type)
      break
    case 'light':
    case 'medium':
    case 'heavy':
      tg.HapticFeedback.impactOccurred(type)
      break
  }
}

/**
 * Настроить MainButton (большая кнопка внизу)
 */
export function setupMainButton(options: {
  text: string
  onClick: () => void
  color?: string
  textColor?: string
}) {
  const tg = getTelegramWebApp()
  if (!tg) return null

  const { MainButton } = tg

  MainButton.setText(options.text)
  if (options.color) MainButton.color = options.color
  if (options.textColor) MainButton.textColor = options.textColor

  MainButton.onClick(options.onClick)
  MainButton.show()

  // Возвращаем функцию для очистки
  return () => {
    MainButton.offClick(options.onClick)
    MainButton.hide()
  }
}

/**
 * Настроить BackButton (кнопка назад)
 */
export function setupBackButton(onClick: () => void) {
  const tg = getTelegramWebApp()
  if (!tg) return null

  const { BackButton } = tg

  BackButton.onClick(onClick)
  BackButton.show()

  return () => {
    BackButton.offClick(onClick)
    BackButton.hide()
  }
}
