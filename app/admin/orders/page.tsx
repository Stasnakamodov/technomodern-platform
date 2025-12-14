import { createClient } from '@supabase/supabase-js'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrdersTable } from '@/components/admin/OrdersTable'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SearchParams {
  status?: string
  page?: string
}

async function getOrders(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0 }
  }

  return { orders: data || [], total: count || 0 }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { orders, total } = await getOrders(params)
  const currentPage = parseInt(params.page || '1')
  const totalPages = Math.ceil(total / 20)

  return (
    <AdminLayout
      title="Заказы"
      description={`Всего ${total} заказов`}
    >
      <OrdersTable
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        currentStatus={params.status || 'all'}
      />
    </AdminLayout>
  )
}
