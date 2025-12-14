import crypto from 'crypto'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

interface ParsedInitData {
  user?: TelegramUser
  auth_date: number
  hash: string
  query_id?: string
  start_param?: string
  chat_type?: string
  chat_instance?: string
}

/**
 * Parse Telegram initData string into object
 */
export function parseInitData(initData: string): ParsedInitData | null {
  try {
    const params = new URLSearchParams(initData)
    const result: Record<string, any> = {}

    for (const [key, value] of params.entries()) {
      if (key === 'user') {
        try {
          result.user = JSON.parse(value)
        } catch {
          return null
        }
      } else if (key === 'auth_date') {
        result.auth_date = parseInt(value, 10)
      } else {
        result[key] = value
      }
    }

    if (!result.hash || !result.auth_date) {
      return null
    }

    return result as ParsedInitData
  } catch {
    return null
  }
}

/**
 * Validate Telegram WebApp initData
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(
  initData: string,
  botToken: string,
  options?: {
    /** Max age in seconds. Default: 86400 (24 hours) */
    maxAge?: number
  }
): { valid: boolean; user?: TelegramUser; error?: string } {
  const maxAge = options?.maxAge ?? 86400

  if (!initData || !botToken) {
    return { valid: false, error: 'Missing initData or botToken' }
  }

  try {
    // Parse the initData
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    const authDate = params.get('auth_date')

    if (!hash) {
      return { valid: false, error: 'Missing hash' }
    }

    if (!authDate) {
      return { valid: false, error: 'Missing auth_date' }
    }

    // Check if data is not too old
    const authTimestamp = parseInt(authDate, 10)
    const now = Math.floor(Date.now() / 1000)

    if (now - authTimestamp > maxAge) {
      return { valid: false, error: 'Data is too old' }
    }

    // Remove hash from params and sort
    params.delete('hash')
    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Create HMAC-SHA256 signature
    // Step 1: Create secret key as HMAC-SHA256 of bot token with "WebAppData" as key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Step 2: Create HMAC-SHA256 of data check string with secret key
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(sortedParams)
      .digest('hex')

    // Compare hashes
    if (calculatedHash !== hash) {
      return { valid: false, error: 'Invalid hash' }
    }

    // Parse user data
    const userParam = params.get('user')
    let user: TelegramUser | undefined

    if (userParam) {
      try {
        user = JSON.parse(userParam)
      } catch {
        // User data is optional
      }
    }

    return { valid: true, user }
  } catch (error) {
    console.error('initData validation error:', error)
    return { valid: false, error: 'Validation error' }
  }
}

/**
 * Middleware helper to validate Telegram initData from request headers
 */
export function getValidatedTelegramUser(
  initData: string | null,
  botToken: string
): TelegramUser | null {
  if (!initData || !botToken) {
    return null
  }

  const result = validateInitData(initData, botToken)

  if (!result.valid || !result.user) {
    return null
  }

  return result.user
}

/**
 * Check if the request is from a valid Telegram Mini App
 */
export function isTelegramMiniAppRequest(
  initData: string | null,
  botToken: string
): boolean {
  if (!initData || !botToken) {
    return false
  }

  const result = validateInitData(initData, botToken)
  return result.valid
}
