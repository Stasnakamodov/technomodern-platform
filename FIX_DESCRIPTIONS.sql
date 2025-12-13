-- ===========================================
-- SQL СКРИПТЫ ДЛЯ ИСПРАВЛЕНИЯ ОПИСАНИЙ ТОВАРОВ
-- Дата генерации: 2025-12-12
-- ===========================================

-- 1. УДАЛЕНИЕ УПОМИНАНИЙ TAOBAO И ПРОДАВЦОВ
-- Паттерны для удаления:
-- - "Товар с Taobao. Продавец: [имя]"
-- - "Промышленный товар с Taobao. Продавец: [имя]"
-- - "Импортировано с Taobao через OTAPI"
-- - "Industrial tool from Taobao"

UPDATE products
SET description = TRIM(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(description,
              E'\\s*Товар с Taobao\\.\\s*Продавец:[^.]*\\.?\\s*', '', 'gi'),
            E'\\s*Промышленный товар с Taobao\\.\\s*Продавец:[^.]*\\.?\\s*', '', 'gi'),
          E'\\s*Импортировано с Taobao через OTAPI\\.?\\s*', '', 'gi'),
        E'\\s*Импортировано с Taobao\\.?\\s*', '', 'gi'),
      E'\\s*Industrial tool from Taobao\\.?\\s*', '', 'gi'),
    E'\\s*Товар с Alibaba\\.\\s*Продавец:[^.]*\\.?\\s*', '', 'gi')
)
WHERE description ILIKE '%taobao%'
   OR description ILIKE '%otapi%'
   OR description ILIKE '%продавец:%'
   OR description ILIKE '%alibaba%'
   OR description ILIKE '%industrial tool%';

-- Проверка результата
-- SELECT COUNT(*) FROM products WHERE description ILIKE '%taobao%';


-- 2. ВЫЯВЛЕНИЕ ШАБЛОННЫХ ОПИСАНИЙ (для ручной замены)
-- Эти товары нужно переписать вручную!

SELECT id, name, description, category_id
FROM products
WHERE description LIKE 'Качественный товар из категории%'
   OR description LIKE 'Профессиональный товар из категории%'
   OR description LIKE 'Качественные автотовары%';


-- 3. ВЫЯВЛЕНИЕ КОРОТКИХ ОПИСАНИЙ (менее 50 символов)

SELECT id, name, description, LENGTH(description) as len
FROM products
WHERE description IS NOT NULL
  AND LENGTH(description) < 50
ORDER BY len;


-- 4. ВЫЯВЛЕНИЕ ОПИСАНИЙ С ПОВТОРЯЮЩИМИСЯ СЛОВАМИ
-- (машинный перевод)

SELECT id, name, description
FROM products
WHERE description ~ E'(\\b\\w{4,}\\b)\\s+\\1\\s+\\1';


-- 5. ВЫЯВЛЕНИЕ ОПИСАНИЙ НА АНГЛИЙСКОМ

SELECT id, name, description
FROM products
WHERE description ~ E'^[A-Za-z0-9\\s\\-\\.,:;!?()\\[\\]]+$'
  AND LENGTH(description) > 20;


-- 6. ПУСТЫЕ ОПИСАНИЯ

SELECT id, name
FROM products
WHERE description IS NULL OR description = '';


-- 7. ПРОВЕРКА НЕСООТВЕТСТВИЯ КАТЕГОРИЙ
-- Товары с описанием "автотовары" но не в категории автотоваров

SELECT p.id, p.name, p.description, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.description ILIKE '%автотовар%'
  AND c.name NOT ILIKE '%авто%';


-- ===========================================
-- ПОСЛЕ ИСПРАВЛЕНИЙ - ПРОВЕРОЧНЫЕ ЗАПРОСЫ
-- ===========================================

-- Сколько осталось с Taobao?
-- SELECT COUNT(*) FROM products WHERE description ILIKE '%taobao%';

-- Сколько шаблонных?
-- SELECT COUNT(*) FROM products WHERE description LIKE 'Качественный товар%';

-- Сколько коротких?
-- SELECT COUNT(*) FROM products WHERE LENGTH(description) < 50;
