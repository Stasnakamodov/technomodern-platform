import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Серверный клиент с anon key (соблюдает RLS)
// Используется для обычных запросов в API routes и Server Components
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Admin клиент с service role key (обходит RLS)
// ТОЛЬКО для административных операций: миграции, пакетные обновления
// НЕ использовать для пользовательских запросов!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

// Проверка доступности admin клиента
export function getAdminClient() {
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY не настроен. Admin операции недоступны.')
  }
  return supabaseAdmin
}
