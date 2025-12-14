import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - получить список поставщиков
export async function GET(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase
      .from('suppliers')
      .select('*')
      .order('name')

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ suppliers: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - создать нового поставщика
export async function POST(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Название поставщика обязательно' },
        { status: 400 }
      )
    }

    // Проверка дубликата
    const { data: existing } = await supabase
      .from('suppliers')
      .select('id')
      .ilike('name', body.name.trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Поставщик с таким именем уже существует', supplier: existing },
        { status: 400 }
      )
    }

    const supplierData = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      country: body.country?.trim() || null,
      logo_url: body.logo_url?.trim() || null,
      verified: body.verified ?? false,
      rating: body.rating || null,
    }

    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Ошибка создания поставщика: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, supplier: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - обновить поставщика
export async function PUT(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}

    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.description !== undefined) updateData.description = body.description?.trim() || null
    if (body.country !== undefined) updateData.country = body.country?.trim() || null
    if (body.logo_url !== undefined) updateData.logo_url = body.logo_url?.trim() || null
    if (body.verified !== undefined) updateData.verified = body.verified
    if (body.rating !== undefined) updateData.rating = body.rating

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('suppliers')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Ошибка обновления: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, supplier: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить поставщика
export async function DELETE(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })
    }

    // Проверяем, есть ли товары у этого поставщика
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('supplier_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Невозможно удалить: у поставщика ${count} товаров` },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Ошибка удаления: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
