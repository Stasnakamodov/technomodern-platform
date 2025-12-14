'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface AddToCartInput {
  telegramUserId: string
  productId: string
  quantity?: number
}

interface UpdateQuantityInput {
  telegramUserId: string
  productId: string
  quantity: number
}

interface CheckoutInput {
  telegramUserId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  message?: string
}

/**
 * Добавить товар в корзину
 */
export async function addToCartAction(input: AddToCartInput) {
  const { telegramUserId, productId, quantity = 1 } = input

  if (!telegramUserId || !productId) {
    return { error: 'Missing required fields' }
  }

  try {
    // Получаем товар
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, name')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return { error: 'Product not found' }
    }

    // Проверяем, есть ли уже в корзине
    const { data: existing } = await supabase
      .from('project_carts')
      .select('id, quantity')
      .eq('user_id', telegramUserId)
      .eq('product_id', productId)
      .single()

    if (existing) {
      // Увеличиваем количество
      const newQuantity = existing.quantity + quantity
      const { error } = await supabase
        .from('project_carts')
        .update({
          quantity: newQuantity,
          total_price: product.price * newQuantity,
        })
        .eq('id', existing.id)

      if (error) {
        return { error: 'Failed to update cart' }
      }

      return { success: true, quantity: newQuantity }
    }

    // Добавляем новый товар
    const { error } = await supabase
      .from('project_carts')
      .insert({
        user_id: telegramUserId,
        product_id: productId,
        quantity: quantity,
        price: product.price,
        total_price: product.price * quantity,
        currency: 'RUB',
      })

    if (error) {
      return { error: 'Failed to add to cart' }
    }

    revalidatePath('/cart')
    return { success: true, quantity }
  } catch (error) {
    console.error('addToCartAction error:', error)
    return { error: 'Server error' }
  }
}

/**
 * Обновить количество товара
 */
export async function updateQuantityAction(input: UpdateQuantityInput) {
  const { telegramUserId, productId, quantity } = input

  if (!telegramUserId || !productId) {
    return { error: 'Missing required fields' }
  }

  try {
    if (quantity <= 0) {
      // Удаляем товар
      const { error } = await supabase
        .from('project_carts')
        .delete()
        .eq('user_id', telegramUserId)
        .eq('product_id', productId)

      if (error) {
        return { error: 'Failed to remove item' }
      }

      revalidatePath('/cart')
      return { success: true, removed: true }
    }

    // Получаем текущую цену
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single()

    if (!product) {
      return { error: 'Product not found' }
    }

    // Обновляем количество
    const { error } = await supabase
      .from('project_carts')
      .update({
        quantity: quantity,
        total_price: product.price * quantity,
      })
      .eq('user_id', telegramUserId)
      .eq('product_id', productId)

    if (error) {
      return { error: 'Failed to update quantity' }
    }

    revalidatePath('/cart')
    return { success: true, quantity }
  } catch (error) {
    console.error('updateQuantityAction error:', error)
    return { error: 'Server error' }
  }
}

/**
 * Удалить товар из корзины
 */
export async function removeFromCartAction(telegramUserId: string, productId: string) {
  if (!telegramUserId || !productId) {
    return { error: 'Missing required fields' }
  }

  try {
    const { error } = await supabase
      .from('project_carts')
      .delete()
      .eq('user_id', telegramUserId)
      .eq('product_id', productId)

    if (error) {
      return { error: 'Failed to remove item' }
    }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('removeFromCartAction error:', error)
    return { error: 'Server error' }
  }
}

/**
 * Очистить корзину
 */
export async function clearCartAction(telegramUserId: string) {
  if (!telegramUserId) {
    return { error: 'Missing telegram user id' }
  }

  try {
    const { error } = await supabase
      .from('project_carts')
      .delete()
      .eq('user_id', telegramUserId)

    if (error) {
      return { error: 'Failed to clear cart' }
    }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('clearCartAction error:', error)
    return { error: 'Server error' }
  }
}

/**
 * Оформить заказ
 */
export async function checkoutAction(input: CheckoutInput) {
  const { telegramUserId, customerName, customerPhone, customerEmail, message } = input

  if (!telegramUserId || !customerName || !customerPhone) {
    return { error: 'Заполните обязательные поля' }
  }

  try {
    // Получаем корзину
    const { data: cartItems, error: cartError } = await supabase
      .from('project_carts')
      .select(`
        quantity,
        price,
        total_price,
        products (
          id,
          name,
          sku
        )
      `)
      .eq('user_id', telegramUserId)

    if (cartError || !cartItems || cartItems.length === 0) {
      return { error: 'Корзина пуста' }
    }

    // Формируем данные заказа
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.total_price, 0)
    const productsList = cartItems.map((item: any) =>
      `${item.products?.name} x${item.quantity} = ${item.total_price}₽`
    ).join('\n')

    // Создаём заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_telegram: telegramUserId,
        message: `${message || ''}\n\nТовары:\n${productsList}\n\nИтого: ${totalAmount}₽`,
        status: 'new',
        source: 'telegram_miniapp',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      return { error: 'Не удалось создать заказ' }
    }

    // Отправляем уведомление в Telegram
    await sendOrderToTelegram(order.id, {
      customerName,
      customerPhone,
      customerEmail,
      telegramUserId,
      products: productsList,
      totalAmount,
      message,
    })

    // Очищаем корзину
    await supabase
      .from('project_carts')
      .delete()
      .eq('user_id', telegramUserId)

    revalidatePath('/cart')
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('checkoutAction error:', error)
    return { error: 'Ошибка сервера' }
  }
}

/**
 * Отправка уведомления о заказе в Telegram
 */
async function sendOrderToTelegram(orderId: string, data: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  telegramUserId: string
  products: string
  totalAmount: number
  message?: string
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured')
    return
  }

  const messageText = `
🛒 <b>НОВЫЙ ЗАКАЗ ИЗ КАТАЛОГА #${orderId.slice(0, 8)}</b>

👤 <b>Клиент:</b>
├ Имя: ${data.customerName}
├ Телефон: ${data.customerPhone}
${data.customerEmail ? `├ Email: ${data.customerEmail}` : ''}
└ Telegram ID: ${data.telegramUserId}

📦 <b>Товары:</b>
${data.products}

💰 <b>Итого: ${data.totalAmount.toLocaleString('ru-RU')} ₽</b>

${data.message ? `💬 Комментарий: ${data.message}` : ''}

⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
`.trim()

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
      }),
    })
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}
