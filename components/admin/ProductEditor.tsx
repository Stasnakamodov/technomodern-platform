'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Save,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  ImageIcon,
  ExternalLink
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  sku?: string
  in_stock: boolean
  images?: string[]
  category_id?: string
  categories?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  parent_id?: string
}

interface ProductEditorProps {
  product: Product
  categories: Category[]
}

export function ProductEditor({ product, categories }: ProductEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    sku: product.sku || '',
    in_stock: product.in_stock ?? true,
    category_id: product.category_id || '',
    images: product.images || [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to update product')
      }

      toast.success('Товар сохранён')
      router.refresh()
    } catch (error) {
      toast.error('Ошибка сохранения')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Основная информация</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название товара</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
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
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sku">Артикул (SKU)</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category_id">Категория</Label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Без категории</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent_id ? '— ' : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Изображения</h3>
          {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Нет изображений</p>
              </div>
            </div>
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

        {/* Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Действия</h3>
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>

            <a
              href={`/catalog?product=${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Открыть на сайте
            </a>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Информация</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">ID</span>
              <span className="font-mono text-gray-900">{product.id.slice(0, 8)}</span>
            </div>
            {product.categories && (
              <div className="flex justify-between">
                <span className="text-gray-500">Категория</span>
                <span className="text-gray-900">{product.categories.name}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </form>
  )
}
