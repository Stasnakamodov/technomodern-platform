-- Миграция: Рефакторинг каталога
-- Добавляет: soft delete, триггеры для счётчиков, полнотекстовый поиск

-- ============================================
-- 1. SOFT DELETE - добавляем колонку deleted_at
-- ============================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Индекс для быстрой фильтрации активных товаров
CREATE INDEX IF NOT EXISTS idx_products_active
ON products(category_id, deleted_at)
WHERE deleted_at IS NULL;

-- Индекс для сортировки по цене
CREATE INDEX IF NOT EXISTS idx_products_price
ON products(price);

-- Индекс для сортировки по дате
CREATE INDEX IF NOT EXISTS idx_products_created
ON products(created_at DESC);

-- ============================================
-- 2. ПОЛНОТЕКСТОВЫЙ ПОИСК
-- ============================================

-- Добавляем колонку для поискового вектора
ALTER TABLE products
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Функция обновления поискового вектора
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('russian', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('russian', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.sku, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автообновления поискового вектора
DROP TRIGGER IF EXISTS trg_products_search_vector ON products;
CREATE TRIGGER trg_products_search_vector
BEFORE INSERT OR UPDATE OF name, description, sku ON products
FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- GIN индекс для быстрого полнотекстового поиска
CREATE INDEX IF NOT EXISTS idx_products_search
ON products USING GIN(search_vector);

-- Заполняем search_vector для существующих товаров
UPDATE products SET
  search_vector =
    setweight(to_tsvector('russian', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('russian', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(sku, '')), 'C')
WHERE search_vector IS NULL;

-- ============================================
-- 3. ТРИГГЕРЫ ДЛЯ СЧЁТЧИКОВ КАТЕГОРИЙ
-- ============================================

-- Функция пересчёта product_count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
  old_cat_id UUID;
  new_cat_id UUID;
  old_deleted BOOLEAN;
  new_deleted BOOLEAN;
BEGIN
  -- Определяем старые и новые значения
  IF TG_OP = 'DELETE' THEN
    old_cat_id := OLD.category_id;
    old_deleted := OLD.deleted_at IS NOT NULL;
    new_cat_id := NULL;
    new_deleted := TRUE;
  ELSIF TG_OP = 'INSERT' THEN
    old_cat_id := NULL;
    old_deleted := TRUE;
    new_cat_id := NEW.category_id;
    new_deleted := NEW.deleted_at IS NOT NULL;
  ELSE -- UPDATE
    old_cat_id := OLD.category_id;
    old_deleted := OLD.deleted_at IS NOT NULL;
    new_cat_id := NEW.category_id;
    new_deleted := NEW.deleted_at IS NOT NULL;
  END IF;

  -- Уменьшаем счётчик старой категории (если товар был активен)
  IF old_cat_id IS NOT NULL AND NOT old_deleted THEN
    IF new_cat_id IS DISTINCT FROM old_cat_id OR new_deleted THEN
      UPDATE categories
      SET product_count = GREATEST(0, product_count - 1)
      WHERE id = old_cat_id;
    END IF;
  END IF;

  -- Увеличиваем счётчик новой категории (если товар активен)
  IF new_cat_id IS NOT NULL AND NOT new_deleted THEN
    IF old_cat_id IS DISTINCT FROM new_cat_id OR old_deleted THEN
      UPDATE categories
      SET product_count = product_count + 1
      WHERE id = new_cat_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Триггер
DROP TRIGGER IF EXISTS trg_category_product_count ON products;
CREATE TRIGGER trg_category_product_count
AFTER INSERT OR UPDATE OF category_id, deleted_at OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- ============================================
-- 4. ПЕРЕСЧЁТ ВСЕХ СЧЁТЧИКОВ (разовая операция)
-- ============================================

-- Обновляем счётчики для всех категорий
UPDATE categories c
SET product_count = (
  SELECT COUNT(*)
  FROM products p
  WHERE p.category_id = c.id
    AND p.deleted_at IS NULL
    AND p.in_stock = TRUE
);

-- ============================================
-- 5. ФУНКЦИЯ ДЛЯ ПОИСКА ТОВАРОВ
-- ============================================

CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT DEFAULT NULL,
  cat_id UUID DEFAULT NULL,
  page_num INT DEFAULT 1,
  page_size INT DEFAULT 20,
  sort_by TEXT DEFAULT 'created_at',
  sort_order TEXT DEFAULT 'desc'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  images TEXT[],
  sku TEXT,
  category_id UUID,
  category_name TEXT,
  supplier_id UUID,
  supplier_name TEXT,
  in_stock BOOLEAN,
  min_order INT,
  created_at TIMESTAMPTZ,
  total_count BIGINT
) AS $$
DECLARE
  offset_val INT;
  total BIGINT;
BEGIN
  offset_val := (page_num - 1) * page_size;

  -- Считаем общее количество
  SELECT COUNT(*) INTO total
  FROM products p
  WHERE p.deleted_at IS NULL
    AND p.in_stock = TRUE
    AND (cat_id IS NULL OR p.category_id = cat_id)
    AND (search_query IS NULL OR search_query = '' OR p.search_vector @@ plainto_tsquery('russian', search_query));

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.images,
    p.sku,
    p.category_id,
    c.name AS category_name,
    p.supplier_id,
    s.name AS supplier_name,
    p.in_stock,
    p.min_order,
    p.created_at,
    total AS total_count
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN suppliers s ON s.id = p.supplier_id
  WHERE p.deleted_at IS NULL
    AND p.in_stock = TRUE
    AND (cat_id IS NULL OR p.category_id = cat_id)
    AND (search_query IS NULL OR search_query = '' OR p.search_vector @@ plainto_tsquery('russian', search_query))
  ORDER BY
    CASE WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price' AND sort_order = 'desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'name' AND sort_order = 'asc' THEN p.name END ASC,
    CASE WHEN sort_by = 'name' AND sort_order = 'desc' THEN p.name END DESC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN p.created_at END ASC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN p.created_at END DESC NULLS LAST
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ КАТЕГОРИЙ С ПОДСЧЁТОМ
-- ============================================

CREATE OR REPLACE FUNCTION get_categories_with_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  icon TEXT,
  parent_id UUID,
  level INT,
  product_count INT,
  subcategories_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.icon,
    c.parent_id,
    c.level,
    c.product_count,
    (SELECT COUNT(*)::INT FROM categories sub WHERE sub.parent_id = c.id) AS subcategories_count
  FROM categories c
  ORDER BY c.level, c.name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. ФУНКЦИЯ SOFT DELETE
-- ============================================

CREATE OR REPLACE FUNCTION soft_delete_product(product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET deleted_at = NOW()
  WHERE id = product_id AND deleted_at IS NULL;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Функция восстановления удалённого товара
CREATE OR REPLACE FUNCTION restore_product(product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET deleted_at = NULL
  WHERE id = product_id AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- КОММЕНТАРИИ
-- ============================================

COMMENT ON COLUMN products.deleted_at IS 'Soft delete: NULL = активный, NOT NULL = удалён';
COMMENT ON COLUMN products.search_vector IS 'Полнотекстовый поисковый вектор (русский + английский)';
COMMENT ON FUNCTION search_products IS 'Серверный поиск с пагинацией, фильтрацией и сортировкой';
COMMENT ON FUNCTION get_categories_with_counts IS 'Категории с актуальными счётчиками';
COMMENT ON FUNCTION soft_delete_product IS 'Мягкое удаление товара';
COMMENT ON FUNCTION restore_product IS 'Восстановление удалённого товара';
