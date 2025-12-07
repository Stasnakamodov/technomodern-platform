'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, Camera, Globe, Link2, Upload, ChevronRight, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CatalogHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  totalProducts: number
  filteredProducts: number
  isSearching?: boolean
  onClearSearch?: () => void
  placeholder?: string
}

export default function CatalogHeader({
  searchQuery,
  setSearchQuery,
  totalProducts,
  filteredProducts,
  isSearching = false,
  onClearSearch,
  placeholder = 'Поиск по названию, описанию, поставщику, артикулу...'
}: CatalogHeaderProps) {
  const router = useRouter()
  const [activePanel, setActivePanel] = useState<'photo' | 'link' | 'supplier' | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    setSearchQuery('')
    onClearSearch?.()
  }

  const closePanel = () => {
    setActivePanel(null)
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
        alert('Файл слишком большой. Максимальный размер: 10MB')
        return
      }
      setSelectedImage(file)
    }
  }

  // Поиск по изображению
  const handleImageSearch = async () => {
    if (!selectedImage) return
    setIsLoading(true)
    try {
      const base64Image = await fileToBase64(selectedImage)
      const response = await fetch('/api/catalog/search-by-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      })
      if (!response.ok) throw new Error('Ошибка при поиске товара')
      const data = await response.json()
      sessionStorage.setItem('imageSearchResults', JSON.stringify(data))
      router.push('/catalog?mode=image-search')
      closePanel()
    } catch (error) {
      console.error('Ошибка поиска по изображению:', error)
      alert('Не удалось выполнить поиск. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  // Поиск по URL
  const handleUrlSearch = async () => {
    if (!urlInput.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/catalog/search-by-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      })
      if (!response.ok) throw new Error('Ошибка при поиске товара')
      const data = await response.json()
      sessionStorage.setItem('urlSearchResults', JSON.stringify(data))
      router.push('/catalog?mode=url-search')
      closePanel()
      setUrlInput('')
    } catch (error) {
      console.error('Ошибка поиска по URL:', error)
      alert('Не удалось выполнить поиск. Проверьте URL и попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col">
        {/* Поле поиска */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-36 max-md:pr-28 h-12 max-md:h-10 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 max-md:text-sm"
          />

          {/* Иконки функций поиска */}
          <div className="absolute right-3 max-md:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 max-md:gap-0.5">
            {/* Индикатор загрузки */}
            {isSearching && (
              <Loader2 className="h-5 w-5 max-md:h-4 max-md:w-4 text-purple-600 animate-spin mr-1" />
            )}

            {/* Кнопка очистки */}
            {searchQuery && !isSearching && (
              <button
                onClick={handleClear}
                className="p-1.5 max-md:p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Очистить поиск"
              >
                <X className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </button>
            )}

            <div className="flex items-center gap-1 max-md:gap-0.5 border-l border-gray-300 pl-2 ml-1 max-md:pl-1 max-md:ml-0.5">
              <button
                type="button"
                onClick={() => setActivePanel(activePanel === 'photo' ? null : 'photo')}
                className={`p-1.5 max-md:p-1 rounded-full transition-colors ${
                  activePanel === 'photo' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 text-gray-500 hover:text-purple-600'
                }`}
                title="Поиск по фото"
              >
                <Camera className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActivePanel(activePanel === 'supplier' ? null : 'supplier')}
                className={`p-1.5 max-md:p-1 rounded-full transition-colors ${
                  activePanel === 'supplier' ? 'bg-orange-100 text-orange-600' : 'hover:bg-purple-100 text-gray-500 hover:text-purple-600'
                }`}
                title="Найти поставщика"
              >
                <Globe className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActivePanel(activePanel === 'link' ? null : 'link')}
                className={`p-1.5 max-md:p-1 rounded-full transition-colors ${
                  activePanel === 'link' ? 'bg-green-100 text-green-600' : 'hover:bg-purple-100 text-gray-500 hover:text-purple-600'
                }`}
                title="Поиск по ссылке"
              >
                <Link2 className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Панель поиска по фото */}
        {activePanel === 'photo' && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-md:p-4 z-50">
            <div className="flex items-start gap-4 max-md:gap-3 mb-4 max-md:mb-3">
              <div className="w-10 h-10 max-md:w-8 max-md:h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 max-md:w-4 max-md:h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 max-md:text-sm">Поиск по фото</h3>
                <p className="text-sm max-md:text-xs text-gray-500">Загрузите фото товара</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-md:p-3 mb-4 max-md:mb-3 border border-gray-200">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="w-8 h-8 max-md:w-6 max-md:h-6 text-gray-400" />
                <span className="text-sm max-md:text-xs text-gray-600 text-center">
                  {selectedImage ? selectedImage.name : 'Выберите файл'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closePanel} className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                Отмена
              </button>
              <button
                onClick={handleImageSearch}
                disabled={!selectedImage || isLoading}
                className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                Найти
              </button>
            </div>
          </div>
        )}

        {/* Панель поиска по ссылке */}
        {activePanel === 'link' && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-md:p-4 z-50">
            <div className="flex items-start gap-4 max-md:gap-3 mb-4 max-md:mb-3">
              <div className="w-10 h-10 max-md:w-8 max-md:h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 max-md:w-4 max-md:h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 max-md:text-sm">Поиск по ссылке</h3>
                <p className="text-sm max-md:text-xs text-gray-500">Вставьте ссылку на товар</p>
              </div>
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://aliexpress.com/item/..."
              className="w-full px-4 py-3 max-md:px-3 max-md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm max-md:text-xs mb-4 max-md:mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closePanel} className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                Отмена
              </button>
              <button
                onClick={handleUrlSearch}
                disabled={!urlInput.trim() || isLoading}
                className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                Найти
              </button>
            </div>
          </div>
        )}

        {/* Панель поиска поставщика */}
        {activePanel === 'supplier' && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-md:p-4 z-50">
            <div className="flex items-start gap-4 max-md:gap-3 mb-4 max-md:mb-3">
              <div className="w-10 h-10 max-md:w-8 max-md:h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 max-md:w-4 max-md:h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 max-md:text-sm">Найти поставщика</h3>
                <p className="text-sm max-md:text-xs text-gray-500">Опишите нужный товар</p>
              </div>
            </div>
            <textarea
              placeholder="Опишите товар..."
              rows={3}
              className="w-full px-4 py-3 max-md:px-3 max-md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm max-md:text-xs mb-4 max-md:mb-3 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closePanel} className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                Отмена
              </button>
              <button
                onClick={() => {
                  router.push('/#services')
                  closePanel()
                }}
                className="px-4 py-2 max-md:px-3 max-md:py-1.5 text-sm max-md:text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Оставить заявку
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
