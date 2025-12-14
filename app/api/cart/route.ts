import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET /api/cart?telegram_user_id=123
// Получить корзину пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramUserId = searchParams.get('telegram_user_id')

    if (!telegramUserId) {
      return NextResponse.json(
        { error: 'telegram_user_id is required' },
        { status: 400 }
      )
    }

    // Получаем корзину с данными товаров
    const { data: cartItems, error } = await supabase
      .from('project_carts')
      .select(`
        id,
        quantity,
        price,
        total_price,
        currency,
        product_id,
        products (
          id,
          name,
          price,
          images,
          sku,
          suppliers (
            name
          )
        )
      `)
      .eq('user_id', telegramUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart', details: error.message },
        { status: 500 }
      )
    }

    // Форматируем данные для фронтенда
    const items = (cartItems || []).map((item: any) => ({
      id: item.product_id,
      name: item.products?.name || 'Unknown',
      price: item.price,
      quantity: item.quantity,
      image_url: item.products?.images?.[0] || null,
      supplier_name: item.products?.suppliers?.name || null,
      sku: item.products?.sku || null,
    }))

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    return NextResponse.json({
      items,
      total,
      currency: 'RUB',
      itemCount: items.length,
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/cart
// Синхронизировать корзину (полная замена)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegram_user_id, items } = body

    if (!telegram_user_id) {
      return NextResponse.json(
        { error: 'telegram_user_id is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'items must be an array' },
        { status: 400 }
      )
    }

    // Удаляем старую корзину пользователя
    const { error: deleteError } = await supabase
      .from('project_carts')
      .delete()
      .eq('user_id', String(telegram_user_id))

    if (deleteError) {
      console.error('Error deleting old cart:', deleteError)
    }

    // Если корзина пустая - просто возвращаем успех
    if (items.length === 0) {
      return NextResponse.json({ success: true, items: [] })
    }

    // Получаем актуальные цены товаров из БД
    const productIds = items.map((item: any) => item.id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json(
        { error: 'Failed to fetch product prices' },
        { status: 500 }
      )
    }

    const priceMap = new Map(products?.map((p: any) => [p.id, p.price]) || [])

    // Вставляем новые записи
    const cartRecords = items
      .filter((item: any) => priceMap.has(item.id)) // Только существующие товары
      .map((item: any) => {
        const price = priceMap.get(item.id) || item.price
        return {
          user_id: String(telegram_user_id),
          product_id: item.id,
          quantity: Math.max(1, item.quantity || 1),
          price: price,
          total_price: price * (item.quantity || 1),
          currency: 'RUB',
        }
      })

    if (cartRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('project_carts')
        .insert(cartRecords)

      if (insertError) {
        console.error('Error inserting cart:', insertError)
        return NextResponse.json(
          { error: 'Failed to save cart', details: insertError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      itemCount: cartRecords.length,
    })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart?telegram_user_id=123
// Очистить корзину
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramUserId = searchParams.get('telegram_user_id')

    if (!telegramUserId) {
      return NextResponse.json(
        { error: 'telegram_user_id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('project_carts')
      .delete()
      .eq('user_id', telegramUserId)

    if (error) {
      console.error('Error clearing cart:', error)
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
