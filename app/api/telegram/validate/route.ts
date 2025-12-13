import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Валидация initData от Telegram Mini App
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface ValidatedData {
  user?: TelegramUser
  query_id?: string
  auth_date: number
  hash: string
}

function validateInitData(initData: string, botToken: string): ValidatedData | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')

    if (!hash) {
      return null
    }

    // Удаляем hash из параметров для проверки
    urlParams.delete('hash')

    // Сортируем параметры и создаём data-check-string
    const dataCheckArr: string[] = []
    urlParams.sort()
    urlParams.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`)
    })
    const dataCheckString = dataCheckArr.join('\n')

    // Создаём secret_key = HMAC-SHA256(bot_token, "WebAppData")
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Вычисляем hash = HMAC-SHA256(data_check_string, secret_key)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    // Сравниваем хеши
    if (calculatedHash !== hash) {
      console.error('Hash mismatch:', { calculated: calculatedHash, received: hash })
      return null
    }

    // Проверяем auth_date (не старше 24 часов)
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10)
    const now = Math.floor(Date.now() / 1000)
    const maxAge = 86400 // 24 часа

    if (now - authDate > maxAge) {
      console.error('Init data expired:', { authDate, now, diff: now - authDate })
      return null
    }

    // Парсим user
    const userStr = urlParams.get('user')
    const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : undefined

    return {
      user,
      query_id: urlParams.get('query_id') || undefined,
      auth_date: authDate,
      hash
    }
  } catch (error) {
    console.error('Error validating init data:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()

    if (!initData) {
      return NextResponse.json(
        { error: 'initData is required' },
        { status: 400 }
      )
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const validatedData = validateInitData(initData, botToken)

    if (!validatedData) {
      return NextResponse.json(
        { error: 'Invalid init data', valid: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: validatedData.user,
      auth_date: validatedData.auth_date
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    )
  }
}
