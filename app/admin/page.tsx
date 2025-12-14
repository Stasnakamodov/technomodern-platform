import { createClient } from '@supabase/supabase-js'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import {
  ShoppingCart,
  Package,
  FolderTree,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getStats() {
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalCategories },
    { count: totalOrders },
    { count: newOrders },
    { count: processingOrders },
    { count: completedOrders },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    totalCategories: totalCategories || 0,
    totalOrders: totalOrders || 0,
    newOrders: newOrders || 0,
    processingOrders: processingOrders || 0,
    completedOrders: completedOrders || 0,
    recentOrders: recentOrders || []
  }
}

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'Новый', color: 'bg-blue-100 text-blue-800', icon: Clock },
  processing: { label: 'В работе', color: 'bg-yellow-100 text-yellow-800', icon: Truck },
  completed: { label: 'Выполнен', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <AdminLayout
      title="Дашборд"
      description="Обзор магазина TechnoModern"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Новых заказов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Товаров</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              <p className="text-xs text-gray-400">из {stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Категорий</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Новые</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">В обработке</p>
              <p className="text-3xl font-bold text-gray-900">{stats.processingOrders}</p>
            </div>
            <Truck className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Выполнено</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Последние заказы</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Все заказы →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Заказов пока нет</p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => {
              const status = statusLabels[order.status] || statusLabels.new
              const StatusIcon = status.icon

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <StatusIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customer_name || 'Без имени'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer_phone || 'Без телефона'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}
