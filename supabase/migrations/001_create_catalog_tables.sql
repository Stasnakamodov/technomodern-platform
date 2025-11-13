-- ТехноМодерн Каталог - Структура БД (копия Get2B)
-- Создано: 2025-11-11

-- 1. Таблица поставщиков (suppliers)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  country TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Таблица категорий (3-уровневая система)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1, -- 1=категория, 2=подкатегория, 3=под-подкатегория
  display_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для быстрого поиска по уровням и parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);

-- 3. Таблица товаров (products)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  min_order INTEGER DEFAULT 1,
  in_stock BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}', -- Массив URL изображений
  specifications JSONB DEFAULT '{}', -- Технические характеристики
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('russian', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('russian', description));

-- 4. Таблица корзин (project_carts)
CREATE TABLE IF NOT EXISTS project_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Временно TEXT, потом можно заменить на UUID с auth.users
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- Один товар - одна позиция в корзине
);

-- Индексы для корзины
CREATE INDEX IF NOT EXISTS idx_project_carts_user ON project_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_carts_product ON project_carts(product_id);

-- 5. Функция автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автообновления updated_at
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_carts_updated_at BEFORE UPDATE ON project_carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS) - пока отключено для разработки
-- ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_carts ENABLE ROW LEVEL SECURITY;

-- Комментарии к таблицам
COMMENT ON TABLE suppliers IS 'Поставщики товаров (verified/user)';
COMMENT ON TABLE categories IS '3-уровневая система категорий';
COMMENT ON TABLE products IS 'Товары с характеристиками и изображениями';
COMMENT ON TABLE project_carts IS 'Корзины пользователей (замена localStorage)';
