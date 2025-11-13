import { createClient } from '@supabase/supabase-js'

// Загружаем из environment variables с валидацией
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Валидация: приложение не запустится без корректных credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
  )
}

// Создаем и экспортируем клиент
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
