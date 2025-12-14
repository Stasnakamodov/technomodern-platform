'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Package,
  Folder,
  FolderOpen,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Truck,
  Star,
  CheckCircle,
  Globe
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string | null
  level?: number
  product_count?: number
  icon?: string
  display_order?: number
}

interface Supplier {
  id: string
  name: string
  country?: string
  verified?: boolean
  rating?: number
  product_count: number
}

interface CategoriesTreeProps {
  rootCategories: Category[]
  childCategories: Category[]
  suppliers?: Supplier[]
}

type ChildrenMap = Record<string, Category[]>

// Компонент формы редактирования
function CategoryForm({
  category,
  allCategories,
  onSave,
  onCancel,
  isLoading
}: {
  category: Category | null
  allCategories: Category[]
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [icon, setIcon] = useState(category?.icon || '')
  const [parentId, setParentId] = useState<string>(category?.parent_id || 'none')
  const [displayOrder, setDisplayOrder] = useState(category?.display_order?.toString() || '0')

  const rootCategories = allCategories.filter(c => !c.parent_id && c.id !== category?.id)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!category) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: category?.id,
      name,
      slug,
      icon: icon || undefined,
      parent_id: parentId === 'none' ? null : parentId,
      display_order: parseInt(displayOrder) || 0
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Название *</label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Введите название категории"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug (URL)</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="category-slug"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Иконка (эмодзи)</label>
        <Input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="🛒"
          maxLength={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Родительская категория</label>
        <Select value={parentId} onValueChange={setParentId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите родительскую категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">— Корневая категория —</SelectItem>
            {rootCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Порядок отображения</label>
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          placeholder="0"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="w-4 h-4 mr-2" />
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading || !name}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Компонент элемента категории
function CategoryItem({
  category,
  childrenMap,
  allCategories,
  level = 0,
  onEdit,
  onDelete
}: {
  category: Category
  childrenMap: ChildrenMap
  allCategories: Category[]
  level?: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}) {
  const [isOpen, setIsOpen] = useState(level === 0)

  const children = childrenMap[category.id] || []
  const hasChildren = children.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer group',
          level > 0 && 'bg-gray-50/50'
        )}
        style={{ paddingLeft: `${16 + level * 24}px` }}
        onClick={handleToggle}
      >
        {/* Стрелка раскрытия */}
        <button
          className={cn(
            "p-0.5 rounded transition-colors",
            hasChildren ? "hover:bg-gray-200" : "opacity-30 cursor-default"
          )}
          onClick={handleToggle}
          disabled={!hasChildren}
        >
          {isOpen && hasChildren ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Иконка папки */}
        {hasChildren ? (
          isOpen ? (
            <FolderOpen className="w-5 h-5 text-yellow-500" />
          ) : (
            <Folder className="w-5 h-5 text-yellow-500" />
          )
        ) : (
          <Folder className="w-5 h-5 text-gray-400" />
        )}

        {/* Название и slug */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{category.name}</span>
            {category.icon && (
              <span className="text-lg">{category.icon}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            /{category.slug}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {(category.product_count ?? 0) > 0 && (
            <Link
              href={`/admin/products?category=${category.id}`}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Просмотреть товары"
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
          <button
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(category)
            }}
            title="Редактировать"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(category)
            }}
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Количество товаров */}
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[60px] justify-end">
          <Package className="w-4 h-4" />
          <span className="font-medium">{category.product_count ?? 0}</span>
        </div>
      </div>

      {/* Дочерние категории */}
      {hasChildren && isOpen && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              childrenMap={childrenMap}
              allCategories={allCategories}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoriesTree({ rootCategories, childCategories, suppliers = [] }: CategoriesTreeProps) {
  const router = useRouter()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allCategories = [...rootCategories, ...childCategories]

  const childrenByParent = childCategories.reduce((acc, cat) => {
    const parentId = cat.parent_id!
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(cat)
    return acc
  }, {} as Record<string, Category[]>)

  const totalProducts = allCategories.reduce(
    (sum, cat) => sum + (cat.product_count || 0),
    0
  )

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsCreating(false)
    setIsDialogOpen(true)
    setError(null)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setIsCreating(true)
    setIsDialogOpen(true)
    setError(null)
  }

  const handleSave = async (data: Partial<Category>) => {
    setIsLoading(true)
    setError(null)

    try {
      const method = isCreating ? 'POST' : 'PUT'
      const response = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка сохранения')
      }

      setIsDialogOpen(false)
      setEditingCategory(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (category: Category) => {
    setDeleteConfirm(category)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/categories?id=${deleteConfirm.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка удаления')
      }

      setDeleteConfirm(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{rootCategories.length}</p>
              <p className="text-sm text-gray-500">Главных категорий</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{childCategories.length}</p>
              <p className="text-sm text-gray-500">Подкатегорий</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              <p className="text-sm text-gray-500">Поставщиков</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-sm text-gray-500">Товаров всего</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-center">
          <Button onClick={handleCreate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Добавить категорию
          </Button>
        </Card>
      </div>

      {/* Tree */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Дерево категорий</h3>
          <p className="text-sm text-gray-500">
            Наведите на категорию для действий
          </p>
        </div>

        {rootCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Категорий не найдено</p>
            <Button onClick={handleCreate} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Создать первую категорию
            </Button>
          </div>
        ) : (
          <div>
            {rootCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                childrenMap={childrenByParent}
                allCategories={allCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Suppliers List */}
      {suppliers.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-500" />
              Поставщики
            </h3>
            <p className="text-sm text-gray-500">
              Нажмите для просмотра товаров
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {suppliers.map((supplier) => (
              <Link
                key={supplier.id}
                href={`/admin/products?supplier=${supplier.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{supplier.name}</span>
                    {supplier.verified && (
                      <span title="Проверенный поставщик">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {supplier.country && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {supplier.country}
                      </span>
                    )}
                    {supplier.rating !== undefined && supplier.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-3 h-3 fill-current" />
                        {supplier.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">{supplier.product_count}</span>
                  <span className="text-gray-400">товаров</span>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Диалог редактирования */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Новая категория' : 'Редактирование категории'}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? 'Заполните данные для создания новой категории'
                : `Редактирование: ${editingCategory?.name}`}
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            category={editingCategory}
            allCategories={allCategories}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить категорию?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить категорию &quot;{deleteConfirm?.name}&quot;?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (deleteConfirm.product_count ?? 0) > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              ⚠️ В этой категории {deleteConfirm.product_count} товаров.
              Сначала переместите их в другую категорию.
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading || (deleteConfirm?.product_count ?? 0) > 0}
            >
              {isLoading ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
