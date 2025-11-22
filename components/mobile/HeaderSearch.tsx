'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Search, ChevronRight, Camera, Globe, Link2, Upload, Send, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

// Мемоизируем статические данные
const categories = [
  {
    name: 'Электроника',
    icon: '📱',
    count: 45,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bf1f8985-d5ec-498d-b3a3-92cf2664e47f-J5QzF7yzEr8rHengA3WsxPCUd3w44e.png'
  },
  {
    name: 'Мебель',
    icon: '🪑',
    count: 32,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K6xBoMEnG3LiOudSyAXgEhpXepelZb.png'
  },
  {
    name: 'Красота и здоровье',
    icon: '💄',
    count: 28,
    image: '/images/beauty.jpg'
  },
  {
    name: 'Спорт и отдых',
    icon: '⚽',
    count: 38,
    image: '/images/sports.jpg'
  },
  {
    name: 'Дом и сад',
    icon: '🏡',
    count: 42,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KBszHhTKI6EVsEIy6RGpZcjWsHoFsC.png'
  },
  {
    name: 'Одежда',
    icon: '👔',
    count: 56,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L1C9EvLDqT7Ls41tq5CasY0a5XrH6k.png'
  },
]

type ActiveTool = 'search' | 'photo' | 'link' | 'supplier' | null

interface MobileHeaderSearchProps {
  onExpandChange?: (expanded: boolean) => void
  isSticky?: boolean
}

