-- =====================================================
-- Миграция: Перераспределение товаров с ROOT категорий на подкатегории
-- Дата: 2025-12-08
-- Описание: Переносит товары с корневых категорий на соответствующие подкатегории
-- =====================================================

-- 1. Создаём подкатегорию для "Здоровье и медицина" (у неё нет подкатегорий)
INSERT INTO categories (id, name, slug, level, parent_id, display_order, product_count, created_at)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Медицинские приборы',
  'medicinskie-pribory',
  2,
  '3bb8c250-855e-4afa-9caa-7201262ddc22', -- Здоровье и медицина
  0,
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. СТРОИТЕЛЬСТВО → Электрика
-- Товары: розетки, кабели, адаптеры, удлинители, светильники
-- =====================================================
UPDATE products
SET category_id = 'b06d205d-3f25-4c61-8037-fcf706aa70f9' -- Электрика
WHERE category_id = '00000067-0000-0000-0000-000000670000' -- Строительство (ROOT)
  AND (
    LOWER(name) LIKE '%socket%' OR
    LOWER(name) LIKE '%plug%' OR
    LOWER(name) LIKE '%розетк%' OR
    LOWER(name) LIKE '%кабель%' OR
    LOWER(name) LIKE '%cable%' OR
    LOWER(name) LIKE '%usb%' OR
    LOWER(name) LIKE '%адаптер%' OR
    LOWER(name) LIKE '%adapter%' OR
    LOWER(name) LIKE '%зарядк%' OR
    LOWER(name) LIKE '%удлинитель%' OR
    LOWER(name) LIKE '%extension%' OR
    LOWER(name) LIKE '%power strip%' OR
    LOWER(name) LIKE '%surge protector%' OR
    LOWER(name) LIKE '%мощность%'
  );

-- Светильники → Освещение (подкатегория "Дом и быт", но более логично)
UPDATE products
SET category_id = '3f7e26a0-69f3-4e58-8ef0-b99e1bf2c3e1' -- Освещение
WHERE category_id = '00000067-0000-0000-0000-000000670000' -- Строительство (ROOT)
  AND (
    LOWER(name) LIKE '%светильник%' OR
    LOWER(name) LIKE '%лампа%' OR
    LOWER(name) LIKE '%lamp%' OR
    LOWER(name) LIKE '%led%' OR
    LOWER(name) LIKE '%светодиод%' OR
    LOWER(name) LIKE '%light%'
  );

-- =====================================================
-- 3. ЗДОРОВЬЕ И КРАСОТА → Уход за кожей
-- Товары: кремы, сыворотки, маски, увлажняющие средства
-- =====================================================
UPDATE products
SET category_id = 'c90531a8-0a92-4ece-98a1-1e97489c063f' -- Уход за кожей
WHERE category_id = '93d696c4-2f81-4de8-9184-3d492fe9bfa4' -- Здоровье и красота (ROOT)
  AND (
    LOWER(name) LIKE '%крем%' OR
    LOWER(name) LIKE '%cream%' OR
    LOWER(name) LIKE '%сыворотк%' OR
    LOWER(name) LIKE '%serum%' OR
    LOWER(name) LIKE '%маск%' OR
    LOWER(name) LIKE '%mask%' OR
    LOWER(name) LIKE '%увлажн%' OR
    LOWER(name) LIKE '%moistur%' OR
    LOWER(name) LIKE '%уход за кож%' OR
    LOWER(name) LIKE '%skin care%' OR
    LOWER(name) LIKE '%тонер%' OR
    LOWER(name) LIKE '%toner%' OR
    LOWER(name) LIKE '%лицо%' OR
    LOWER(name) LIKE '%face%' OR
    LOWER(name) LIKE '%facial%' OR
    LOWER(name) LIKE '%отбеливающ%' OR
    LOWER(name) LIKE '%whitening%' OR
    LOWER(name) LIKE '%sunscreen%' OR
    LOWER(name) LIKE '%солнцезащитн%'
  );

-- Косметика
UPDATE products
SET category_id = 'd9426962-6ca6-4187-99dd-0bd0ca88651e' -- Косметика
WHERE category_id = '93d696c4-2f81-4de8-9184-3d492fe9bfa4' -- Здоровье и красота (ROOT)
  AND (
    LOWER(name) LIKE '%помада%' OR
    LOWER(name) LIKE '%lip%' OR
    LOWER(name) LIKE '%gloss%' OR
    LOWER(name) LIKE '%bb cream%'
  );

