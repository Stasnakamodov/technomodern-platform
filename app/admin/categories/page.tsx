import { createClient } from '@supabase/supabase-js'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CategoriesTree } from '@/components/admin/CategoriesTree'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id, level, product_count, icon, display_order')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

async function getSuppliers() {
  // Получаем поставщиков с количеством товаров
  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select('id, name, country, verified, rating')
    .order('name')

  if (error) {
    console.error('Error fetching suppliers:', error)
    return []
  }

  // Для каждого поставщика получаем количество товаров
  const suppliersWithCount = await Promise.all(
    (suppliers || []).map(async (supplier) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('supplier_id', supplier.id)

      return {
        ...supplier,
        product_count: count || 0
      }
    })
  )

  return suppliersWithCount
}

export default async function CategoriesPage() {
  const [categories, suppliers] = await Promise.all([
    getCategories(),
    getSuppliers()
  ])

  // Build tree structure
  const rootCategories = categories.filter(c => !c.parent_id)
  const childCategories = categories.filter(c => c.parent_id)

  return (
    <AdminLayout
      title="Категории и поставщики"
      description={`${categories.length} категорий, ${suppliers.length} поставщиков`}
    >
      <CategoriesTree
        rootCategories={rootCategories}
        childCategories={childCategories}
        suppliers={suppliers}
      />
    </AdminLayout>
  )
}
