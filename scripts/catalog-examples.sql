-- ===============================================
-- ПРИМЕРЫ ЗАПРОСОВ К КАТАЛОГУ ТОВАРОВ
-- ===============================================

-- 1. ОБЩАЯ СТАТИСТИКА
-- ===============================================

-- Всего товаров, категорий, поставщиков
SELECT
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM categories WHERE level = 1) as total_categories,
  (SELECT COUNT(*) FROM categories WHERE level = 2) as total_subcategories,
  (SELECT COUNT(*) FROM suppliers) as total_suppliers;

-- 2. ТОВАРЫ ПО КАТЕГОРИЯМ
-- ===============================================

-- Количество товаров в каждой категории
SELECT
  c.name as category,
  c.icon,
  COUNT(p.id) as products_count,
  ROUND(AVG(p.price)) as avg_price,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.level = 1
GROUP BY c.id, c.name, c.icon
ORDER BY products_count DESC;

-- Товары с подкатегориями
SELECT
  c1.name as category,
  c2.name as subcategory,
  COUNT(p.id) as products_count
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN products p ON p.category_id = c1.id OR p.category_id = c2.id
WHERE c1.level = 1
GROUP BY c1.name, c2.name
ORDER BY c1.name, products_count DESC;

-- 3. ПОИСК ТОВАРОВ
-- ===============================================

-- Полнотекстовый поиск (русский язык)
SELECT
  id,
  name,
  price,
  description,
  ts_rank(to_tsvector('russian', name || ' ' || description), query) as rank
FROM products, plainto_tsquery('russian', 'смартфон xiaomi') query
WHERE to_tsvector('russian', name || ' ' || description) @@ query
ORDER BY rank DESC
LIMIT 10;

-- Поиск по названию (простой)
SELECT id, name, price, category_id
FROM products
WHERE name ILIKE '%смартфон%'
LIMIT 20;

-- Поиск с фильтрами
SELECT
  p.id,
  p.name,
  p.price,
  c.name as category,
  s.name as supplier
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN suppliers s ON s.id = p.supplier_id
WHERE
  p.name ILIKE '%ноутбук%'
  AND p.price BETWEEN 50000 AND 150000
  AND p.in_stock = true
ORDER BY p.price ASC;

-- 4. ТОПОВЫЕ ТОВАРЫ
-- ===============================================

-- Самые дорогие товары
SELECT
  name,
  price,
  c.name as category,
  s.name as supplier
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN suppliers s ON s.id = p.supplier_id
ORDER BY price DESC
LIMIT 10;

-- Самые дешевые товары
SELECT
  name,
  price,
  c.name as category,
  moq
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE in_stock = true
ORDER BY price ASC
LIMIT 10;

-- 5. ПОСТАВЩИКИ
-- ===============================================

-- Топ поставщиков по количеству товаров
SELECT
  s.name,
  s.city,
  s.rating,
  COUNT(p.id) as products_count,
  ROUND(AVG(p.price)) as avg_product_price
FROM suppliers s
LEFT JOIN products p ON p.supplier_id = s.id
GROUP BY s.id, s.name, s.city, s.rating
ORDER BY products_count DESC;

-- Поставщики с высоким рейтингом
SELECT
  name,
  city,
  rating,
  verified
FROM suppliers
WHERE rating >= 4.7 AND verified = true
ORDER BY rating DESC;

-- 6. АНАЛИТИКА ЦЕН
-- ===============================================

-- Средняя цена по категориям
SELECT
  c.name as category,
  COUNT(p.id) as total_products,
  ROUND(AVG(p.price)) as avg_price,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.price)) as median_price,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price
FROM categories c
JOIN products p ON p.category_id = c.id
WHERE c.level = 1
GROUP BY c.name
ORDER BY avg_price DESC;

-- Распределение товаров по ценовым диапазонам
SELECT
  CASE
    WHEN price < 1000 THEN 'До 1000₽'
    WHEN price < 5000 THEN '1000-5000₽'
    WHEN price < 10000 THEN '5000-10000₽'
    WHEN price < 50000 THEN '10000-50000₽'
    ELSE 'Более 50000₽'
  END as price_range,
  COUNT(*) as products_count
