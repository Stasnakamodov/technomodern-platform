'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Loader2,
  AlertTriangle
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
  created_at: string
  updated_at: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Модальное окно
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [saving, setSaving] = useState(false)

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
  const openEditModal = (supplier: Supplier) => {
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
  const handleDelete = async (id: string) => {
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
            <Card key={supplier.id} className="p-5 hover:shadow-md transition-shadow">
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
                  <Package className="w-4 h-4" />
                  <span>{supplier.total_orders} заказов</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(supplier)}
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
                      onClick={() => handleDelete(supplier.id)}
                      disabled={deleting}
                    >
                      {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Да'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Нет
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(supplier.id)}
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

      {/* Модальное окно */}
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
