'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Phone,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

interface OrdersTableProps {
  orders: Order[]
  currentPage: number
  totalPages: number
  currentStatus: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  new: { label: 'Новый', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
  processing: { label: 'В работе', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Truck },
  completed: { label: 'Выполнен', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Отменён', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
}

const statusFilters = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'processing', label: 'В работе' },
  { value: 'completed', label: 'Выполненные' },
  { value: 'cancelled', label: 'Отменённые' },
]

export function OrdersTable({ orders, currentPage, totalPages, currentStatus }: OrdersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    params.set('page', '1')
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/orders?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={currentStatus === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(filter.value)}
              className={cn(
                currentStatus === filter.value && 'bg-gray-900 text-white'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Orders List */}
      <Card className="overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Заказов не найдено
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.new
              const StatusIcon = status.icon

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', status.bgColor)}>
                      <StatusIcon className={cn('w-5 h-5', status.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {order.customer_name || 'Без имени'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customer_phone || '—'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      status.bgColor,
                      status.color
                    )}>
                      {status.label}
                    </span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 px-4">
            Страница {currentPage} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
