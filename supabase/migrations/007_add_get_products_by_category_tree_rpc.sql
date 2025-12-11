-- RPC функция для получения товаров по дереву категорий (родительская + все подкатегории)
-- Убирает N+1 запрос: получает подкатегории и товары за один вызов

CREATE OR REPLACE FUNCTION get_products_by_category_tree(
  parent_cat_id UUID,
  search_query TEXT DEFAULT NULL,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20,
  sort_by TEXT DEFAULT 'created_at',
  sort_order TEXT DEFAULT 'desc'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  images TEXT[],
  sku TEXT,
  category_id UUID,
  category_name TEXT,
  supplier_id UUID,
  supplier_name TEXT,
  in_stock BOOLEAN,
  min_order INTEGER,
  created_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offset INTEGER;
  v_search_pattern TEXT;
BEGIN
  -- Вычисляем offset для пагинации
  v_offset := (page_num - 1) * page_size;

  -- Формируем паттерн поиска
  IF search_query IS NOT NULL AND search_query != '' THEN
    v_search_pattern := '%' || search_query || '%';
  END IF;

  RETURN QUERY
  WITH category_tree AS (
    -- Родительская категория + все её подкатегории
    SELECT c.id
    FROM categories c
    WHERE c.id = parent_cat_id
       OR c.parent_id = parent_cat_id
  ),
  filtered_products AS (
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.images,
      p.sku,
      p.category_id,
      cat.name AS category_name,
      p.supplier_id,
      sup.name AS supplier_name,
      p.in_stock,
      p.min_order,
      p.created_at
    FROM products p
    JOIN categories cat ON p.category_id = cat.id
    LEFT JOIN suppliers sup ON p.supplier_id = sup.id
    WHERE p.category_id IN (SELECT ct.id FROM category_tree ct)
      AND p.in_stock = TRUE
      AND (p.deleted_at IS NULL)
      AND (
        v_search_pattern IS NULL
        OR p.name ILIKE v_search_pattern
        OR p.description ILIKE v_search_pattern
        OR p.sku ILIKE v_search_pattern
      )
  ),
  total AS (
    SELECT COUNT(*) AS cnt FROM filtered_products
  )
  SELECT
    fp.id,
    fp.name,
    fp.description,
    fp.price,
    fp.images,
    fp.sku,
    fp.category_id,
    fp.category_name,
    fp.supplier_id,
    fp.supplier_name,
    fp.in_stock,
    fp.min_order,
    fp.created_at,
    t.cnt AS total_count
  FROM filtered_products fp
  CROSS JOIN total t
  ORDER BY
    CASE WHEN sort_by = 'price' AND sort_order = 'asc' THEN fp.price END ASC NULLS LAST,
    CASE WHEN sort_by = 'price' AND sort_order = 'desc' THEN fp.price END DESC NULLS LAST,
    CASE WHEN sort_by = 'name' AND sort_order = 'asc' THEN fp.name END ASC NULLS LAST,
    CASE WHEN sort_by = 'name' AND sort_order = 'desc' THEN fp.name END DESC NULLS LAST,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN fp.created_at END ASC NULLS LAST,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN fp.created_at END DESC NULLS LAST,
    fp.created_at DESC -- fallback
  LIMIT page_size
  OFFSET v_offset;
END;
$$;

-- Добавляем комментарий
COMMENT ON FUNCTION get_products_by_category_tree IS 'Получение товаров по дереву категорий (родительская + подкатегории) за один запрос';

-- Выдаём права
GRANT EXECUTE ON FUNCTION get_products_by_category_tree TO anon, authenticated;
