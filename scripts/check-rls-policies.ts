/**
 * Проверка RLS политик в Supabase
 * Убедимся что клиент может читать данные
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkRLS() {
  console.log('🔒 Проверяем RLS политики...\n')

  const tables = ['products', 'suppliers', 'categories']

  for (const table of tables) {
    console.log(`📋 Таблица: ${table}`)

    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error(`   ❌ Ошибка доступа:`, error)
      console.error(`   🔍 Code: ${error.code}`)
      console.error(`   🔍 Details: ${error.details}`)
      console.error(`   🔍 Hint: ${error.hint}`)
    } else {
      console.log(`   ✅ Доступ разрешен (${count} записей)`)
    }
    console.log()
  }

  console.log('💡 Если есть ошибки, нужно:')
  console.log('   1. Открыть Supabase Dashboard')
  console.log('   2. Table Editor → выбрать таблицу')
  console.log('   3. Settings → Enable Row Level Security = OFF')
  console.log('   или')
  console.log('   3. Settings → RLS Policies → New Policy → Enable read access for all')
}

checkRLS()
