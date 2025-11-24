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
);
