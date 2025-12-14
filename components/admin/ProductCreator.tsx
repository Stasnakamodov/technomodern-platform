'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  ImageIcon,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string
  level?: number
}

interface Supplier {
  id: string
  name: string
}

interface ProductCreatorProps {
  categories: Category[]
  suppliers: Supplier[]
  onClose?: () => void
}

interface FormData {
  name: string
  description: string
  price: number
  sku: string
  in_stock: boolean
  min_order: number
  category_id: string
  supplier_id: string
  images: string[]
  specifications: Record<string, string>
  tags: string[]
}

export function ProductCreator({ categories, suppliers, onClose }: ProductCreatorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    in_stock: true,
    min_order: 1,
    category_id: '',
    supplier_id: '',
    images: [],
    specifications: {},
    tags: [],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleToggleStock = () => {
    setFormData(prev => ({ ...prev, in_stock: !prev.in_stock }))
  }

  // Изображения
  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Характеристики
  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  // Теги
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Введите название товара')
      return
    }
    if (formData.price <= 0) {
      toast.error('Цена должна быть больше 0')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product')
      }

      toast.success('Товар создан')

      // Перенаправляем на страницу редактирования или закрываем форму
      if (onClose) {
        onClose()
        router.refresh()
      } else {
        router.push(`/admin/products/${data.product.id}`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Ошибка создания товара')
    } finally {
      setIsLoading(false)
    }
  }

  // Сгруппированные категории для отображения с отступами
  const sortedCategories = [...categories].sort((a, b) => {
    const levelA = a.level || 0
    const levelB = b.level || 0
    if (levelA !== levelB) return levelA - levelB
    return a.name.localeCompare(b.name)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-xl font-semibold">Новый товар</h2>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gray-900 hover:bg-gray-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Создать товар
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Основная информация</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название товара *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Например: Смартфон Samsung Galaxy S24"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Подробное описание товара..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (RUB) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">Артикул (SKU)</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="ABC-12345"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">Категория</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">Без категории</option>
                    {sortedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {'—'.repeat(cat.level ? cat.level - 1 : 0)} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="supplier_id">Поставщик</Label>
                  <select
                    id="supplier_id"
                    name="supplier_id"
                    value={formData.supplier_id}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">Без поставщика</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="min_order">Минимальный заказ (шт)</Label>
                <Input
                  id="min_order"
                  name="min_order"
                  type="number"
                  value={formData.min_order}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 w-32"
                />
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Изображения</h3>

            <div className="flex gap-2 mb-4">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL изображения"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Добавьте URL изображений</p>
                </div>
              </div>
            )}
          </Card>

          {/* Specifications */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Характеристики</h3>

            <div className="flex gap-2 mb-4">
              <Input
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Название (напр. Цвет)"
                className="flex-1"
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Значение (напр. Чёрный)"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
              />
              <Button type="button" onClick={addSpecification} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {Object.keys(formData.specifications).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="ml-2 text-gray-600">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Характеристики не добавлены</p>
            )}
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Теги</h3>

            <div className="flex gap-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Добавить тег"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Теги не добавлены</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Статус</h3>
            <button
              type="button"
              onClick={handleToggleStock}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors',
                formData.in_stock
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              )}
            >
              <div className="flex items-center gap-3">
                {formData.in_stock ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={cn(
                  'font-medium',
                  formData.in_stock ? 'text-green-700' : 'text-red-700'
                )}>
                  {formData.in_stock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
            </button>
          </Card>

          {/* Quick Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Подсказки</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>* Обязательные поля: название и цена</p>
              <p>SKU должен быть уникальным</p>
              <p>Изображения добавляются по URL</p>
              <p>Характеристики будут отображаться на карточке товара</p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
