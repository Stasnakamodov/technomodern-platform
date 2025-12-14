'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Star,
  Globe,
  Package,
  Box,
  ShoppingCart,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Supplier {
  id: string
  name: string
  description: string | null
  country: string | null
  logo_url: string | null
  verified: boolean
  rating: number | null
  total_orders: number
  product_count: number
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  sku: string | null
  in_stock: boolean
  created_at: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Модальное окно редактирования
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [saving, setSaving] = useState(false)

  // Модальное окно просмотра с товарами
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null)
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Форма
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    verified: false,
    rating: ''
  })

  // Удаление
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Загрузка поставщиков
  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/admin/suppliers')
      if (!res.ok) throw new Error('Ошибка загрузки')
      const data = await res.json()
      setSuppliers(data.suppliers || [])
    } catch (error) {
      toast.error('Не удалось загрузить поставщиков')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Фильтрация
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.country?.toLowerCase().includes(search.toLowerCase())
  )

  // Открыть модалку просмотра с товарами
  const openViewModal = async (supplier: Supplier) => {
    setViewingSupplier(supplier)
    setViewModalOpen(true)
    setLoadingProducts(true)
    setSupplierProducts([])

    try {
      const res = await fetch(`/api/admin/suppliers/${supplier.id}/products`)
      if (res.ok) {
        const data = await res.json()
        setSupplierProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  // Открыть модалку для создания
  const openCreateModal = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      description: '',
      country: 'Китай',
      verified: false,
      rating: ''
    })
    setModalOpen(true)
  }

  // Открыть модалку для редактирования
  const openEditModal = (supplier: Supplier, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      description: supplier.description || '',
      country: supplier.country || '',
      verified: supplier.verified,
      rating: supplier.rating?.toString() || ''
    })
    setModalOpen(true)
  }

  // Сохранить
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Введите название поставщика')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...(editingSupplier ? { id: editingSupplier.id } : {}),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        country: formData.country.trim() || null,
        verified: formData.verified,
        rating: formData.rating ? parseFloat(formData.rating) : null
      }

      const res = await fetch('/api/admin/suppliers', {
        method: editingSupplier ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка сохранения')
      }

      toast.success(editingSupplier ? 'Поставщик обновлён' : 'Поставщик создан')
      setModalOpen(false)
      fetchSuppliers()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  // Удалить
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/suppliers?id=${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка удаления')
      }

      toast.success('Поставщик удалён')
      setDeleteConfirm(null)
      fetchSuppliers()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <AdminLayout
      title="Поставщики"
      description="Управление поставщиками товаров"
      actions={
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить поставщика
        </Button>
      }
    >
      {/* Поиск */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по названию или стране..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Список */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <Card className="p-12 text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {search ? 'Поставщики не найдены' : 'Нет поставщиков'}
          </p>
          {!search && (
            <Button onClick={openCreateModal} className="mt-4">
              Добавить первого поставщика
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <Card
              key={supplier.id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openViewModal(supplier)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      {supplier.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    {supplier.country && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <Globe className="w-3 h-3" />
                        {supplier.country}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {supplier.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {supplier.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                {supplier.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{supplier.rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Box className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-600">{supplier.product_count || 0} товаров</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{supplier.total_orders || 0} заказов</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => openEditModal(supplier, e)}
                  className="flex-1 gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Изменить
                </Button>
                {deleteConfirm === supplier.id ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(supplier.id, e)
                      }}
                      disabled={deleting}
                    >
                      {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Да'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(null)
                      }}
                    >
                      Нет
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm(supplier.id)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Модальное окно просмотра с товарами */}
      {viewModalOpen && viewingSupplier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{viewingSupplier.name}</h2>
                      {viewingSupplier.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {viewingSupplier.country && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {viewingSupplier.country}
                        </div>
                      )}
                      {viewingSupplier.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {viewingSupplier.rating.toFixed(1)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        С {formatDate(viewingSupplier.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {viewingSupplier.description && (
                <p className="text-gray-600 mt-4">{viewingSupplier.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Box className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{viewingSupplier.product_count || 0}</div>
                    <div className="text-xs text-gray-500">Товаров</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{viewingSupplier.total_orders || 0}</div>
                    <div className="text-xs text-gray-500">Заказов</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewModalOpen(false)
                      openEditModal(viewingSupplier)
                    }}
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </Button>
                </div>
              </div>
            </div>

            {/* Products list */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Товары поставщика
              </h3>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : supplierProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">У этого поставщика пока нет товаров</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {supplierProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          {product.sku && <span className="font-mono">SKU: {product.sku}</span>}
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs",
                            product.in_stock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-gray-900">{formatPrice(product.price)}</div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 justify-end mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Открыть <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingSupplier ? 'Редактировать поставщика' : 'Новый поставщик'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Shenzhen Electronics"
                />
              </div>

              <div>
                <Label htmlFor="country">Страна</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Например: Китай"
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Краткое описание поставщика..."
                  className="w-full px-3 py-2 border rounded-md text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="rating">Рейтинг (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="4.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="verified" className="cursor-pointer">
                  Верифицированный поставщик
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingSupplier ? (
                  'Сохранить'
                ) : (
                  'Создать'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
