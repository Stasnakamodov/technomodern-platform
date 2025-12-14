import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Plus, Upload } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SearchParams {
  search?: string
  category?: string
  supplier?: string
  page?: string
  stock?: string
}

async function getProducts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      sku,
      in_stock,
      images,
      category_id,
      supplier_id,
      categories (
        id,
        name
      ),
      suppliers (
        id,
        name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }

  if (searchParams.supplier) {
    query = query.eq('supplier_id', searchParams.supplier)
  }

  if (searchParams.stock === 'in_stock') {
    query = query.eq('in_stock', true)
  } else if (searchParams.stock === 'out_of_stock') {
    query = query.eq('in_stock', false)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }

  return { products: data || [], total: count || 0 }
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return data || []
}

async function getSuppliers() {
  const { data } = await supabase
    .from('suppliers')
    .select('id, name')
    .order('name')

  return data || []
}

// Клиентский компонент для кнопок действий
function ProductActions() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/admin/products/import">
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Загрузить из файла
        </Button>
      </Link>
      <Link href="/admin/products/new">
        <Button className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Добавить товар
        </Button>
      </Link>
    </div>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [{ products, total }, categories, suppliers] = await Promise.all([
    getProducts(params),
    getCategories(),
    getSuppliers()
  ])

  const currentPage = parseInt(params.page || '1')
  const totalPages = Math.ceil(total / 20)

  return (
    <AdminLayout
      title="Товары"
      description={`Всего ${total} товаров`}
      actions={<ProductActions />}
    >
      <ProductsTable
        products={products}
        categories={categories}
        suppliers={suppliers}
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={params}
      />
    </AdminLayout>
  )
}