-- =====================================================
-- 4. ДОМ И БЫТ → Текстиль/Спальня
-- Товары: постельное бельё, подушки, одеяла, матрасы
-- =====================================================
-- Спальня (подушки, матрасы)
UPDATE products
SET category_id = '321e45c7-a9ad-4ec8-b900-74fbe75afcd0' -- Спальня
WHERE category_id = '00000069-0000-0000-0000-000000690000' -- Дом и быт (ROOT)
  AND (
    LOWER(name) LIKE '%подушк%' OR
    LOWER(name) LIKE '%pillow%' OR
    LOWER(name) LIKE '%матрас%' OR
    LOWER(name) LIKE '%mattress%' OR
    LOWER(name) LIKE '%topper%' OR
    LOWER(name) LIKE '%пена памяти%' OR
    LOWER(name) LIKE '%memory foam%'
  );

-- Текстиль (постельное бельё, одеяла, простыни)
UPDATE products
SET category_id = '7e24f43c-bbf7-4827-9251-8ddde961ce65' -- Текстиль
WHERE category_id = '00000069-0000-0000-0000-000000690000' -- Дом и быт (ROOT)
  AND (
    LOWER(name) LIKE '%постельн%' OR
    LOWER(name) LIKE '%bedding%' OR
    LOWER(name) LIKE '%одеял%' OR
    LOWER(name) LIKE '%blanket%' OR
    LOWER(name) LIKE '%простын%' OR
    LOWER(name) LIKE '%sheet%' OR
    LOWER(name) LIKE '%наволочк%' OR
    LOWER(name) LIKE '%pillowcase%' OR
    LOWER(name) LIKE '%покрыва%' OR
    LOWER(name) LIKE '%cover%' OR
    LOWER(name) LIKE '%флис%' OR
    LOWER(name) LIKE '%fleece%' OR
    LOWER(name) LIKE '%фланел%' OR
    LOWER(name) LIKE '%свитер%' OR
    LOWER(name) LIKE '%sweater%'
  );

-- =====================================================
-- 5. АВТОТОВАРЫ → Автохимия
-- Товары: воск, полировка, покрытия, уход за авто
-- =====================================================
UPDATE products
SET category_id = '1f2645f7-6bc1-4df1-97df-959c3f23cacb' -- Автохимия
WHERE category_id = 'e18eb782-6fca-414a-b221-dadc694461b1' -- Автотовары (ROOT)
  AND (
    LOWER(name) LIKE '%воск%' OR
    LOWER(name) LIKE '%wax%' OR
    LOWER(name) LIKE '%полиров%' OR
    LOWER(name) LIKE '%polish%' OR
    LOWER(name) LIKE '%покрыти%' OR
    LOWER(name) LIKE '%coating%' OR
    LOWER(name) LIKE '%уход за авто%' OR
    LOWER(name) LIKE '%car care%' OR
    LOWER(name) LIKE '%керамическ%' OR
    LOWER(name) LIKE '%ceramic%' OR
    LOWER(name) LIKE '%мойк%' OR
    LOWER(name) LIKE '%wash%' OR
    LOWER(name) LIKE '%очистител%' OR
    LOWER(name) LIKE '%clean%' OR
    LOWER(name) LIKE '%спрей%' OR
    LOWER(name) LIKE '%spray%' OR
    LOWER(name) LIKE '%губка%' OR
    LOWER(name) LIKE '%sponge%' OR
    LOWER(name) LIKE '%полотенц%' OR
    LOWER(name) LIKE '%towel%' OR
    LOWER(name) LIKE '%микрофибр%' OR
    LOWER(name) LIKE '%microfiber%'
  );

-- Автозапчасти
UPDATE products
SET category_id = 'b045d61a-56a4-4c75-9e11-a2d600df97f1' -- Автозапчасти
WHERE category_id = 'e18eb782-6fca-414a-b221-dadc694461b1' -- Автотовары (ROOT)
  AND (
    LOWER(name) LIKE '%насос%' OR
    LOWER(name) LIKE '%pump%' OR
    LOWER(name) LIKE '%датчик%' OR
    LOWER(name) LIKE '%sensor%' OR
    LOWER(name) LIKE '%масл%' OR
    LOWER(name) LIKE '%oil%' OR
    LOWER(name) LIKE '%охладител%' OR
    LOWER(name) LIKE '%cooler%' OR
    LOWER(name) LIKE '%фар%' OR
    LOWER(name) LIKE '%light%' OR
    LOWER(name) LIKE '%headlight%' OR
    LOWER(name) LIKE '%ремонт%' OR
    LOWER(name) LIKE '%repair%'
  );