FROM products
GROUP BY price_range
ORDER BY
  CASE
    WHEN price < 1000 THEN 1
    WHEN price < 5000 THEN 2
    WHEN price < 10000 THEN 3
    WHEN price < 50000 THEN 4
    ELSE 5
  END;

-- 7. НАЛИЧИЕ И MOQ
-- ===============================================

-- Товары в наличии
SELECT
  c.name as category,
  COUNT(CASE WHEN p.in_stock THEN 1 END) as in_stock,
  COUNT(CASE WHEN NOT p.in_stock THEN 1 END) as out_of_stock
FROM categories c
JOIN products p ON p.category_id = c.id
WHERE c.level = 1
GROUP BY c.name;

-- Товары с низким MOQ (легко заказать)
SELECT
  name,
  price,
  moq,
  c.name as category
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE moq <= 5 AND in_stock = true
ORDER BY moq ASC, price ASC
LIMIT 20;

-- 8. ПОЛЕЗНЫЕ VIEW
-- ===============================================

-- Создать view для удобного доступа к товарам
CREATE OR REPLACE VIEW products_full AS
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.currency,
  p.moq as min_order_quantity,
  p.in_stock,
  p.images,
  p.specifications,
  c.name as category,
  s.name as supplier_name,
  s.city as supplier_city,
  s.rating as supplier_rating,
  s.verified as supplier_verified
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN suppliers s ON s.id = p.supplier_id;

-- Использование view
SELECT * FROM products_full
WHERE category = 'Электроника'
  AND in_stock = true
ORDER BY price ASC
LIMIT 10;

-- 9. СЛУЧАЙНЫЕ ТОВАРЫ (для главной страницы)
-- ===============================================

-- 10 случайных товаров
SELECT * FROM products
WHERE in_stock = true
ORDER BY RANDOM()
LIMIT 10;

-- Случайные товары по категории
SELECT * FROM products
WHERE category_id = (SELECT id FROM categories WHERE slug = 'electronics')
  AND in_stock = true
ORDER BY RANDOM()
LIMIT 5;

-- 10. ПОХОЖИЕ ТОВАРЫ
-- ===============================================

-- Найти похожие товары (та же категория, близкая цена)
WITH target_product AS (
  SELECT * FROM products WHERE id = 'prod-0001'
)
SELECT
  p.id,
  p.name,
  p.price,
  ABS(p.price - tp.price) as price_diff
FROM products p, target_product tp
WHERE
  p.category_id = tp.category_id
  AND p.id != tp.id
  AND p.in_stock = true
ORDER BY price_diff ASC
LIMIT 5;

-- 11. ЭКСПОРТ ДАННЫХ
-- ===============================================

-- Экспорт товаров в CSV формат
COPY (
  SELECT
    p.name,
    p.price,
    p.moq,
    c.name as category,
    s.name as supplier,
    p.in_stock
  FROM products p
  JOIN categories c ON c.id = p.category_id
  JOIN suppliers s ON s.id = p.supplier_id
) TO '/tmp/products_export.csv' WITH CSV HEADER;

-- 12. ОБСЛУЖИВАНИЕ
-- ===============================================

-- Обновить счетчики товаров в категориях
UPDATE categories c
SET product_count = (
  SELECT COUNT(*) FROM products p WHERE p.category_id = c.id
);

-- Найти товары без изображений
SELECT id, name, images
FROM products
WHERE images IS NULL OR array_length(images, 1) = 0;

-- Найти товары без поставщика
SELECT id, name
FROM products
WHERE supplier_id IS NULL;

-- 13. ПРОИЗВОДИТЕЛЬНОСТЬ
-- ===============================================

-- Проверить использование индексов
EXPLAIN ANALYZE
SELECT * FROM products
WHERE name ILIKE '%смартфон%'
  AND in_stock = true;

-- Статистика размера таблиц
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename IN ('products', 'categories', 'suppliers')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
