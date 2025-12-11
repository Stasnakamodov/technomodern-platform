-- Миграция: Добавление GIN индекса для полнотекстового поиска
-- Ускоряет ILIKE поиск по name и description

-- Индекс для поиска по названию (триграммы)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN индекс для быстрого ILIKE поиска по названию
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_trgm
ON products USING gin(name gin_trgm_ops);

-- GIN индекс для быстрого ILIKE поиска по описанию
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_description_trgm
ON products USING gin(description gin_trgm_ops);

-- Составной индекс для фильтрации по категории + наличию + удалению
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_stock_deleted
ON products(category_id, in_stock, deleted_at)
WHERE in_stock = TRUE AND deleted_at IS NULL;

-- Индекс для сортировки по цене
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price
ON products(price)
WHERE in_stock = TRUE AND deleted_at IS NULL;

-- Индекс для сортировки по дате создания
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_created_at
ON products(created_at DESC)
WHERE in_stock = TRUE AND deleted_at IS NULL;

-- Комментарий
COMMENT ON INDEX idx_products_name_trgm IS 'Триграммный индекс для быстрого ILIKE поиска по названию товара';
COMMENT ON INDEX idx_products_description_trgm IS 'Триграммный индекс для быстрого ILIKE поиска по описанию товара';
