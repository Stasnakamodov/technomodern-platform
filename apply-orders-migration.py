#!/usr/bin/env python3
"""
Скрипт для применения миграции 004_create_orders_table.sql
Использует прямое подключение к Supabase PostgreSQL
"""

import os
import sys

try:
    import psycopg2
except ImportError:
    print("❌ Библиотека psycopg2 не установлена!")
    print("Установите: pip install psycopg2-binary")
    sys.exit(1)

# Supabase connection details
SUPABASE_PROJECT_ID = "rbngpxwamfkunktxjtqh"
SUPABASE_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")

if not SUPABASE_PASSWORD:
    print("❌ Переменная окружения SUPABASE_DB_PASSWORD не установлена!")
    print("\nКак получить пароль:")
    print("1. Открыть https://supabase.com/dashboard/project/rbngpxwamfkunktxjtqh/settings/database")
    print("2. Найти секцию 'Connection string'")
    print("3. Скопировать пароль из строки подключения")
    print("\nЗатем запустить:")
    print(f"SUPABASE_DB_PASSWORD='ваш_пароль' python3 {sys.argv[0]}")
    sys.exit(1)

# Connection parameters (using dict to avoid URL encoding issues)
# Try direct connection first
DB_PARAMS = {
    'host': f'db.{SUPABASE_PROJECT_ID}.supabase.co',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': SUPABASE_PASSWORD,
    'sslmode': 'require'
}

# SQL migration
MIGRATION_SQL = """
-- Создание таблицы заявок для Telegram бота
-- Автор: Claude Code AI Assistant
-- Дата: 2025-11-17

-- Таблица заявок от клиентов
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Информация о клиенте
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    customer_telegram VARCHAR(100),

    -- Детали заявки
    product_name VARCHAR(500),
    product_category VARCHAR(255),
    product_url TEXT,
    quantity INTEGER DEFAULT 1,
    target_price DECIMAL(10, 2),

    -- Дополнительная информация
    message TEXT,
    marketplace VARCHAR(100), -- Alibaba, 1688, Taobao и т.д.

    -- Статус заявки
    status VARCHAR(50) DEFAULT 'new', -- new, processing, completed, cancelled

    -- Telegram интеграция
    telegram_message_id INTEGER, -- ID сообщения в Telegram
    telegram_chat_id VARCHAR(100), -- ID чата куда отправлено

    -- Метаданные
    source VARCHAR(100) DEFAULT 'website', -- website, telegram_bot, whatsapp
    user_agent TEXT,
    ip_address INET,

    -- Временные метки
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_telegram_message_id ON orders(telegram_message_id);

-- Триггер для автообновления updated_at
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

-- Комментарии к таблице
COMMENT ON TABLE orders IS 'Заявки клиентов с сайта и Telegram бота';
COMMENT ON COLUMN orders.status IS 'Статус: new, processing, completed, cancelled';
COMMENT ON COLUMN orders.source IS 'Источник заявки: website, telegram_bot, whatsapp';
COMMENT ON COLUMN orders.telegram_message_id IS 'ID сообщения отправленного в Telegram';

-- Тестовая запись
INSERT INTO orders (
    customer_name,
    customer_phone,
    customer_email,
    product_name,
    message,
    status
) VALUES (
    'Тестовый клиент',
    '+79991234567',
    'test@example.com',
    'Тестовый товар из Alibaba',
    'Это тестовая заявка для проверки системы',
    'new'
)
ON CONFLICT DO NOTHING;
"""

def apply_migration():
    """Применяет миграцию к базе данных"""
    print("🔄 Подключение к Supabase PostgreSQL...")

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        conn.autocommit = True
        cursor = conn.cursor()

        print("✅ Подключение успешно!")
        print("🚀 Применяю миграцию...")

        cursor.execute(MIGRATION_SQL)

        print("✅ Миграция успешно применена!")

        # Проверяем результат
        cursor.execute("SELECT COUNT(*) FROM orders;")
        count = cursor.fetchone()[0]
        print(f"📊 В таблице orders: {count} записей")

        cursor.close()
        conn.close()

        print("\n🎉 Готово! Таблица orders создана и готова к работе.")
        return True

    except psycopg2.Error as e:
        print(f"❌ Ошибка при применении миграции:")
        print(f"   {e}")
        return False
    except Exception as e:
        print(f"❌ Неожиданная ошибка:")
        print(f"   {e}")
        return False

if __name__ == "__main__":
    success = apply_migration()
    sys.exit(0 if success else 1)
