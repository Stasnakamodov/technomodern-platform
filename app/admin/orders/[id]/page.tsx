import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrderDetail } from '@/components/admin/OrderDetail'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return (
    <AdminLayout
      title={`Заказ #${order.id.slice(0, 8)}`}
      description={`от ${new Date(order.created_at).toLocaleDateString('ru-RU')}`}
      actions={
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к заказам
          </Button>
        </Link>
      }
    >
      <OrderDetail order={order} />
    </AdminLayout>
  )
}
