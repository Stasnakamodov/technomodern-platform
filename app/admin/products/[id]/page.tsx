import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductEditor } from '@/components/admin/ProductEditor'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name')

  return data || []
}

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories()
  ])

  if (!product) {
    notFound()
  }

  return (
    <AdminLayout
      title="Редактирование товара"
      description={product.name}
      actions={
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к товарам
          </Button>
        </Link>
      }
    >
      <ProductEditor product={product} categories={categories} />
    </AdminLayout>
  )
}
