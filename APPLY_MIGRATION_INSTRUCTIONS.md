# Как применить миграцию каталога

## Способ 1: Через Supabase Dashboard (САМЫЙ ПРОСТОЙ)

1. Открой: https://supabase.com/dashboard/project/rbngpxwamfkunktxjtqh/sql/new

2. Скопируй и вставь этот SQL:

```sql
-- ============================================
-- 1. SOFT DELETE
-- ============================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_products_active
ON products(category_id, deleted_at)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_price
ON products(price);

CREATE INDEX IF NOT EXISTS idx_products_created
ON products(created_at DESC);

-- ============================================
-- 2. ПОЛНОТЕКСТОВЫЙ ПОИСК
-- ============================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

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

DROP TRIGGER IF EXISTS trg_products_search_vector ON products;
CREATE TRIGGER trg_products_search_vector
BEFORE INSERT OR UPDATE OF name, description, sku ON products
FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

CREATE INDEX IF NOT EXISTS idx_products_search
ON products USING GIN(search_vector);

UPDATE products SET
  search_vector =
    setweight(to_tsvector('russian', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('russian', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(sku, '')), 'C')
WHERE search_vector IS NULL;

-- ============================================
-- 3. ТРИГГЕР ДЛЯ СЧЁТЧИКОВ
-- ============================================

CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
  old_cat_id UUID;
  new_cat_id UUID;
  old_deleted BOOLEAN;
  new_deleted BOOLEAN;
BEGIN
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
  ELSE
    old_cat_id := OLD.category_id;
    old_deleted := OLD.deleted_at IS NOT NULL;
    new_cat_id := NEW.category_id;
    new_deleted := NEW.deleted_at IS NOT NULL;
  END IF;

  IF old_cat_id IS NOT NULL AND NOT old_deleted THEN
    IF new_cat_id IS DISTINCT FROM old_cat_id OR new_deleted THEN
      UPDATE categories
      SET product_count = GREATEST(0, product_count - 1)
      WHERE id = old_cat_id;
    END IF;
  END IF;

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

DROP TRIGGER IF EXISTS trg_category_product_count ON products;
CREATE TRIGGER trg_category_product_count
AFTER INSERT OR UPDATE OF category_id, deleted_at OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- ============================================
-- 4. ПЕРЕСЧЁТ СЧЁТЧИКОВ
-- ============================================

UPDATE categories c
SET product_count = (
  SELECT COUNT(*)
  FROM products p
  WHERE p.category_id = c.id
    AND p.deleted_at IS NULL
    AND p.in_stock = TRUE
);

-- ============================================
-- 5. RPC ФУНКЦИИ
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

CREATE OR REPLACE FUNCTION soft_delete_product(product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET deleted_at = NOW()
  WHERE id = product_id AND deleted_at IS NULL;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_product(product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET deleted_at = NULL
  WHERE id = product_id AND deleted_at IS NOT NULL;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

3. Нажми "Run" (зелёная кнопка)

4. Проверь что миграция прошла:
```sql
SELECT COUNT(*) as active_products FROM products WHERE deleted_at IS NULL;
SELECT name, product_count FROM categories WHERE product_count > 0 ORDER BY product_count DESC LIMIT 10;
```

---

## Способ 2: Через Supabase CLI

```bash
# Авторизация
supabase login

# Линковка с проектом
supabase link --project-ref rbngpxwamfkunktxjtqh

# Применение миграции
supabase db push
```

---

## После миграции

Запусти dev сервер и проверь каталог:
```bash
npm run dev
# Открой http://localhost:3000/catalog
```
