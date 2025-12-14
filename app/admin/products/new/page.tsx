import { createClient } from '@supabase/supabase-js'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductCreator } from '@/components/admin/ProductCreator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id, level')
    .order('level, name')

  return data || []
}

async function getSuppliers() {
  const { data } = await supabase
    .from('suppliers')
    .select('id, name')
    .order('name')

  return data || []
}

export default async function NewProductPage() {
  const [categories, suppliers] = await Promise.all([
    getCategories(),
    getSuppliers()
  ])

  return (
    <AdminLayout
      title="Новый товар"
      description="Создание нового товара"
    >
      <ProductCreator
        categories={categories}
        suppliers={suppliers}
      />
    </AdminLayout>
  )
}