export default function MobileHeaderSearch({ onExpandChange, isSticky = false }: MobileHeaderSearchProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  const [query, setQuery] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalInputRef = useRef<HTMLInputElement>(null)

  // Для createPortal нужно дождаться монтирования
  useEffect(() => {
    setMounted(true)
  }, [])

  // Уведомляем родителя об изменении состояния expanded
  useEffect(() => {
    onExpandChange?.(isExpanded)
  }, [isExpanded, onExpandChange])

  // Функция закрытия меню (мемоизирована)
  const closeMenu = useCallback(() => {
    setActiveTool(null)
    setIsExpanded(false)
    setIsModalOpen(false)
  }, [])

  // Открытие модального окна поиска (мемоизирована)
  // НЕ фокусируем input автоматически - клавиатура появится только по второму тапу
  const openSearchModal = useCallback(() => {
    setIsModalOpen(true)
    setActiveTool('search')
    setIsExpanded(true)
  }, [])

  // Массив анимированных placeholder текстов (короче для мобильных)
  const placeholders = [
    'Поиск товаров...',
    'Поиск по фото...',
    'Поиск по ссылке...',
    'Найти поставщика...',
    'Товары, артикулы...',
  ]

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target)
      const isOutsideModal = !modalContentRef.current || !modalContentRef.current.contains(target)

      if (isOutsideContainer && isOutsideModal) {
        closeMenu()
      }
    }

    if (activeTool) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeTool])

  // Блокировка скролла body когда модалка открыта (важно для мобильных)
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isModalOpen])

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isModalOpen])

  // Анимация смены placeholder текстов
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [placeholders.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query.trim())}`)
      closeMenu()
    }
  }

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openSearchModal()
  }

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/catalog?category=${encodeURIComponent(categoryName)}`)
    closeMenu()
  }

  const handleViewAll = () => {
    router.push('/catalog')
    closeMenu()
  }

  // Конвертация файла в base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  // Обработчик выбора изображения
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Файл слишком большой. Максимум: 10MB')
        return
      }
      setSelectedImage(file)
    }
  }

  // Поиск по изображению
  const handleImageSearch = async () => {
    if (!selectedImage) {
      alert('Выберите изображение')
      return
    }

    setIsLoading(true)
    try {
      const base64Image = await fileToBase64(selectedImage)

      const response = await fetch('/api/catalog/search-by-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при поиске')
      }

      const data = await response.json()
      sessionStorage.setItem('imageSearchResults', JSON.stringify(data))
      router.push('/catalog?mode=image-search')
      closeMenu()
    } catch (error) {
      console.error('Ошибка поиска по изображению:', error)
      alert('Не удалось выполнить поиск')
    } finally {
      setIsLoading(false)
    }
  }

  // Поиск по URL
  const handleUrlSearch = async () => {
    if (!urlInput.trim()) {
      alert('Введите URL товара')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/catalog/search-by-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при поиске')
      }

      const data = await response.json()
      sessionStorage.setItem('urlSearchResults', JSON.stringify(data))
      router.push('/catalog?mode=url-search')
      closeMenu()
      setUrlInput('')
    } catch (error) {
      console.error('Ошибка поиска по URL:', error)
      alert('Не удалось выполнить поиск')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* iOS Safari style для sticky, обычный стиль для hero */}
      {isSticky ? (
        /* iOS Safari style - полупрозрачная пилюля */
        <div
          onClick={handleInputClick}
          className="flex items-center gap-2.5 bg-black/[0.06] rounded-[10px] px-3 py-2 w-full active:bg-black/[0.12] transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="flex-1 text-[15px] text-gray-500 truncate">
            {query || 'Поиск'}
          </span>
        </div>
      ) : (
        /* Обычная форма для hero section */
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-4 py-2.5 shadow-sm active:shadow-md transition-shadow w-full"
          style={{
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={handleInputClick}
            placeholder={placeholders[placeholderIndex]}
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
          />

          {/* Иконки справа - увеличенные touch targets */}
          <div className="flex items-center gap-0.5 border-l border-gray-300 pl-2 ml-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
                setActiveTool('photo')
                setIsExpanded(true)
              }}
              className={`p-2.5 rounded-full transition-colors ${
                activeTool === 'photo' ? 'bg-purple-100' : 'active:bg-purple-100'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Camera className={`h-4 w-4 ${
                activeTool === 'photo' ? 'text-purple-600' : 'text-gray-500'
              }`} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
                setActiveTool('link')
                setIsExpanded(true)
              }}
              className={`p-2.5 rounded-full transition-colors ${
                activeTool === 'link' ? 'bg-green-100' : 'active:bg-green-100'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Link2 className={`h-4 w-4 ${
                activeTool === 'link' ? 'text-green-600' : 'text-gray-500'
              }`} />
            </button>
          </div>
        </form>
      )}

      {/* Fullscreen модальное окно для мобильных */}
      {mounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[100]"
          style={{
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* Затемненный фон */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-200"
            onClick={closeMenu}
            style={{
              WebkitBackdropFilter: 'blur(4px)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Контент модального окна - slide from bottom */}
          <div
            ref={modalContentRef}
            className="absolute inset-0 bg-white flex flex-col"
            style={{
              transform: 'translate3d(0, 0, 0)',
              animation: 'slideInFromBottom 0.3s ease-out',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* Верхняя панель с поиском - компактная версия */}
            <div
              className="flex-shrink-0 px-3 py-2 border-b border-gray-100 bg-white"
              style={{
                paddingTop: 'max(8px, env(safe-area-inset-top))',
                willChange: 'transform',
              }}
            >
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 -ml-1 rounded-full active:bg-gray-100"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    ref={modalInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </form>

              {/* Табы инструментов - компактные */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setActiveTool('search')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeTool === 'search'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  }`}
                  style={{ willChange: 'background-color' }}
                >
                  Каталог
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('photo')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeTool === 'photo'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-purple-100'
                  }`}
                  style={{ willChange: 'background-color' }}
                >
                  Фото
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('link')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeTool === 'link'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-green-100'
                  }`}
                  style={{ willChange: 'background-color' }}
                >
                  Ссылка
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('supplier')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeTool === 'supplier'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-orange-100'
                  }`}
                  style={{ willChange: 'background-color' }}
                >
                  Поставщик
                </button>
              </div>
            </div>

            {/* Контент - scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Режим каталога */}
              {activeTool === 'search' && (
                <div className="pb-6">
                  {/* Промо-блок */}
                  <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold text-sm mb-1">
                          Не можете найти?
                        </h3>
                        <p className="text-gray-600 text-xs mb-2">
                          Мы найдем поставщиков и сделаем работу безопасной
                        </p>
                        <button
                          onClick={() => {
                            router.push('/#services')
                            closeMenu()
                          }}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium active:bg-gray-800"
                        >
                          Оставить заявку
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Категории - одна колонка */}
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Категории
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <button
                          key={category.name}
                          onClick={() => handleCategoryClick(category.name)}
                          className="relative flex items-center justify-between w-full px-4 py-4 rounded-xl overflow-hidden active:scale-[0.98] transition-transform"
                          style={{
                            backgroundImage: `url(${category.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            animation: `fadeInUp 0.3s ease-out ${index * 50}ms backwards`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="relative flex items-center gap-3 z-10">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="font-semibold text-base text-white">{category.name}</span>
                          </div>
                          <ChevronRight className="relative h-5 w-5 text-white/80 z-10" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleViewAll}
                      className="w-full mt-4 px-4 py-3.5 bg-gray-900 text-white rounded-xl active:bg-gray-800 font-medium text-sm"
                    >
                      Все товары
                    </button>
                  </div>
                </div>
              )}

              {/* Режим фото */}
              {activeTool === 'photo' && (
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-base mb-1">
                        Поиск по фото
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Загрузите фото, найдем на китайских площадках
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200">
                    <label className="flex flex-col items-center gap-3 cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <span className="text-gray-900 text-sm font-medium block mb-0.5">
                          {selectedImage ? selectedImage.name : 'Загрузить фото'}
                        </span>
                        <span className="text-gray-400 text-xs">до 10MB</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleImageSearch}
                    disabled={!selectedImage || isLoading}
                    className="w-full bg-purple-600 text-white px-6 py-3.5 rounded-xl font-medium text-sm active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ищем...
                      </>
                    ) : (
                      <>
                        Найти товар
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Режим ссылки */}
              {activeTool === 'link' && (
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-base mb-1">
                        Поиск по ссылке
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Вставьте ссылку, найдем аналоги дешевле
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://aliexpress.com/..."
                      className="w-full bg-transparent border-none outline-none text-gray-900 text-sm placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleUrlSearch}
                    disabled={!urlInput.trim() || isLoading}
                    className="w-full bg-green-600 text-white px-6 py-3.5 rounded-xl font-medium text-sm active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ищем...
                      </>
                    ) : (
                      <>
                        Найти аналоги
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Режим поставщика */}
              {activeTool === 'supplier' && (
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-base mb-1">
                        Найти поставщика
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Опишите товар, найдем надежного поставщика
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                    <textarea
                      placeholder="Опишите нужный товар..."
                      rows={4}
                      className="w-full bg-transparent border-none outline-none text-gray-900 text-sm placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      router.push('/#services')
                      closeMenu()
                    }}
                    className="w-full bg-orange-600 text-white px-6 py-3.5 rounded-xl font-medium text-sm active:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    Оставить заявку
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes slideInFromBottom {
          from {
            transform: translate3d(0, 100%, 0);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Скрываем скроллбар для табов */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
