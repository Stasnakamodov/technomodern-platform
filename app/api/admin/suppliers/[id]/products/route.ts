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
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const { data, error, count } = await supabase
      .from('products')
      .select('id, name, price, images, sku, in_stock, created_at', { count: 'exact' })
      .eq('supplier_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data || [], supplier_id: id, total: count })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
