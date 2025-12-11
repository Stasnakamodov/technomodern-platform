#!/usr/bin/env node
/**
 * Скрипт для применения миграции 004_create_orders_table.sql
 * Использует Supabase Management API
 */

const SUPABASE_PROJECT_ID = 'rbngpxwamfkunktxjtqh';
const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';

// Service Role Key из документации
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

const MIGRATION_SQL = `
-- Создание таблицы заявок для Telegram бота

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    customer_telegram VARCHAR(100),
    product_name VARCHAR(500),
    product_category VARCHAR(255),
    product_url TEXT,
    quantity INTEGER DEFAULT 1,
    target_price DECIMAL(10, 2),
    message TEXT,
    marketplace VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    telegram_message_id INTEGER,
    telegram_chat_id VARCHAR(100),
    source VARCHAR(100) DEFAULT 'website',
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_telegram_message_id ON orders(telegram_message_id);

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

COMMENT ON TABLE orders IS 'Заявки клиентов с сайта и Telegram бота';
COMMENT ON COLUMN orders.status IS 'Статус: new, processing, completed, cancelled';
COMMENT ON COLUMN orders.source IS 'Источник заявки: website, telegram_bot, whatsapp';
COMMENT ON COLUMN orders.telegram_message_id IS 'ID сообщения отправленного в Telegram';

INSERT INTO orders (
    customer_name,
    customer_phone,
    customer_email,
    product_name,
    message,
    status
)
SELECT
    'Тестовый клиент',
    '+79991234567',
    'test@example.com',
    'Тестовый товар из Alibaba',
    'Это тестовая заявка для проверки системы',
    'new'
WHERE NOT EXISTS (
    SELECT 1 FROM orders WHERE customer_phone = '+79991234567' AND customer_name = 'Тестовый клиент'
);
`;

async function applyMigration() {
  console.log('🔄 Применяю миграцию через Supabase REST API...\n');

  try {
    // Пытаемся выполнить SQL через PostgREST RPC
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        query: MIGRATION_SQL
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('⚠️  PostgREST RPC недоступен:', error);
      console.log('\n📌 АЛЬТЕРНАТИВНЫЙ СПОСОБ:\n');
      console.log('Примени миграцию через Supabase Dashboard:');
      console.log(`1. Открой: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`);
      console.log('2. Скопируй SQL из файла: supabase/migrations/004_create_orders_table.sql');
      console.log('3. Нажми RUN\n');
      return false;
    }

    const result = await response.json();
    console.log('✅ Миграция успешно применена!');
    console.log('📊 Результат:', result);
    return true;

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n📌 РЕКОМЕНДАЦИЯ:\n');
    console.log('Примени миграцию вручную через Supabase Dashboard:');
    console.log(`1. Открой: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`);
    console.log('2. Скопируй содержимое файла: supabase/migrations/004_create_orders_table.sql');
    console.log('3. Нажми кнопку RUN');
    console.log('\nЭто займёт 2 минуты! 🚀\n');
    return false;
  }
}

// Запуск
applyMigration().then(success => {
  process.exit(success ? 0 : 1);
});
