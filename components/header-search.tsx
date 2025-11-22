'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronRight, Camera, Globe, Link2, Upload, Send, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

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

interface HeaderSearchProps {
  onExpandChange?: (expanded: boolean) => void
  isSticky?: boolean
}

export default function HeaderSearch({ onExpandChange, isSticky = false }: HeaderSearchProps) {
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

  // Функция закрытия меню
  const closeMenu = () => {
    setActiveTool(null)
    setIsExpanded(false)
    setIsModalOpen(false)
  }

  // Открытие модального окна поиска
  const openSearchModal = () => {
    setIsModalOpen(true)
    setActiveTool('search')
    setIsExpanded(true)
    // Фокус на input после анимации
    setTimeout(() => {
      modalInputRef.current?.focus()
    }, 100)
  }

  // Массив анимированных placeholder текстов
  const placeholders = [
    'Поиск товаров, поставщиков, артикулов...',
    'Загрузите фото — найдем товар на китайских площадках...',
    'Вставьте ссылку — найдем аналоги дешевле...',
    'Нет нужного товара? Мы найдем поставщика для вас...',
    'Ищите по фото, ссылке или названию...',
  ]

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target)
      // Если модалка открыта, проверяем клик вне неё; если закрыта - считаем что "вне"
      const isOutsideModal = !modalContentRef.current || !modalContentRef.current.contains(target)

      // Закрываем только если клик вне обоих элементов
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

  // Скролл остается доступным когда модалка открыта
  // (убрали блокировку чтобы лендинг под модалкой был доступен)

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
    }, 3000) // Меняем каждые 3 секунды

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
        // Удаляем префикс "data:image/...;base64,"
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
      // Проверка размера (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 10MB')
        return
      }
      setSelectedImage(file)
    }
  }

  // Поиск по изображению
  const handleImageSearch = async () => {
    if (!selectedImage) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    setIsLoading(true)
    try {
      // Конвертируем изображение в base64
      const base64Image = await fileToBase64(selectedImage)

      // Отправляем на API
      const response = await fetch('/api/catalog/search-by-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при поиске товара')
      }

      const data = await response.json()

      // Сохраняем результаты в sessionStorage для передачи на страницу каталога
      sessionStorage.setItem('imageSearchResults', JSON.stringify(data))

      // Переходим на страницу каталога с параметром image-search
      router.push('/catalog?mode=image-search')
      closeMenu()
    } catch (error) {
      console.error('Ошибка поиска по изображению:', error)
      alert('Не удалось выполнить поиск. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  // Поиск по URL
  const handleUrlSearch = async () => {
    if (!urlInput.trim()) {
      alert('Пожалуйста, введите URL товара')
      return
    }

    setIsLoading(true)
    try {
      // Отправляем на API
      const response = await fetch('/api/catalog/search-by-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при поиске товара')
      }

      const data = await response.json()

      // Сохраняем результаты в sessionStorage
      sessionStorage.setItem('urlSearchResults', JSON.stringify(data))

      // Переходим на страницу каталога с параметром url-search
      router.push('/catalog?mode=url-search')
      closeMenu()
      setUrlInput('')
    } catch (error) {
      console.error('Ошибка поиска по URL:', error)
      alert('Не удалось выполнить поиск. Проверьте URL и попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 max-md:px-4 max-md:py-2 shadow-sm hover:shadow-md transition-shadow w-full"
      >
        <Search className="h-5 w-5 max-md:h-4 max-md:w-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={handleInputClick}
          placeholder={placeholders[placeholderIndex]}
          className="flex-1 bg-transparent border-none outline-none text-base max-md:text-sm text-foreground placeholder:text-muted-foreground min-w-0 transition-all duration-300"
        />

        {/* Иконки поиска справа */}
        <div className="flex items-center gap-1 max-md:gap-0.5 border-l border-gray-300 pl-3 ml-2 max-md:pl-2 max-md:ml-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveTool(activeTool === 'photo' ? null : 'photo')
            }}
            className={`p-2 max-md:p-1.5 rounded-full transition-colors group ${
              activeTool === 'photo' ? 'bg-blue-100' : 'hover:bg-purple-100'
            }`}
            title="Поиск по фото"
          >
            <Camera className={`h-5 w-5 max-md:h-4 max-md:w-4 transition-colors ${
              activeTool === 'photo' ? 'text-blue-600' : 'text-gray-500 group-hover:text-purple-600'
            }`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveTool(activeTool === 'supplier' ? null : 'supplier')
            }}
            className={`p-2 max-md:p-1.5 rounded-full transition-colors group ${
              activeTool === 'supplier' ? 'bg-orange-100' : 'hover:bg-purple-100'
            }`}
            title="Найти поставщика"
          >
            <Globe className={`h-5 w-5 max-md:h-4 max-md:w-4 transition-colors ${
              activeTool === 'supplier' ? 'text-orange-600' : 'text-gray-500 group-hover:text-purple-600'
            }`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveTool(activeTool === 'link' ? null : 'link')
            }}
            className={`p-2 max-md:p-1.5 rounded-full transition-colors group ${
              activeTool === 'link' ? 'bg-green-100' : 'hover:bg-purple-100'
            }`}
            title="Поиск по ссылке"
          >
            <Link2 className={`h-5 w-5 max-md:h-4 max-md:w-4 transition-colors ${
              activeTool === 'link' ? 'text-green-600' : 'text-gray-500 group-hover:text-purple-600'
            }`} />
          </button>
          {/* Крестик закрытия - показывается когда модалка открыта */}
          {isModalOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeMenu()
              }}
              className="p-2 max-md:p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ml-1"
              title="Закрыть"
            >
              <X className="h-5 w-5 max-md:h-4 max-md:w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Модальное окно поиска */}
      {mounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] animate-in fade-in duration-200"
        >
          {/* Затемненный фон - закрывает модалку при клике */}
          <div className="absolute inset-0 bg-black/30 z-0" onClick={closeMenu} />

          {/* Контент модального окна */}
          <div
            ref={modalContentRef}
            className="relative bg-white shadow-2xl animate-in slide-in-from-top duration-300 z-10"
          >
            {/* Верхняя панель с поиском */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={modalInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholders[placeholderIndex]}
                    className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTool(activeTool === 'photo' ? 'search' : 'photo')
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        activeTool === 'photo' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                      title="Поиск по фото"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTool(activeTool === 'supplier' ? 'search' : 'supplier')
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        activeTool === 'supplier' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                      title="Найти поставщика"
                    >
                      <Globe className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTool(activeTool === 'link' ? 'search' : 'link')
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        activeTool === 'link' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                      title="Поиск по ссылке"
                    >
                      <Link2 className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Контент под поиском */}
            {activeTool === 'search' && (
              <div className="max-h-[85vh] overflow-y-auto">
                {/* Промо-блок */}
                <div className="bg-gray-50 border-b border-gray-200 p-5">
                  <div className="max-w-5xl mx-auto flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-base mb-1">
                        Не можете найти товар?
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Мы найдем поставщиков этого товара и сделаем вашу работу с ними безопасной
                      </p>
                      <button
                        onClick={() => {
                          router.push('/#services')
                          closeMenu()
                        }}
                        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                      >
                        Оставить заявку
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Категории товаров */}
                <div className="p-4">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Категории товаров
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((category, index) => (
                        <button
                          key={category.name}
                          onClick={() => handleCategoryClick(category.name)}
                          className="relative flex items-center justify-between px-6 py-8 rounded-xl overflow-hidden transition-all group hover:shadow-lg animate-in slide-in-from-top duration-300"
                          style={{
                            backgroundImage: `url(${category.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: 'backwards',
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
                          <div className="relative flex items-center gap-4 z-10">
                            <span className="text-3xl drop-shadow-lg">{category.icon}</span>
                            <span className="font-semibold text-lg text-white drop-shadow-lg">{category.name}</span>
                          </div>
                          <ChevronRight className="relative h-5 w-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all z-10" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleViewAll}
                      className="w-full mt-4 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Показать все товары
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Панель поиска по фото */}
            {activeTool === 'photo' && (
              <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg mb-1">
                      Поиск товара по фотографии
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Загрузите фото товара, и мы найдем его на китайских площадках
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <label className="flex flex-col items-center gap-3 cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                      <Upload className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <span className="text-gray-900 text-sm font-medium block mb-0.5">
                        {selectedImage ? selectedImage.name : 'Загрузить фотографию'}
                      </span>
                      <span className="text-gray-400 text-xs">JPG, PNG или WEBP до 10MB</span>
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

                <div className="flex justify-end">
                  <button
                    onClick={handleImageSearch}
                    disabled={!selectedImage || isLoading}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            )}

            {/* Панель поиска по ссылке */}
            {activeTool === 'link' && (
              <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg mb-1">
                      Поиск товара по ссылке
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Вставьте ссылку на товар с любой площадки, и мы найдем его аналоги дешевле
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://aliexpress.com/item/..."
                    className="w-full bg-transparent border-none outline-none text-gray-900 text-sm placeholder:text-gray-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUrlSearch}
                    disabled={!urlInput.trim() || isLoading}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            )}

            {/* Панель поиска поставщика */}
            {activeTool === 'supplier' && (
              <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg mb-1">
                      Найти поставщика
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Опишите нужный товар, мы найдем надежного поставщика
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                  <textarea
                    placeholder="Опишите товар, который вам нужен..."
                    rows={3}
                    className="w-full bg-transparent border-none outline-none text-gray-900 text-sm placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      router.push('/#services')
                      closeMenu()
                    }}
                    className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                  >
                    Оставить заявку
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
