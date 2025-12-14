-- Таблица связи товаров и поставщиков
-- Один товар может быть у нескольких поставщиков с разными ценами

CREATE TABLE IF NOT EXISTS product_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Артикул поставщика (у каждого поставщика свой)
  supplier_sku VARCHAR(100),
  
  -- Цена от этого поставщика
  supplier_price DECIMAL(10,2) NOT NULL,
  
  -- Наличие у этого поставщика
  in_stock BOOLEAN DEFAULT true,
  
  -- Минимальный заказ у этого поставщика
  min_order INTEGER DEFAULT 1,
  
  -- Срок поставки (дней)
  delivery_days INTEGER,
  
  -- Приоритет (чем меньше, тем выше приоритет)
  priority INTEGER DEFAULT 100,
  
  -- Примечания
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Уникальная комбинация товар + поставщик
  UNIQUE(product_id, supplier_id)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_product_suppliers_product ON product_suppliers(product_id);
CREATE INDEX IF NOT EXISTS idx_product_suppliers_supplier ON product_suppliers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_suppliers_price ON product_suppliers(supplier_price);
CREATE INDEX IF NOT EXISTS idx_product_suppliers_in_stock ON product_suppliers(in_stock);

-- RLS политики
ALTER TABLE product_suppliers ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (для каталога)
DROP POLICY IF EXISTS "Public read access" ON product_suppliers;
CREATE POLICY "Public read access" ON product_suppliers
  FOR SELECT USING (true);

-- Запись для всех (через API)
DROP POLICY IF EXISTS "Admin insert access" ON product_suppliers;
CREATE POLICY "Admin insert access" ON product_suppliers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON product_suppliers;
CREATE POLICY "Admin update access" ON product_suppliers
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin delete access" ON product_suppliers;
CREATE POLICY "Admin delete access" ON product_suppliers
  FOR DELETE USING (true);
