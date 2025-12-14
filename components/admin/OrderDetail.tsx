'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Send,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_telegram?: string
  message?: string
  status: string
  source?: string
  created_at: string
  updated_at: string
}

interface OrderDetailProps {
  order: Order
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  new: { label: 'Новый', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
  processing: { label: 'В работе', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Truck },
  completed: { label: 'Выполнен', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Отменён', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
}

const statusActions = [
  { status: 'new', label: 'Новый', color: 'bg-blue-600 hover:bg-blue-700' },
  { status: 'processing', label: 'В работе', color: 'bg-yellow-600 hover:bg-yellow-700' },
  { status: 'completed', label: 'Выполнен', color: 'bg-green-600 hover:bg-green-700' },
  { status: 'cancelled', label: 'Отменён', color: 'bg-red-600 hover:bg-red-700' },
]

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const status = statusConfig[currentStatus] || statusConfig.new
  const StatusIcon = status.icon

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      setCurrentStatus(newStatus)
      toast.success('Статус обновлён')
      router.refresh()
    } catch (error) {
      toast.error('Ошибка обновления статуса')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Status Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', status.bgColor)}>
                <StatusIcon className={cn('w-6 h-6', status.color)} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Статус заказа</h3>
                <p className={cn('text-sm font-medium', status.color)}>{status.label}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusActions.map((action) => (
              <Button
                key={action.status}
                variant={currentStatus === action.status ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(action.status)}
                disabled={isUpdating}
                className={cn(
                  currentStatus === action.status && action.color
                )}
              >
                {isUpdating && currentStatus !== action.status ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {action.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Order Message */}
        {order.message && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Содержание заказа
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700">
              {order.message}
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            История
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-500">Создан:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.created_at).toLocaleString('ru-RU')}
              </span>
            </div>
            {order.updated_at !== order.created_at && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-500">Обновлён:</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.updated_at).toLocaleString('ru-RU')}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Sidebar - Customer Info */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Клиент</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Имя</p>
                <p className="font-medium text-gray-900">{order.customer_name || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <a
                  href={`tel:${order.customer_phone}`}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {order.customer_phone || '—'}
                </a>
              </div>
            </div>

            {order.customer_email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    {order.customer_email}
                  </a>
                </div>
              </div>
            )}

            {order.customer_telegram && (
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telegram ID</p>
                  <p className="font-medium text-gray-900">{order.customer_telegram}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Source */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Источник</h3>
          <p className="text-sm text-gray-600">
            {order.source === 'telegram_miniapp' ? 'Telegram Mini App' :
              order.source === 'website' ? 'Веб-сайт' :
              order.source || 'Не указан'}
          </p>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="space-y-2">
            {order.customer_phone && (
              <a
                href={`tel:${order.customer_phone}`}
                className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
            )}
            {order.customer_telegram && (
              <a
                href={`https://t.me/${order.customer_telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Написать в Telegram
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
