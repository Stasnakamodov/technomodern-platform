import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Проверка наличия обязательных переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Инициализация Supabase клиента
const supabase = createClient(supabaseUrl, supabaseKey)

// Типы данных
interface OrderData {
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_telegram?: string
  product_name?: string
  product_category?: string
  product_url?: string
  quantity?: number
  target_price?: number
  message?: string
  marketplace?: string
}

// Функция отправки сообщения в Telegram
async function sendTelegramMessage(orderData: OrderData, orderId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN не настроен в .env.local')
  }

  if (!chatId) {
    throw new Error('TELEGRAM_CHAT_ID не настроен в .env.local')
  }

  // Форматируем красивое сообщение
  const message = `
🔔 <b>НОВАЯ ЗАЯВКА #${orderId.slice(0, 8)}</b>

👤 <b>Клиент:</b>
├ Имя: ${orderData.customer_name}
├ Телефон: ${orderData.customer_phone}
${orderData.customer_email ? `├ Email: ${orderData.customer_email}` : ''}
${orderData.customer_telegram ? `└ Telegram: ${orderData.customer_telegram}` : ''}

${orderData.product_name ? `📦 <b>Товар:</b>\n├ Название: ${orderData.product_name}` : ''}
${orderData.product_category ? `├ Категория: ${orderData.product_category}` : ''}
${orderData.quantity ? `├ Количество: ${orderData.quantity} шт.` : ''}
${orderData.target_price ? `├ Целевая цена: ${orderData.target_price} ₽` : ''}
${orderData.marketplace ? `└ Площадка: ${orderData.marketplace}` : ''}

${orderData.product_url ? `🔗 <b>Ссылка:</b>\n${orderData.product_url}\n` : ''}
${orderData.message ? `💬 <b>Сообщение:</b>\n${orderData.message}\n` : ''}
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
🆔 <b>ID заявки:</b> <code>${orderId}</code>
`.trim()

  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Ошибка отправки в Telegram: ${JSON.stringify(error)}`)
  }

  const result = await response.json()
  return result.result.message_id
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    // Парсим данные из запроса
    const orderData: OrderData = await request.json()

    // Валидация обязательных полей
    if (!orderData.customer_name || !orderData.customer_phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      )
    }

    // Сохраняем заявку в Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        customer_telegram: orderData.customer_telegram,
        product_name: orderData.product_name,
        product_category: orderData.product_category,
        product_url: orderData.product_url,
        quantity: orderData.quantity || 1,
        target_price: orderData.target_price,
        message: orderData.message,
        marketplace: orderData.marketplace,
        status: 'new',
        source: 'website',
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Ошибка сохранения в Supabase:', dbError)
      return NextResponse.json(
        { error: 'Ошибка сохранения заявки в базу данных', details: dbError.message },
        { status: 500 }
      )
    }

    // Отправляем сообщение в Telegram
    let telegramMessageId: number | null = null
    try {
      telegramMessageId = await sendTelegramMessage(orderData, order.id)

      // Обновляем запись с ID сообщения в Telegram
      await supabase
        .from('orders')
        .update({
          telegram_message_id: telegramMessageId,
          telegram_chat_id: process.env.TELEGRAM_CHAT_ID,
        })
        .eq('id', order.id)
    } catch (telegramError) {
      console.error('Ошибка отправки в Telegram:', telegramError)
      // Не прерываем запрос - заявка сохранена в БД
    }

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена!',
      orderId: order.id,
      telegramSent: !!telegramMessageId,
    })
  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json(
      {
        error: 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
