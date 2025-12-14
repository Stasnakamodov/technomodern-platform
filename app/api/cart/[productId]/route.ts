import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface RouteParams {
  params: Promise<{ productId: string }>
}

// PUT /api/cart/[productId]
// Добавить товар или изменить количество
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { productId } = await params
    const body = await request.json()
    const { telegram_user_id, quantity } = body

    if (!telegram_user_id) {
      return NextResponse.json(
        { error: 'telegram_user_id is required' },
        { status: 400 }
      )
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'quantity must be a non-negative number' },
        { status: 400 }
      )
    }

    // Если quantity = 0, удаляем товар
    if (quantity === 0) {
      const { error } = await supabase
        .from('project_carts')
        .delete()
        .eq('user_id', String(telegram_user_id))
        .eq('product_id', productId)

      if (error) {
        console.error('Error removing from cart:', error)
        return NextResponse.json(
          { error: 'Failed to remove item' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, removed: true })
    }

    // Получаем актуальную цену товара
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, name')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Upsert - добавить или обновить
    const { data, error } = await supabase
      .from('project_carts')
      .upsert(
        {
          user_id: String(telegram_user_id),
          product_id: productId,
          quantity: quantity,
          price: product.price,
          total_price: product.price * quantity,
          currency: 'RUB',
        },
        {
          onConflict: 'user_id,product_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error updating cart:', error)
      return NextResponse.json(
        { error: 'Failed to update cart', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      item: {
        id: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total_price: product.price * quantity,
      },
    })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[productId]?telegram_user_id=123
// Удалить товар из корзины
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { productId } = await params
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
      .eq('product_id', productId)

    if (error) {
      console.error('Error deleting from cart:', error)
      return NextResponse.json(
        { error: 'Failed to remove item' },
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
