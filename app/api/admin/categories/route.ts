import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - получить все категории
export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - создать новую категорию
export async function POST(request: NextRequest) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: body.name,
      slug: body.slug,
      parent_id: body.parent_id || null,
      level: body.parent_id ? 2 : 1,
      icon: body.icon || null,
      display_order: body.display_order || 0,
      product_count: 0
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PUT - обновить категорию
export async function PUT(request: NextRequest) {
  const body = await request.json()

  if (!body.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {}

  if (body.name !== undefined) updateData.name = body.name
  if (body.slug !== undefined) updateData.slug = body.slug
  if (body.parent_id !== undefined) {
    updateData.parent_id = body.parent_id || null
    updateData.level = body.parent_id ? 2 : 1
  }
  if (body.icon !== undefined) updateData.icon = body.icon
  if (body.display_order !== undefined) updateData.display_order = body.display_order

  const { data, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE - удалить категорию
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  // Проверяем, есть ли дочерние категории
  const { data: children } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', id)

  if (children && children.length > 0) {
    return NextResponse.json(
      { error: 'Нельзя удалить категорию с подкатегориями' },
      { status: 400 }
    )
  }

  // Проверяем, есть ли товары в категории
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1)

  if (products && products.length > 0) {
    return NextResponse.json(
      { error: 'Нельзя удалить категорию с товарами. Сначала переместите товары.' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