-- Шины и диски
UPDATE products
SET category_id = '6b178b91-cb95-4ec2-b76b-dab5861bf250' -- Шины и диски
WHERE category_id = 'e18eb782-6fca-414a-b221-dadc694461b1' -- Автотовары (ROOT)
  AND (
    LOWER(name) LIKE '%шин%' OR
    LOWER(name) LIKE '%tire%' OR
    LOWER(name) LIKE '%tyre%' OR
    LOWER(name) LIKE '%резин%' OR
    LOWER(name) LIKE '%rubber%'
  );

-- =====================================================
-- 6. ПРОМЫШЛЕННОСТЬ → Станки и оборудование
-- Товары: дрели, шлифовальные машины, токарные станки
-- =====================================================
UPDATE products
SET category_id = 'ecca7d11-cc0d-441d-83eb-c8318c48feb3' -- Станки и оборудование
WHERE category_id = '3341641d-2067-47ea-9591-95994efad1ef' -- Промышленность (ROOT)
  AND (
    LOWER(name) LIKE '%дрель%' OR
    LOWER(name) LIKE '%drill%' OR
    LOWER(name) LIKE '%шлифовал%' OR
    LOWER(name) LIKE '%grind%' OR
    LOWER(name) LIKE '%токарн%' OR
    LOWER(name) LIKE '%lathe%' OR
    LOWER(name) LIKE '%станок%' OR
    LOWER(name) LIKE '%machine%' OR
    LOWER(name) LIKE '%отвертк%' OR
    LOWER(name) LIKE '%screwdriver%' OR
    LOWER(name) LIKE '%фрез%' OR
    LOWER(name) LIKE '%mill%' OR
    LOWER(name) LIKE '%диск%' OR
    LOWER(name) LIKE '%disc%' OR
    LOWER(name) LIKE '%disk%' OR
    LOWER(name) LIKE '%пил%' OR
    LOWER(name) LIKE '%saw%' OR
    LOWER(name) LIKE '%резк%' OR
    LOWER(name) LIKE '%cut%' OR
    LOWER(name) LIKE '%сверл%' OR
    LOWER(name) LIKE '%bit%' OR
    LOWER(name) LIKE '%сварочн%' OR
    LOWER(name) LIKE '%weld%' OR
    LOWER(name) LIKE '%инструмент%' OR
    LOWER(name) LIKE '%tool%' OR
    LOWER(name) LIKE '%ремень%' OR
    LOWER(name) LIKE '%belt%' OR
    LOWER(name) LIKE '%электрическ%' OR
    LOWER(name) LIKE '%electric%' OR
    LOWER(name) LIKE '%питани%' OR
    LOWER(name) LIKE '%power%'
  );

-- =====================================================
-- 7. ЗДОРОВЬЕ И МЕДИЦИНА → Медицинские приборы
-- Товары: тонометры, термометры, умные часы с медицинскими функциями
-- =====================================================
UPDATE products
SET category_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' -- Медицинские приборы
WHERE category_id = '3bb8c250-855e-4afa-9caa-7201262ddc22'; -- Здоровье и медицина (ROOT)

-- =====================================================
-- 8. ТОВАРЫ С NULL CATEGORY_ID
-- Переносим в общую категорию "Хозяйственные товары"
-- =====================================================
UPDATE products
SET category_id = '4e53a812-6edb-482f-8ea1-b9150215c169' -- Хозяйственные товары
WHERE category_id IS NULL;

-- =====================================================
-- 9. ПЕРЕСЧЁТ СЧЁТЧИКОВ PRODUCT_COUNT
-- =====================================================

-- Обнуляем все счётчики
UPDATE categories SET product_count = 0;

-- Пересчитываем для каждой категории
UPDATE categories c
SET product_count = (
  SELECT COUNT(*)
  FROM products p
  WHERE p.category_id = c.id
);

-- =====================================================
-- ПРОВЕРКА: товары на ROOT категориях после миграции
-- =====================================================
-- SELECT c.name, COUNT(p.id) as products_count
-- FROM categories c
-- LEFT JOIN products p ON p.category_id = c.id
-- WHERE c.parent_id IS NULL
-- GROUP BY c.id, c.name
-- ORDER BY products_count DESC;
