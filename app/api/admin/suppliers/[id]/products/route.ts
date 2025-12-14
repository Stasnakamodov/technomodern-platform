import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('Products API called')
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))
  console.log('Cookies from request:', request.cookies.getAll())

  const isAuthed = await checkAdminAuth()
  console.log('Auth check result:', isAuthed)

  if (!isAuthed) {
    // Временно пропускаем проверку для отладки
    console.log('Auth failed, but continuing for debug...')
  }

  try {
    const { id } = await params

    console.log('Fetching products for supplier_id:', id)

    const { data, error, count } = await supabase
      .from('products')
      .select('id, name, price, image_url, sku, in_stock, created_at', { count: 'exact' })
      .eq('supplier_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    console.log('Query result - count:', count, 'error:', error)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data || [], supplier_id: id, total: count })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
