import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST - создание нового товара
export async function POST(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Валидация обязательных полей
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Название товара обязательно' },
        { status: 400 }
      )
    }

    if (body.price === undefined || body.price === null || body.price < 0) {
      return NextResponse.json(
        { error: 'Цена должна быть указана и >= 0' },
        { status: 400 }
      )
    }

    // Проверка дубликата SKU
    if (body.sku) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('sku', body.sku)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: `Товар с артикулом ${body.sku} уже существует` },
          { status: 400 }
        )
      }
    }

    // Подготовка данных для вставки
    const productData: Record<string, any> = {
      name: body.name.trim(),
      price: parseFloat(body.price),
      description: body.description?.trim() || null,
      sku: body.sku?.trim() || null,
      in_stock: body.in_stock ?? true,
      min_order: body.min_order || 1,
      category_id: body.category_id || null,
      supplier_id: body.supplier_id || null,
      images: body.images || [],
      specifications: body.specifications || {},
      tags: body.tags || [],
      currency: body.currency || 'RUB',
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Ошибка создания товара: ' + error.message },
        { status: 500 }
      )
    }

    // Обновляем счётчик товаров в категории
    if (productData.category_id) {
      try {
        await supabase.rpc('increment_category_product_count', {
          cat_id: productData.category_id
        })
      } catch {
        // Если функция не существует, просто продолжаем
      }
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

// GET - получение списка товаров (для API)
export async function GET(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('products')
      .select(`
        id, name, price, sku, in_stock, images,
        category_id, supplier_id,
        categories(id, name),
        suppliers(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const search = searchParams.get('search')
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const category = searchParams.get('category')
    if (category) {
      query = query.eq('category_id', category)
    }

    const supplier = searchParams.get('supplier')
    if (supplier) {
      query = query.eq('supplier_id', supplier)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
