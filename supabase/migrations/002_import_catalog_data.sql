-- ТехноМодерн Каталог - Импорт данных
-- Сгенерировано: 2025-11-15T17:05:49.115Z
-- Товаров: 455

-- Очистка старых данных (опционально, раскомментируйте если нужно)
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE suppliers CASCADE;
-- TRUNCATE TABLE categories CASCADE;

-- ====================
-- 1. ПОСТАВЩИКИ
-- ====================

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Guangzhou Tech Co.',
  'Китай',
  NULL,
  true,
  4.8,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000001-0000-0000-0000-000000010000',
  'Shenzhen Electronics Ltd',
  'Китай',
  NULL,
  true,
  4.7,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000002-0000-0000-0000-000000020000',
  'Yiwu Trading Group',
  'Китай',
  NULL,
  true,
  4.6,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000003-0000-0000-0000-000000030000',
  'Hangzhou Fashion',
  'Китай',
  NULL,
  true,
  4.5,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000004-0000-0000-0000-000000040000',
  'Beijing Auto Parts',
  'Китай',
  NULL,
  true,
  4.9,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000005-0000-0000-0000-000000050000',
  'Shanghai Home Goods',
  'Китай',
  NULL,
  true,
  4.7,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000006-0000-0000-0000-000000060000',
  'Ningbo Manufacturing',
  'Китай',
  NULL,
  true,
  4.6,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '00000007-0000-0000-0000-000000070000',
  'Dongguan Industrial',
  'Китай',
  NULL,
  true,
  4.8,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ====================
-- 2. КАТЕГОРИИ
-- ====================

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000064-0000-0000-0000-000000640000',
  'Электроника',
  'electronics',
  '💻',
  1,
  NULL,
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000c8-0000-0000-0000-000000c80000',
  'Смартфоны',
  'smartfony',
  2,
  '00000064-0000-0000-0000-000000640000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000c9-0000-0000-0000-000000c90000',
  'Ноутбуки',
  'noutbuki',
  2,
  '00000064-0000-0000-0000-000000640000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000ca-0000-0000-0000-000000ca0000',
  'Наушники',
  'naushniki',
  2,
  '00000064-0000-0000-0000-000000640000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000cb-0000-0000-0000-000000cb0000',
  'Планшеты',
  'planshety',
  2,
  '00000064-0000-0000-0000-000000640000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000cc-0000-0000-0000-000000cc0000',
  'Умные часы',
  'umnye-chasy',
  2,
  '00000064-0000-0000-0000-000000640000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000cd-0000-0000-0000-000000cd0000',
  'Телевизоры',
  'televizory',
  2,
  '00000064-0000-0000-0000-000000640000',
  5,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000000ce-0000-0000-0000-000000ce0000',
  'Камеры',
  'kamery',
  2,
  '00000064-0000-0000-0000-000000640000',
  6,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000065-0000-0000-0000-000000650000',
  'Одежда',
  'clothing',
  '👕',
  1,
  NULL,
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000012c-0000-0000-0000-0000012c0000',
  'Верхняя одежда',
  'verhnyaya-odezhda',
  2,
  '00000065-0000-0000-0000-000000650000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000012d-0000-0000-0000-0000012d0000',
  'Обувь',
  'obuv',
  2,
  '00000065-0000-0000-0000-000000650000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000012e-0000-0000-0000-0000012e0000',
  'Джинсы',
  'dzhinsy',
  2,
  '00000065-0000-0000-0000-000000650000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000012f-0000-0000-0000-0000012f0000',
  'Футболки',
  'futbolki',
  2,
  '00000065-0000-0000-0000-000000650000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000130-0000-0000-0000-000001300000',
  'Толстовки',
  'tolstovki',
  2,
  '00000065-0000-0000-0000-000000650000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000131-0000-0000-0000-000001310000',
  'Платья',
  'plat-ya',
  2,
  '00000065-0000-0000-0000-000000650000',
  5,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000132-0000-0000-0000-000001320000',
  'Костюмы',
  'kostyumy',
  2,
  '00000065-0000-0000-0000-000000650000',
  6,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000066-0000-0000-0000-000000660000',
  'Мебель',
  'furniture',
  '🪑',
  1,
  NULL,
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000190-0000-0000-0000-000001900000',
  'Офисная мебель',
  'ofisnaya-mebel',
  2,
  '00000066-0000-0000-0000-000000660000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000191-0000-0000-0000-000001910000',
  'Мягкая мебель',
  'myagkaya-mebel',
  2,
  '00000066-0000-0000-0000-000000660000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000192-0000-0000-0000-000001920000',
  'Спальня',
  'spal-nya',
  2,
  '00000066-0000-0000-0000-000000660000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000193-0000-0000-0000-000001930000',
  'Шкафы',
  'shkafy',
  2,
  '00000066-0000-0000-0000-000000660000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000194-0000-0000-0000-000001940000',
  'Столы',
  'stoly',
  2,
  '00000066-0000-0000-0000-000000660000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000195-0000-0000-0000-000001950000',
  'Стулья',
  'stul-ya',
  2,
  '00000066-0000-0000-0000-000000660000',
  5,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000067-0000-0000-0000-000000670000',
  'Строительство',
  'construction',
  '🔨',
  1,
  NULL,
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000001f4-0000-0000-0000-000001f40000',
  'Электроинструменты',
  'elektroinstrumenty',
  2,
  '00000067-0000-0000-0000-000000670000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000001f5-0000-0000-0000-000001f50000',
  'Освещение',
  'osveschenie',
  2,
  '00000067-0000-0000-0000-000000670000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000001f6-0000-0000-0000-000001f60000',
  'Умный дом',
  'umnyy-dom',
  2,
  '00000067-0000-0000-0000-000000670000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000001f7-0000-0000-0000-000001f70000',
  'Отделочные материалы',
  'otdelochnye-materialy',
  2,
  '00000067-0000-0000-0000-000000670000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000001f8-0000-0000-0000-000001f80000',
  'Сантехника',
  'santehnika',
  2,
  '00000067-0000-0000-0000-000000670000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000068-0000-0000-0000-000000680000',
  'Автотовары',
  'auto',
  '🚗',
  1,
  NULL,
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000258-0000-0000-0000-000002580000',
  'Автомасла',
  'avtomasla',
  2,
  '00000068-0000-0000-0000-000000680000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000259-0000-0000-0000-000002590000',
  'Тормозная система',
  'tormoznaya-sistema',
  2,
  '00000068-0000-0000-0000-000000680000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000025a-0000-0000-0000-0000025a0000',
  'Фильтры',
  'fil-try',
  2,
  '00000068-0000-0000-0000-000000680000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000025b-0000-0000-0000-0000025b0000',
  'Автоэлектроника',
  'avtoelektronika',
  2,
  '00000068-0000-0000-0000-000000680000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '0000025c-0000-0000-0000-0000025c0000',
  'Аксессуары',
  'aksessuary',
  2,
  '00000068-0000-0000-0000-000000680000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '00000069-0000-0000-0000-000000690000',
  'Дом и сад',
  'home',
  '🏠',
  1,
  NULL,
  5,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000002bc-0000-0000-0000-000002bc0000',
  'Посуда',
  'posuda',
  2,
  '00000069-0000-0000-0000-000000690000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000002bd-0000-0000-0000-000002bd0000',
  'Текстиль',
  'tekstil',
  2,
  '00000069-0000-0000-0000-000000690000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000002be-0000-0000-0000-000002be0000',
  'Декор',
  'dekor',
  2,
  '00000069-0000-0000-0000-000000690000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000002bf-0000-0000-0000-000002bf0000',
  'Садовый инвентарь',
  'sadovyy-inventar',
  2,
  '00000069-0000-0000-0000-000000690000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '000002c0-0000-0000-0000-000002c00000',
  'Бытовая техника',
  'bytovaya-tehnika',
  2,
  '00000069-0000-0000-0000-000000690000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '0000006a-0000-0000-0000-0000006a0000',
  'Спорт и отдых',
  'sports',
  '⚽',
  1,
  NULL,
  6,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000320-0000-0000-0000-000003200000',
  'Фитнес',
  'fitnes',
  2,
  '0000006a-0000-0000-0000-0000006a0000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000321-0000-0000-0000-000003210000',
  'Велосипеды',
  'velosipedy',
  2,
  '0000006a-0000-0000-0000-0000006a0000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000322-0000-0000-0000-000003220000',
  'Туризм',
  'turizm',
  2,
  '0000006a-0000-0000-0000-0000006a0000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000323-0000-0000-0000-000003230000',
  'Спортивная одежда',
  'sportivnaya-odezhda',
  2,
  '0000006a-0000-0000-0000-0000006a0000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000324-0000-0000-0000-000003240000',
  'Тренажеры',
  'trenazhery',
  2,
  '0000006a-0000-0000-0000-0000006a0000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '0000006b-0000-0000-0000-0000006b0000',
  'Красота и здоровье',
  'beauty',
  '💄',
  1,
  NULL,
  7,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000384-0000-0000-0000-000003840000',
  'Косметика',
  'kosmetika',
  2,
  '0000006b-0000-0000-0000-0000006b0000',
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000385-0000-0000-0000-000003850000',
  'Уход за кожей',
  'uhod-za-kozhey',
  2,
  '0000006b-0000-0000-0000-0000006b0000',
  1,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000386-0000-0000-0000-000003860000',
  'Парфюмерия',
  'parfyumeriya',
  2,
  '0000006b-0000-0000-0000-0000006b0000',
  2,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000387-0000-0000-0000-000003870000',
  'Массажеры',
  'massazhery',
  2,
  '0000006b-0000-0000-0000-0000006b0000',
  3,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '00000388-0000-0000-0000-000003880000',
  'Витамины',
  'vitaminy',
  2,
  '0000006b-0000-0000-0000-0000006b0000',
  4,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ====================
-- 3. ТОВАРЫ
-- ====================

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0001',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Pro',
  'Смартфон POCO Pro - популярная модель с высоким рейтингом на китайских маркетплейсах. 8GB RAM. Быстрая доставка.',
  'prod-0001',
  80376,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000001?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0002',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo Edge',
  'Оригинальный смартфон vivo edge с гарантией качества. 128GB. Проверено тысячами покупателей.',
  'prod-0002',
  93319,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000002?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0003',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi Edge',
  'Смартфон Xiaomi Edge - популярная модель с высоким рейтингом на китайских маркетплейсах. 120Hz. Быстрая доставка.',
  'prod-0003',
  103679,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000003?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0004',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo 91',
  'Топовый смартфон vivo 91 по доступной цене. 256GB. Прямые поставки с завода.',
  'prod-0004',
  117437,
  'RUB',
  3,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000004?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0005',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats Air',
  'Качественный наушники soundpeats air от проверенного китайского производителя. С микрофоном. Отличное соотношение цены и качества.',
  'prod-0005',
  8963,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000005?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0006',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo 93S',
  'Смартфон Vivo 93S - популярная модель с высоким рейтингом на китайских маркетплейсах. 5G. Быстрая доставка.',
  'prod-0006',
  98757,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000006?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0007',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук HP 31X',
  'Топовый ноутбук hp 31x по доступной цене. Intel i5. Прямые поставки с завода.',
  'prod-0007',
  400929,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000007?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0008',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук Acer Lite',
  'Топовый ноутбук acer lite по доступной цене. Intel i7. Прямые поставки с завода.',
  'prod-0008',
  260327,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000008?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0009',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук Acer 91X',
  'Оригинальный ноутбук acer 91x с гарантией качества. AMD Ryzen. Проверено тысячами покупателей.',
  'prod-0009',
  382648,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000009?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0010',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Pro',
  'Оригинальный смартфон poco pro с гарантией качества. 256GB. Проверено тысячами покупателей.',
  'prod-0010',
  96499,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000010?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0011',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук HP 66T',
  'Оригинальный ноутбук hp 66t с гарантией качества. SSD 512GB. Проверено тысячами покупателей.',
  'prod-0011',
  234225,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000011?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0012',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OPPO Ultra',
  'Топовый смартфон oppo ultra по доступной цене. 8GB RAM. Прямые поставки с завода.',
  'prod-0012',
  69748,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000012?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0013',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Realme Max',
  'Топовый смартфон realme max по доступной цене. 256GB. Прямые поставки с завода.',
  'prod-0013',
  116158,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000013?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0014',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Baseus Ultra',
  'Оригинальный наушники baseus ultra с гарантией качества. Bluetooth 5.3. Проверено тысячами покупателей.',
  'prod-0014',
  11002,
  'RUB',
  41,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000014?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0015',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 43T',
  'Качественный наушники soundpeats 43t от проверенного китайского производителя. TWS. Отличное соотношение цены и качества.',
  'prod-0015',
  4798,
  'RUB',
  30,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000015?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0016',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Realme Ultra',
  'Качественный смартфон realme ultra от проверенного китайского производителя. 128GB. Отличное соотношение цены и качества.',
  'prod-0016',
  107860,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000016?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0017',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO 11T',
  'Качественный смартфон poco 11t от проверенного китайского производителя. 8GB RAM. Отличное соотношение цены и качества.',
  'prod-0017',
  115610,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000017?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0018',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 81',
  'Оригинальный наушники soundpeats 81 с гарантией качества. Беспроводные. Проверено тысячами покупателей.',
  'prod-0018',
  6679,
  'RUB',
  48,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000018?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0019',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 27T',
  'Наушники Soundpeats 27T - популярная модель с высоким рейтингом на китайских маркетплейсах. TWS. Быстрая доставка.',
  'prod-0019',
  4035,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000019?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0020',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats Air',
  'Наушники Soundpeats Air - популярная модель с высоким рейтингом на китайских маркетплейсах. Беспроводные. Быстрая доставка.',
  'prod-0020',
  14676,
  'RUB',
  22,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000020?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0021',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats Pro',
  'Оригинальный наушники soundpeats pro с гарантией качества. Bluetooth 5.3. Проверено тысячами покупателей.',
  'prod-0021',
  17396,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000021?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0022',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Pro',
  'Топовый смартфон oneplus pro по доступной цене. 8GB RAM. Прямые поставки с завода.',
  'prod-0022',
  126830,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000022?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0023',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Plus',
  'Оригинальный смартфон poco plus с гарантией качества. AMOLED. Проверено тысячами покупателей.',
  'prod-0023',
  81982,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000023?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0024',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Plus',
  'Топовый смартфон oneplus plus по доступной цене. 120Hz. Прямые поставки с завода.',
  'prod-0024',
  77445,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000024?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0025',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus 89',
  'Топовый смартфон oneplus 89 по доступной цене. AMOLED. Прямые поставки с завода.',
  'prod-0025',
  69375,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000025?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0026',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Max',
  'Оригинальный смартфон oneplus max с гарантией качества. 5G. Проверено тысячами покупателей.',
  'prod-0026',
  115461,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000026?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0027',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus 83T',
  'Оригинальный смартфон oneplus 83t с гарантией качества. 8GB RAM. Проверено тысячами покупателей.',
  'prod-0027',
  129399,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000027?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0028',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Edge',
  'Смартфон OnePlus Edge - популярная модель с высоким рейтингом на китайских маркетплейсах. AMOLED. Быстрая доставка.',
  'prod-0028',
  94153,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000028?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0029',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi Lite',
  'Качественный смартфон xiaomi lite от проверенного китайского производителя. 128GB. Отличное соотношение цены и качества.',
  'prod-0029',
  107326,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000029?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0030',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники QCY 35',
  'Качественный наушники qcy 35 от проверенного китайского производителя. ANC. Отличное соотношение цены и качества.',
  'prod-0030',
  13752,
  'RUB',
  34,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000030?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0031',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi Max',
  'Качественный смартфон xiaomi max от проверенного китайского производителя. AMOLED. Отличное соотношение цены и качества.',
  'prod-0031',
  83564,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000031?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0032',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo 88T',
  'Топовый смартфон vivo 88t по доступной цене. 5G. Прямые поставки с завода.',
  'prod-0032',
  113952,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000032?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0033',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук ASUS 54X',
  'Ноутбук ASUS 54X - популярная модель с высоким рейтингом на китайских маркетплейсах. SSD 512GB. Быстрая доставка.',
  'prod-0033',
  211470,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000033?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0034',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OPPO Air',
  'Топовый смартфон oppo air по доступной цене. 256GB. Прямые поставки с завода.',
  'prod-0034',
  72131,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000034?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0035',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук Acer Ultra',
  'Качественный ноутбук acer ultra от проверенного китайского производителя. Full HD. Отличное соотношение цены и качества.',
  'prod-0035',
  318802,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000035?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0036',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Lite',
  'Смартфон POCO Lite - популярная модель с высоким рейтингом на китайских маркетплейсах. 256GB. Быстрая доставка.',
  'prod-0036',
  87750,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000036?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0037',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук MSI 79S',
  'Топовый ноутбук msi 79s по доступной цене. Intel i7. Прямые поставки с завода.',
  'prod-0037',
  391747,
  'RUB',
  3,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000037?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0038',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Edifier Plus',
  'Оригинальный наушники edifier plus с гарантией качества. С микрофоном. Проверено тысячами покупателей.',
  'prod-0038',
  14221,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000038?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0039',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi Edge',
  'Смартфон Xiaomi Edge - популярная модель с высоким рейтингом на китайских маркетплейсах. 128GB. Быстрая доставка.',
  'prod-0039',
  112109,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000039?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0040',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники QCY Ultra',
  'Топовый наушники qcy ultra по доступной цене. Bluetooth 5.3. Прямые поставки с завода.',
  'prod-0040',
  13614,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000040?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0041',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Lite',
  'Оригинальный смартфон oneplus lite с гарантией качества. 8GB RAM. Проверено тысячами покупателей.',
  'prod-0041',
  84081,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000041?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0042',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Baseus 10',
  'Качественный наушники baseus 10 от проверенного китайского производителя. TWS. Отличное соотношение цены и качества.',
  'prod-0042',
  3182,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000042?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0043',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Baseus Lite',
  'Качественный наушники baseus lite от проверенного китайского производителя. ANC. Отличное соотношение цены и качества.',
  'prod-0043',
  10111,
  'RUB',
  30,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000043?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0044',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 25',
  'Наушники Soundpeats 25 - популярная модель с высоким рейтингом на китайских маркетплейсах. Беспроводные. Быстрая доставка.',
  'prod-0044',
  14175,
  'RUB',
  10,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000044?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0045',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук HP 25',
  'Оригинальный ноутбук hp 25 с гарантией качества. 16GB RAM. Проверено тысячами покупателей.',
  'prod-0045',
  330898,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000045?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0046',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Baseus Max',
  'Наушники Baseus Max - популярная модель с высоким рейтингом на китайских маркетплейсах. TWS. Быстрая доставка.',
  'prod-0046',
  5434,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000046?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0047',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Haylou Air',
  'Топовый наушники haylou air по доступной цене. Bluetooth 5.3. Прямые поставки с завода.',
  'prod-0047',
  15994,
  'RUB',
  41,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000047?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0048',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники QCY 60S',
  'Наушники QCY 60S - популярная модель с высоким рейтингом на китайских маркетплейсах. TWS. Быстрая доставка.',
  'prod-0048',
  17078,
  'RUB',
  30,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000048?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0049',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Edifier Lite',
  'Наушники Edifier Lite - популярная модель с высоким рейтингом на китайских маркетплейсах. Bluetooth 5.3. Быстрая доставка.',
  'prod-0049',
  4923,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000049?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0050',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук ASUS Plus',
  'Качественный ноутбук asus plus от проверенного китайского производителя. SSD 512GB. Отличное соотношение цены и качества.',
  'prod-0050',
  320905,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000050?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 50/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0051',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus Ultra',
  'Оригинальный смартфон oneplus ultra с гарантией качества. AMOLED. Проверено тысячами покупателей.',
  'prod-0051',
  117456,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000051?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0052',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 85S',
  'Наушники Soundpeats 85S - популярная модель с высоким рейтингом на китайских маркетплейсах. Беспроводные. Быстрая доставка.',
  'prod-0052',
  12012,
  'RUB',
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000052?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0053',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук Acer 12S',
  'Качественный ноутбук acer 12s от проверенного китайского производителя. Intel i5. Отличное соотношение цены и качества.',
  'prod-0053',
  248469,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000053?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0054',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук MSI 10T',
  'Ноутбук MSI 10T - популярная модель с высоким рейтингом на китайских маркетплейсах. Full HD. Быстрая доставка.',
  'prod-0054',
  245475,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000054?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0055',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Max',
  'Топовый смартфон poco max по доступной цене. 8GB RAM. Прямые поставки с завода.',
  'prod-0055',
  114468,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000055?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0056',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Edifier Edge',
  'Оригинальный наушники edifier edge с гарантией качества. TWS. Проверено тысячами покупателей.',
  'prod-0056',
  14977,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000056?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0057',
  '00000000-0000-0000-0000-000000000000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 83',
  'Оригинальный наушники soundpeats 83 с гарантией качества. С микрофоном. Проверено тысячами покупателей.',
  'prod-0057',
  15879,
  'RUB',
  17,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000057?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0058',
  '00000006-0000-0000-0000-000000060000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Baseus 78X',
  'Наушники Baseus 78X - популярная модель с высоким рейтингом на китайских маркетплейсах. С микрофоном. Быстрая доставка.',
  'prod-0058',
  10920,
  'RUB',
  16,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000058?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0059',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук MSI Edge',
  'Качественный ноутбук msi edge от проверенного китайского производителя. Intel i5. Отличное соотношение цены и качества.',
  'prod-0059',
  227595,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000059?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0060',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Haylou 96X',
  'Наушники Haylou 96X - популярная модель с высоким рейтингом на китайских маркетплейсах. TWS. Быстрая доставка.',
  'prod-0060',
  12291,
  'RUB',
  20,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000060?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0061',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo 88X',
  'Смартфон Vivo 88X - популярная модель с высоким рейтингом на китайских маркетплейсах. AMOLED. Быстрая доставка.',
  'prod-0061',
  113348,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000061?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0062',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi 63S',
  'Оригинальный смартфон xiaomi 63s с гарантией качества. AMOLED. Проверено тысячами покупателей.',
  'prod-0062',
  95281,
  'RUB',
  5,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000062?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0063',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Realme Air',
  'Оригинальный смартфон realme air с гарантией качества. 5G. Проверено тысячами покупателей.',
  'prod-0063',
  85320,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000063?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0064',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Vivo Lite',
  'Топовый смартфон vivo lite по доступной цене. 120Hz. Прямые поставки с завода.',
  'prod-0064',
  103236,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000064?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0065',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Edifier Air',
  'Оригинальный наушники edifier air с гарантией качества. С микрофоном. Проверено тысячами покупателей.',
  'prod-0065',
  10039,
  'RUB',
  27,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000065?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0066',
  '00000005-0000-0000-0000-000000050000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники QCY Air',
  'Качественный наушники qcy air от проверенного китайского производителя. TWS. Отличное соотношение цены и качества.',
  'prod-0066',
  6655,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000066?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0067',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Xiaomi 30',
  'Оригинальный смартфон xiaomi 30 с гарантией качества. AMOLED. Проверено тысячами покупателей.',
  'prod-0067',
  67301,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000067?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0068',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон Realme Plus',
  'Качественный смартфон realme plus от проверенного китайского производителя. 5G. Отличное соотношение цены и качества.',
  'prod-0068',
  91919,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000068?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0069',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO 63T',
  'Качественный смартфон poco 63t от проверенного китайского производителя. 8GB RAM. Отличное соотношение цены и качества.',
  'prod-0069',
  88093,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000069?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0070',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон POCO Pro',
  'Топовый смартфон poco pro по доступной цене. 8GB RAM. Прямые поставки с завода.',
  'prod-0070',
  52287,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000070?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0071',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук ASUS 28S',
  'Топовый ноутбук asus 28s по доступной цене. 16GB RAM. Прямые поставки с завода.',
  'prod-0071',
  318593,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000071?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0072',
  '00000004-0000-0000-0000-000000040000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Soundpeats 18T',
  'Наушники Soundpeats 18T - популярная модель с высоким рейтингом на китайских маркетплейсах. ANC. Быстрая доставка.',
  'prod-0072',
  15608,
  'RUB',
  24,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000072?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0073',
  '00000002-0000-0000-0000-000000020000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OPPO 79S',
  'Оригинальный смартфон oppo 79s с гарантией качества. 256GB. Проверено тысячами покупателей.',
  'prod-0073',
  124898,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000073?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0074',
  '00000003-0000-0000-0000-000000030000',
  '00000064-0000-0000-0000-000000640000',
  'Смартфон OnePlus 52',
  'Качественный смартфон oneplus 52 от проверенного китайского производителя. 5G. Отличное соотношение цены и качества.',
  'prod-0074',
  89466,
  'RUB',
  1,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000074?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5G","spec_2":"128GB","spec_3":"256GB"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0075',
  '00000007-0000-0000-0000-000000070000',
  '00000064-0000-0000-0000-000000640000',
  'Ноутбук Acer 82',
  'Качественный ноутбук acer 82 от проверенного китайского производителя. Intel i7. Отличное соотношение цены и качества.',
  'prod-0075',
  263641,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000075?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Intel i5","spec_2":"Intel i7","spec_3":"AMD Ryzen"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0076',
  '00000001-0000-0000-0000-000000010000',
  '00000064-0000-0000-0000-000000640000',
  'Наушники Haylou 48S',
  'Топовый наушники haylou 48s по доступной цене. С микрофоном. Прямые поставки с завода.',
  'prod-0076',
  16608,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000076?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"TWS","spec_2":"Bluetooth 5.3","spec_3":"ANC"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0077',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Outdoor Демисезонная',
  'Куртка Outdoor Демисезонная - популярная модель с высоким рейтингом на китайских маркетплейсах. С капюшоном. Быстрая доставка.',
  'prod-0077',
  14375,
  'RUB',
  77,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000077?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0078',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Street Демисезонная',
  'Куртка Street Демисезонная - популярная модель с высоким рейтингом на китайских маркетплейсах. С капюшоном. Быстрая доставка.',
  'prod-0078',
  25011,
  'RUB',
  68,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000078?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0079',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки New Balance Style Спортивные',
  'Оригинальный кроссовки new balance style спортивные с гарантией качества. Повседневные. Проверено тысячами покупателей.',
  'prod-0079',
  9379,
  'RUB',
  111,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000079?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0080',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Хлопок',
  'Футболка Premium Хлопок - популярная модель с высоким рейтингом на китайских маркетплейсах. Хлопок. Быстрая доставка.',
  'prod-0080',
  2292,
  'RUB',
  291,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000080?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0081',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Водонепроницаемая',
  'Качественный куртка classic водонепроницаемая от проверенного китайского производителя. Водонепроницаемая. Отличное соотношение цены и качества.',
  'prod-0081',
  17882,
  'RUB',
  94,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000081?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0082',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Outdoor Водонепроницаемая',
  'Топовый куртка outdoor водонепроницаемая по доступной цене. Демисезонная. Прямые поставки с завода.',
  'prod-0082',
  22194,
  'RUB',
  89,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000082?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0083',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Легкие',
  'Качественный кроссовки adidas style легкие от проверенного китайского производителя. Спортивные. Отличное соотношение цены и качества.',
  'prod-0083',
  5180,
  'RUB',
  46,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000083?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0084',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Хлопок',
  'Качественный футболка premium хлопок от проверенного китайского производителя. Оверсайз. Отличное соотношение цены и качества.',
  'prod-0084',
  3083,
  'RUB',
  234,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000084?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0085',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Дышащие',
  'Качественный кроссовки puma style дышащие от проверенного китайского производителя. Амортизация. Отличное соотношение цены и качества.',
  'prod-0085',
  8977,
  'RUB',
  113,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000085?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0086',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Reebok Style Амортизация',
  'Оригинальный кроссовки reebok style амортизация с гарантией качества. Легкие. Проверено тысячами покупателей.',
  'prod-0086',
  13366,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000086?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0087',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Nike Style Легкие',
  'Оригинальный кроссовки nike style легкие с гарантией качества. Повседневные. Проверено тысячами покупателей.',
  'prod-0087',
  11856,
  'RUB',
  101,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000087?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0088',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Хлопок',
  'Качественный футболка premium хлопок от проверенного китайского производителя. Slim fit. Отличное соотношение цены и качества.',
  'prod-0088',
  2464,
  'RUB',
  241,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000088?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0089',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки New Balance Style Легкие',
  'Качественный кроссовки new balance style легкие от проверенного китайского производителя. Дышащие. Отличное соотношение цены и качества.',
  'prod-0089',
  5799,
  'RUB',
  98,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000089?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0090',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Outdoor Водонепроницаемая',
  'Оригинальный куртка outdoor водонепроницаемая с гарантией качества. Утепленная. Проверено тысячами покупателей.',
  'prod-0090',
  6865,
  'RUB',
  42,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000090?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0091',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Slim fit',
  'Качественный футболка sport slim fit от проверенного китайского производителя. Однотонная. Отличное соотношение цены и качества.',
  'prod-0091',
  862,
  'RUB',
  56,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000091?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0092',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Повседневные',
  'Топовый кроссовки adidas style повседневные по доступной цене. Дышащие. Прямые поставки с завода.',
  'prod-0092',
  12281,
  'RUB',
  79,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000092?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0093',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Хлопок',
  'Качественный футболка premium хлопок от проверенного китайского производителя. Slim fit. Отличное соотношение цены и качества.',
  'prod-0093',
  1388,
  'RUB',
  286,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000093?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0094',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Basic Однотонная',
  'Качественный футболка basic однотонная от проверенного китайского производителя. Принт. Отличное соотношение цены и качества.',
  'prod-0094',
  2511,
  'RUB',
  271,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000094?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0095',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Водонепроницаемая',
  'Оригинальный куртка classic водонепроницаемая с гарантией качества. Водонепроницаемая. Проверено тысячами покупателей.',
  'prod-0095',
  10914,
  'RUB',
  88,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000095?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0096',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки New Balance Style Амортизация',
  'Кроссовки New Balance Style Амортизация - популярная модель с высоким рейтингом на китайских маркетплейсах. Дышащие. Быстрая доставка.',
  'prod-0096',
  16036,
  'RUB',
  50,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000096?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0097',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Хлопок',
  'Футболка Cotton Хлопок - популярная модель с высоким рейтингом на китайских маркетплейсах. Оверсайз. Быстрая доставка.',
  'prod-0097',
  1219,
  'RUB',
  60,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000097?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0098',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Зимняя',
  'Куртка Classic Зимняя - популярная модель с высоким рейтингом на китайских маркетплейсах. Водонепроницаемая. Быстрая доставка.',
  'prod-0098',
  10006,
  'RUB',
  82,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000098?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0099',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Street Водонепроницаемая',
  'Оригинальный куртка street водонепроницаемая с гарантией качества. Водонепроницаемая. Проверено тысячами покупателей.',
  'prod-0099',
  11942,
  'RUB',
  75,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000099?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0100',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Легкие',
  'Топовый кроссовки puma style легкие по доступной цене. Легкие. Прямые поставки с завода.',
  'prod-0100',
  8815,
  'RUB',
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000100?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 100/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0101',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Зимняя',
  'Куртка Classic Зимняя - популярная модель с высоким рейтингом на китайских маркетплейсах. С капюшоном. Быстрая доставка.',
  'prod-0101',
  21339,
  'RUB',
  34,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000101?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0102',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Принт',
  'Качественный футболка premium принт от проверенного китайского производителя. Оверсайз. Отличное соотношение цены и качества.',
  'prod-0102',
  2020,
  'RUB',
  194,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000102?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0103',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Амортизация',
  'Качественный кроссовки adidas style амортизация от проверенного китайского производителя. Спортивные. Отличное соотношение цены и качества.',
  'prod-0103',
  13912,
  'RUB',
  65,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000103?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0104',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Urban Утепленная',
  'Оригинальный куртка urban утепленная с гарантией качества. Демисезонная. Проверено тысячами покупателей.',
  'prod-0104',
  25253,
  'RUB',
  52,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000104?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0105',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Однотонная',
  'Оригинальный футболка sport однотонная с гарантией качества. Оверсайз. Проверено тысячами покупателей.',
  'prod-0105',
  2924,
  'RUB',
  63,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000105?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0106',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Urban Хлопок',
  'Оригинальный футболка urban хлопок с гарантией качества. Хлопок. Проверено тысячами покупателей.',
  'prod-0106',
  2968,
  'RUB',
  247,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000106?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0107',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Дышащие',
  'Качественный кроссовки puma style дышащие от проверенного китайского производителя. Дышащие. Отличное соотношение цены и качества.',
  'prod-0107',
  11548,
  'RUB',
  96,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000107?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0108',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Urban Однотонная',
  'Оригинальный футболка urban однотонная с гарантией качества. Оверсайз. Проверено тысячами покупателей.',
  'prod-0108',
  2506,
  'RUB',
  122,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000108?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0109',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Амортизация',
  'Кроссовки Puma Style Амортизация - популярная модель с высоким рейтингом на китайских маркетплейсах. Легкие. Быстрая доставка.',
  'prod-0109',
  16909,
  'RUB',
  74,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000109?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0110',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Urban Зимняя',
  'Топовый куртка urban зимняя по доступной цене. Утепленная. Прямые поставки с завода.',
  'prod-0110',
  12778,
  'RUB',
  43,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000110?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0111',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Outdoor Водонепроницаемая',
  'Качественный куртка outdoor водонепроницаемая от проверенного китайского производителя. С капюшоном. Отличное соотношение цены и качества.',
  'prod-0111',
  32175,
  'RUB',
  98,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000111?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0112',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Однотонная',
  'Качественный футболка premium однотонная от проверенного китайского производителя. Хлопок. Отличное соотношение цены и качества.',
  'prod-0112',
  3462,
  'RUB',
  166,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000112?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0113',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Urban Демисезонная',
  'Куртка Urban Демисезонная - популярная модель с высоким рейтингом на китайских маркетплейсах. Демисезонная. Быстрая доставка.',
  'prod-0113',
  32065,
  'RUB',
  87,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000113?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0114',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Mountain Зимняя',
  'Качественный куртка mountain зимняя от проверенного китайского производителя. С капюшоном. Отличное соотношение цены и качества.',
  'prod-0114',
  13563,
  'RUB',
  60,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000114?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0115',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Оверсайз',
  'Качественный футболка premium оверсайз от проверенного китайского производителя. Оверсайз. Отличное соотношение цены и качества.',
  'prod-0115',
  2305,
  'RUB',
  205,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000115?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0116',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Принт',
  'Топовый футболка cotton принт по доступной цене. Slim fit. Прямые поставки с завода.',
  'prod-0116',
  2846,
  'RUB',
  294,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000116?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0117',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Mountain С капюшоном',
  'Куртка Mountain С капюшоном - популярная модель с высоким рейтингом на китайских маркетплейсах. Водонепроницаемая. Быстрая доставка.',
  'prod-0117',
  19889,
  'RUB',
  59,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000117?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0118',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Reebok Style Амортизация',
  'Топовый кроссовки reebok style амортизация по доступной цене. Повседневные. Прямые поставки с завода.',
  'prod-0118',
  8485,
  'RUB',
  83,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000118?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0119',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Амортизация',
  'Кроссовки Puma Style Амортизация - популярная модель с высоким рейтингом на китайских маркетплейсах. Амортизация. Быстрая доставка.',
  'prod-0119',
  7458,
  'RUB',
  81,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000119?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0120',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Хлопок',
  'Топовый футболка cotton хлопок по доступной цене. Хлопок. Прямые поставки с завода.',
  'prod-0120',
  1727,
  'RUB',
  56,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000120?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0121',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Спортивные',
  'Оригинальный кроссовки adidas style спортивные с гарантией качества. Спортивные. Проверено тысячами покупателей.',
  'prod-0121',
  13050,
  'RUB',
  114,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000121?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0122',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Демисезонная',
  'Топовый куртка classic демисезонная по доступной цене. С капюшоном. Прямые поставки с завода.',
  'prod-0122',
  25471,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000122?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0123',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки New Balance Style Спортивные',
  'Качественный кроссовки new balance style спортивные от проверенного китайского производителя. Спортивные. Отличное соотношение цены и качества.',
  'prod-0123',
  15824,
  'RUB',
  103,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000123?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0124',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Puma Style Дышащие',
  'Оригинальный кроссовки puma style дышащие с гарантией качества. Легкие. Проверено тысячами покупателей.',
  'prod-0124',
  12870,
  'RUB',
  113,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000124?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0125',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Хлопок',
  'Топовый футболка cotton хлопок по доступной цене. Оверсайз. Прямые поставки с завода.',
  'prod-0125',
  2038,
  'RUB',
  187,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000125?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0126',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Оверсайз',
  'Качественный футболка sport оверсайз от проверенного китайского производителя. Однотонная. Отличное соотношение цены и качества.',
  'prod-0126',
  2883,
  'RUB',
  57,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000126?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0127',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Mountain Демисезонная',
  'Топовый куртка mountain демисезонная по доступной цене. Утепленная. Прямые поставки с завода.',
  'prod-0127',
  9454,
  'RUB',
  49,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000127?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0128',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Classic Утепленная',
  'Куртка Classic Утепленная - популярная модель с высоким рейтингом на китайских маркетплейсах. Демисезонная. Быстрая доставка.',
  'prod-0128',
  14425,
  'RUB',
  53,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000128?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0129',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки New Balance Style Дышащие',
  'Кроссовки New Balance Style Дышащие - популярная модель с высоким рейтингом на китайских маркетплейсах. Амортизация. Быстрая доставка.',
  'prod-0129',
  14746,
  'RUB',
  105,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000129?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0130',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Mountain С капюшоном',
  'Качественный куртка mountain с капюшоном от проверенного китайского производителя. Зимняя. Отличное соотношение цены и качества.',
  'prod-0130',
  22512,
  'RUB',
  34,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000130?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0131',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Оверсайз',
  'Футболка Premium Оверсайз - популярная модель с высоким рейтингом на китайских маркетплейсах. Оверсайз. Быстрая доставка.',
  'prod-0131',
  2816,
  'RUB',
  126,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000131?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0132',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Легкие',
  'Топовый кроссовки adidas style легкие по доступной цене. Амортизация. Прямые поставки с завода.',
  'prod-0132',
  12036,
  'RUB',
  98,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000132?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0133',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Outdoor Утепленная',
  'Оригинальный куртка outdoor утепленная с гарантией качества. С капюшоном. Проверено тысячами покупателей.',
  'prod-0133',
  28505,
  'RUB',
  27,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000133?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0134',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Basic Принт',
  'Качественный футболка basic принт от проверенного китайского производителя. Оверсайз. Отличное соотношение цены и качества.',
  'prod-0134',
  1430,
  'RUB',
  102,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000134?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0135',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Nike Style Спортивные',
  'Оригинальный кроссовки nike style спортивные с гарантией качества. Легкие. Проверено тысячами покупателей.',
  'prod-0135',
  9892,
  'RUB',
  95,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000135?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0136',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Однотонная',
  'Топовый футболка sport однотонная по доступной цене. Принт. Прямые поставки с завода.',
  'prod-0136',
  2387,
  'RUB',
  101,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000136?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0137',
  '00000006-0000-0000-0000-000000060000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Nike Style Дышащие',
  'Оригинальный кроссовки nike style дышащие с гарантией качества. Легкие. Проверено тысячами покупателей.',
  'prod-0137',
  16426,
  'RUB',
  120,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000137?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0138',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Basic Однотонная',
  'Топовый футболка basic однотонная по доступной цене. Хлопок. Прямые поставки с завода.',
  'prod-0138',
  3367,
  'RUB',
  259,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000138?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0139',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Хлопок',
  'Оригинальный футболка cotton хлопок с гарантией качества. Хлопок. Проверено тысячами покупателей.',
  'prod-0139',
  1507,
  'RUB',
  222,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000139?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0140',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Urban Зимняя',
  'Оригинальный куртка urban зимняя с гарантией качества. Утепленная. Проверено тысячами покупателей.',
  'prod-0140',
  8241,
  'RUB',
  52,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000140?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0141',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Slim fit',
  'Качественный футболка sport slim fit от проверенного китайского производителя. Хлопок. Отличное соотношение цены и качества.',
  'prod-0141',
  2499,
  'RUB',
  252,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000141?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0142',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Basic Slim fit',
  'Футболка Basic Slim fit - популярная модель с высоким рейтингом на китайских маркетплейсах. Хлопок. Быстрая доставка.',
  'prod-0142',
  998,
  'RUB',
  289,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000142?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0143',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Принт',
  'Топовый футболка sport принт по доступной цене. Slim fit. Прямые поставки с завода.',
  'prod-0143',
  806,
  'RUB',
  145,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000143?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0144',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Sport Slim fit',
  'Футболка Sport Slim fit - популярная модель с высоким рейтингом на китайских маркетплейсах. Однотонная. Быстрая доставка.',
  'prod-0144',
  2793,
  'RUB',
  70,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000144?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0145',
  '00000005-0000-0000-0000-000000050000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Basic Принт',
  'Футболка Basic Принт - популярная модель с высоким рейтингом на китайских маркетплейсах. Принт. Быстрая доставка.',
  'prod-0145',
  1135,
  'RUB',
  110,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000145?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0146',
  '00000003-0000-0000-0000-000000030000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Premium Принт',
  'Оригинальный футболка premium принт с гарантией качества. Однотонная. Проверено тысячами покупателей.',
  'prod-0146',
  2159,
  'RUB',
  267,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000146?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0147',
  '00000002-0000-0000-0000-000000020000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Urban Зимняя',
  'Куртка Urban Зимняя - популярная модель с высоким рейтингом на китайских маркетплейсах. Водонепроницаемая. Быстрая доставка.',
  'prod-0147',
  15963,
  'RUB',
  39,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000147?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0148',
  '00000000-0000-0000-0000-000000000000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Reebok Style Спортивные',
  'Качественный кроссовки reebok style спортивные от проверенного китайского производителя. Дышащие. Отличное соотношение цены и качества.',
  'prod-0148',
  8047,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000148?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0149',
  '00000001-0000-0000-0000-000000010000',
  '00000065-0000-0000-0000-000000650000',
  'Кроссовки Adidas Style Легкие',
  'Качественный кроссовки adidas style легкие от проверенного китайского производителя. Спортивные. Отличное соотношение цены и качества.',
  'prod-0149',
  13760,
  'RUB',
  75,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000149?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Спортивные","spec_2":"Повседневные","spec_3":"Дышащие"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0150',
  '00000007-0000-0000-0000-000000070000',
  '00000065-0000-0000-0000-000000650000',
  'Куртка Street С капюшоном',
  'Оригинальный куртка street с капюшоном с гарантией качества. Утепленная. Проверено тысячами покупателей.',
  'prod-0150',
  9885,
  'RUB',
  84,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000150?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Зимняя","spec_2":"Демисезонная","spec_3":"Водонепроницаемая"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 150/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0151',
  '00000004-0000-0000-0000-000000040000',
  '00000065-0000-0000-0000-000000650000',
  'Футболка Cotton Оверсайз',
  'Футболка Cotton Оверсайз - популярная модель с высоким рейтингом на китайских маркетплейсах. Принт. Быстрая доставка.',
  'prod-0151',
  953,
  'RUB',
  185,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000151?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Хлопок","spec_2":"Оверсайз","spec_3":"Slim fit"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0152',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 3-местный',
  'Топовый диван classic 3-местный по доступной цене. 2-местный. Прямые поставки с завода.',
  'prod-0152',
  184119,
  'RUB',
  4,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000152?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0153',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 3-местный',
  'Качественный диван classic 3-местный от проверенного китайского производителя. 3-местный. Отличное соотношение цены и качества.',
  'prod-0153',
  301226,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000153?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0154',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort Прямой',
  'Оригинальный диван comfort прямой с гарантией качества. 2-местный. Проверено тысячами покупателей.',
  'prod-0154',
  148769,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000154?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0155',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort С подлокотниками',
  'Офисное кресло Comfort С подлокотниками - популярная модель с высоким рейтингом на китайских маркетплейсах. Эргономичное. Быстрая доставка.',
  'prod-0155',
  18864,
  'RUB',
  12,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000155?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0156',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive Кожа/Ткань',
  'Офисное кресло Executive Кожа/Ткань - популярная модель с высоким рейтингом на китайских маркетплейсах. Эргономичное. Быстрая доставка.',
  'prod-0156',
  59426,
  'RUB',
  17,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000156?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0157',
  '00000005-0000-0000-0000-000000050000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Lux Раскладной',
  'Диван Lux Раскладной - популярная модель с высоким рейтингом на китайских маркетплейсах. Прямой. Быстрая доставка.',
  'prod-0157',
  115266,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000157?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0158',
  '00000007-0000-0000-0000-000000070000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Ergo Регулируемое',
  'Качественный офисное кресло ergo регулируемое от проверенного китайского производителя. С подлокотниками. Отличное соотношение цены и качества.',
  'prod-0158',
  16016,
  'RUB',
  6,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000158?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0159',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort Эргономичное',
  'Оригинальный офисное кресло comfort эргономичное с гарантией качества. Кожа/Ткань. Проверено тысячами покупателей.',
  'prod-0159',
  23574,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000159?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0160',
  '00000000-0000-0000-0000-000000000000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort 2-местный',
  'Оригинальный диван comfort 2-местный с гарантией качества. Раскладной. Проверено тысячами покупателей.',
  'prod-0160',
  130306,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000160?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0161',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern 3-местный',
  'Диван Modern 3-местный - популярная модель с высоким рейтингом на китайских маркетплейсах. 2-местный. Быстрая доставка.',
  'prod-0161',
  186594,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000161?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0162',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort Прямой',
  'Диван Comfort Прямой - популярная модель с высоким рейтингом на китайских маркетплейсах. Угловой. Быстрая доставка.',
  'prod-0162',
  131246,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000162?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0163',
  '00000000-0000-0000-0000-000000000000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive С подлокотниками',
  'Офисное кресло Executive С подлокотниками - популярная модель с высоким рейтингом на китайских маркетплейсах. Эргономичное. Быстрая доставка.',
  'prod-0163',
  52396,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000163?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0164',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space Раскладной',
  'Топовый диван space раскладной по доступной цене. Прямой. Прямые поставки с завода.',
  'prod-0164',
  149431,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000164?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0165',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort Кожа/Ткань',
  'Оригинальный офисное кресло comfort кожа/ткань с гарантией качества. Эргономичное. Проверено тысячами покупателей.',
  'prod-0165',
  57020,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000165?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0166',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort Массаж',
  'Топовый офисное кресло comfort массаж по доступной цене. Эргономичное. Прямые поставки с завода.',
  'prod-0166',
  53763,
  'RUB',
  6,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000166?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0167',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Ergo Регулируемое',
  'Топовый офисное кресло ergo регулируемое по доступной цене. С подлокотниками. Прямые поставки с завода.',
  'prod-0167',
  51522,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000167?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0168',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort Эргономичное',
  'Оригинальный офисное кресло comfort эргономичное с гарантией качества. Эргономичное. Проверено тысячами покупателей.',
  'prod-0168',
  24916,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000168?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0169',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Прямой',
  'Топовый диван classic прямой по доступной цене. 3-местный. Прямые поставки с завода.',
  'prod-0169',
  194003,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000169?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0170',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort С подлокотниками',
  'Офисное кресло Comfort С подлокотниками - популярная модель с высоким рейтингом на китайских маркетплейсах. Массаж. Быстрая доставка.',
  'prod-0170',
  20507,
  'RUB',
  16,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000170?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0171',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Раскладной',
  'Диван Classic Раскладной - популярная модель с высоким рейтингом на китайских маркетплейсах. 2-местный. Быстрая доставка.',
  'prod-0171',
  167948,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000171?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0172',
  '00000007-0000-0000-0000-000000070000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern Угловой',
  'Оригинальный диван modern угловой с гарантией качества. 3-местный. Проверено тысячами покупателей.',
  'prod-0172',
  94792,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000172?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0173',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive Массаж',
  'Оригинальный офисное кресло executive массаж с гарантией качества. С подлокотниками. Проверено тысячами покупателей.',
  'prod-0173',
  30102,
  'RUB',
  16,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000173?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0174',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern 3-местный',
  'Оригинальный диван modern 3-местный с гарантией качества. 3-местный. Проверено тысячами покупателей.',
  'prod-0174',
  203912,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000174?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0175',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space Угловой',
  'Диван Space Угловой - популярная модель с высоким рейтингом на китайских маркетплейсах. Угловой. Быстрая доставка.',
  'prod-0175',
  230612,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000175?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0177',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Classic Массаж',
  'Офисное кресло Classic Массаж - популярная модель с высоким рейтингом на китайских маркетплейсах. Кожа/Ткань. Быстрая доставка.',
  'prod-0177',
  32439,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000177?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0178',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive Кожа/Ткань',
  'Качественный офисное кресло executive кожа/ткань от проверенного китайского производителя. Регулируемое. Отличное соотношение цены и качества.',
  'prod-0178',
  19611,
  'RUB',
  8,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000178?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0179',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space 3-местный',
  'Топовый диван space 3-местный по доступной цене. 2-местный. Прямые поставки с завода.',
  'prod-0179',
  205277,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000179?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0180',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Lux 3-местный',
  'Качественный диван lux 3-местный от проверенного китайского производителя. Прямой. Отличное соотношение цены и качества.',
  'prod-0180',
  245814,
  'RUB',
  1,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000180?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0181',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Ergo Эргономичное',
  'Топовый офисное кресло ergo эргономичное по доступной цене. Регулируемое. Прямые поставки с завода.',
  'prod-0181',
  53402,
  'RUB',
  9,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000181?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0182',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Ergo Кожа/Ткань',
  'Топовый офисное кресло ergo кожа/ткань по доступной цене. Регулируемое. Прямые поставки с завода.',
  'prod-0182',
  29016,
  'RUB',
  12,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000182?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0184',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive С подлокотниками',
  'Качественный офисное кресло executive с подлокотниками от проверенного китайского производителя. Регулируемое. Отличное соотношение цены и качества.',
  'prod-0184',
  15818,
  'RUB',
  10,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000184?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0186',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Раскладной',
  'Оригинальный диван classic раскладной с гарантией качества. Прямой. Проверено тысячами покупателей.',
  'prod-0186',
  176267,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000186?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0187',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Comfort Эргономичное',
  'Топовый офисное кресло comfort эргономичное по доступной цене. С подлокотниками. Прямые поставки с завода.',
  'prod-0187',
  49478,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000187?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0188',
  '00000000-0000-0000-0000-000000000000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Classic С подлокотниками',
  'Качественный офисное кресло classic с подлокотниками от проверенного китайского производителя. Массаж. Отличное соотношение цены и качества.',
  'prod-0188',
  27448,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000188?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0190',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern Прямой',
  'Оригинальный диван modern прямой с гарантией качества. Раскладной. Проверено тысячами покупателей.',
  'prod-0190',
  284778,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000190?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0191',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Угловой',
  'Качественный диван classic угловой от проверенного китайского производителя. 3-местный. Отличное соотношение цены и качества.',
  'prod-0191',
  171650,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000191?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0192',
  '00000005-0000-0000-0000-000000050000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern 2-местный',
  'Оригинальный диван modern 2-местный с гарантией качества. Угловой. Проверено тысячами покупателей.',
  'prod-0192',
  112652,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000192?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0193',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort 3-местный',
  'Оригинальный диван comfort 3-местный с гарантией качества. 2-местный. Проверено тысячами покупателей.',
  'prod-0193',
  240430,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000193?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0194',
  '00000005-0000-0000-0000-000000050000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Lux 2-местный',
  'Оригинальный диван lux 2-местный с гарантией качества. Раскладной. Проверено тысячами покупателей.',
  'prod-0194',
  172077,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000194?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0195',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern Раскладной',
  'Качественный диван modern раскладной от проверенного китайского производителя. Раскладной. Отличное соотношение цены и качества.',
  'prod-0195',
  225131,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000195?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0196',
  '00000007-0000-0000-0000-000000070000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort 3-местный',
  'Топовый диван comfort 3-местный по доступной цене. Угловой. Прямые поставки с завода.',
  'prod-0196',
  290991,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000196?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0197',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space 2-местный',
  'Оригинальный диван space 2-местный с гарантией качества. Прямой. Проверено тысячами покупателей.',
  'prod-0197',
  107480,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000197?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0198',
  '00000000-0000-0000-0000-000000000000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space 2-местный',
  'Топовый диван space 2-местный по доступной цене. 3-местный. Прямые поставки с завода.',
  'prod-0198',
  213803,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000198?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0199',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 2-местный',
  'Диван Classic 2-местный - популярная модель с высоким рейтингом на китайских маркетплейсах. Угловой. Быстрая доставка.',
  'prod-0199',
  193967,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000199?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0200',
  '00000006-0000-0000-0000-000000060000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Прямой',
  'Качественный диван classic прямой от проверенного китайского производителя. Раскладной. Отличное соотношение цены и качества.',
  'prod-0200',
  176536,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000200?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0201',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Comfort 3-местный',
  'Качественный диван comfort 3-местный от проверенного китайского производителя. Прямой. Отличное соотношение цены и качества.',
  'prod-0201',
  109009,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000201?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0202',
  '00000007-0000-0000-0000-000000070000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Classic Эргономичное',
  'Офисное кресло Classic Эргономичное - популярная модель с высоким рейтингом на китайских маркетплейсах. С подлокотниками. Быстрая доставка.',
  'prod-0202',
  42374,
  'RUB',
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000202?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0203',
  '00000000-0000-0000-0000-000000000000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 3-местный',
  'Топовый диван classic 3-местный по доступной цене. Угловой. Прямые поставки с завода.',
  'prod-0203',
  100213,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000203?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0204',
  '00000007-0000-0000-0000-000000070000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Modern Угловой',
  'Качественный диван modern угловой от проверенного китайского производителя. Раскладной. Отличное соотношение цены и качества.',
  'prod-0204',
  201650,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000204?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 200/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0205',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic Раскладной',
  'Качественный диван classic раскладной от проверенного китайского производителя. Угловой. Отличное соотношение цены и качества.',
  'prod-0205',
  286482,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000205?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0206',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive Массаж',
  'Оригинальный офисное кресло executive массаж с гарантией качества. Кожа/Ткань. Проверено тысячами покупателей.',
  'prod-0206',
  33993,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000206?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0207',
  '00000003-0000-0000-0000-000000030000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Ergo Массаж',
  'Офисное кресло Ergo Массаж - популярная модель с высоким рейтингом на китайских маркетплейсах. Регулируемое. Быстрая доставка.',
  'prod-0207',
  17168,
  'RUB',
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000207?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0208',
  '00000001-0000-0000-0000-000000010000',
  '00000066-0000-0000-0000-000000660000',
  'Офисное кресло Executive Массаж',
  'Качественный офисное кресло executive массаж от проверенного китайского производителя. Эргономичное. Отличное соотношение цены и качества.',
  'prod-0208',
  32582,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000208?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Эргономичное","spec_2":"С подлокотниками","spec_3":"Массаж"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0209',
  '00000002-0000-0000-0000-000000020000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Space 3-местный',
  'Оригинальный диван space 3-местный с гарантией качества. 3-местный. Проверено тысячами покупателей.',
  'prod-0209',
  211564,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000209?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0210',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 3-местный',
  'Качественный диван classic 3-местный от проверенного китайского производителя. Угловой. Отличное соотношение цены и качества.',
  'prod-0210',
  252217,
  'RUB',
  4,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000210?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0211',
  '00000004-0000-0000-0000-000000040000',
  '00000066-0000-0000-0000-000000660000',
  'Диван Classic 3-местный',
  'Качественный диван classic 3-местный от проверенного китайского производителя. Прямой. Отличное соотношение цены и качества.',
  'prod-0211',
  251621,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000211?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Раскладной","spec_2":"Угловой","spec_3":"Прямой"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0212',
  '00000005-0000-0000-0000-000000050000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник LuxLight Пульт ДУ',
  'Топовый led светильник luxlight пульт ду по доступной цене. Пульт ДУ. Прямые поставки с завода.',
  'prod-0212',
  7746,
  'RUB',
  79,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000212?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0213',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight Умный',
  'Топовый led светильник brightlight умный по доступной цене. Умный. Прямые поставки с завода.',
  'prod-0213',
  8894,
  'RUB',
  54,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000213?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0214',
  '00000006-0000-0000-0000-000000060000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник LuxLight Пульт ДУ',
  'Оригинальный led светильник luxlight пульт ду с гарантией качества. Умный. Проверено тысячами покупателей.',
  'prod-0214',
  8403,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000214?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0215',
  '00000005-0000-0000-0000-000000050000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Ударная',
  'Качественный дрель buildpro ударная от проверенного китайского производителя. Аккумуляторная. Отличное соотношение цены и качества.',
  'prod-0215',
  27118,
  'RUB',
  10,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000215?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0216',
  '00000001-0000-0000-0000-000000010000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome RGB',
  'Топовый led светильник smarthome rgb по доступной цене. Настенный. Прямые поставки с завода.',
  'prod-0216',
  4779,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000216?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0217',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель ToolMax Комплект насадок',
  'Оригинальный дрель toolmax комплект насадок с гарантией качества. 20V. Проверено тысячами покупателей.',
  'prod-0217',
  8427,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000217?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0218',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель MasterCraft Ударная',
  'Дрель MasterCraft Ударная - популярная модель с высоким рейтингом на китайских маркетплейсах. Комплект насадок. Быстрая доставка.',
  'prod-0218',
  15514,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000218?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0219',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight Потолочный',
  'Топовый led светильник brightlight потолочный по доступной цене. Пульт ДУ. Прямые поставки с завода.',
  'prod-0219',
  3219,
  'RUB',
  60,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000219?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0220',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight RGB',
  'LED светильник BrightLight RGB - популярная модель с высоким рейтингом на китайских маркетплейсах. Настенный. Быстрая доставка.',
  'prod-0220',
  6956,
  'RUB',
  51,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000220?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0221',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome Потолочный',
  'Оригинальный led светильник smarthome потолочный с гарантией качества. Потолочный. Проверено тысячами покупателей.',
  'prod-0221',
  7168,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000221?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0222',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Аккумуляторная',
  'Дрель BuildPro Аккумуляторная - популярная модель с высоким рейтингом на китайских маркетплейсах. Комплект насадок. Быстрая доставка.',
  'prod-0222',
  20669,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000222?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0223',
  '00000005-0000-0000-0000-000000050000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник LuxLight Пульт ДУ',
  'LED светильник LuxLight Пульт ДУ - популярная модель с высоким рейтингом на китайских маркетплейсах. Пульт ДУ. Быстрая доставка.',
  'prod-0223',
  1699,
  'RUB',
  34,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000223?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0224',
  '00000001-0000-0000-0000-000000010000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED RGB',
  'Качественный led светильник modernled rgb от проверенного китайского производителя. Потолочный. Отличное соотношение цены и качества.',
  'prod-0224',
  4139,
  'RUB',
  66,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000224?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0225',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome RGB',
  'Оригинальный led светильник smarthome rgb с гарантией качества. RGB. Проверено тысячами покупателей.',
  'prod-0225',
  7077,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000225?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0226',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED Умный',
  'Качественный led светильник modernled умный от проверенного китайского производителя. Пульт ДУ. Отличное соотношение цены и качества.',
  'prod-0226',
  6484,
  'RUB',
  62,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000226?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0227',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Ударная',
  'Топовый дрель buildpro ударная по доступной цене. 18V. Прямые поставки с завода.',
  'prod-0227',
  10552,
  'RUB',
  18,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000227?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0228',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED Умный',
  'Топовый led светильник modernled умный по доступной цене. Потолочный. Прямые поставки с завода.',
  'prod-0228',
  2569,
  'RUB',
  96,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000228?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0229',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель MasterCraft 18V',
  'Топовый дрель mastercraft 18v по доступной цене. 20V. Прямые поставки с завода.',
  'prod-0229',
  24847,
  'RUB',
  22,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000229?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0230',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED Настенный',
  'Качественный led светильник modernled настенный от проверенного китайского производителя. RGB. Отличное соотношение цены и качества.',
  'prod-0230',
  4933,
  'RUB',
  76,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000230?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0231',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель MasterCraft Комплект насадок',
  'Дрель MasterCraft Комплект насадок - популярная модель с высоким рейтингом на китайских маркетплейсах. 20V. Быстрая доставка.',
  'prod-0231',
  24880,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000231?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0232',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель MasterCraft Ударная',
  'Оригинальный дрель mastercraft ударная с гарантией качества. Ударная. Проверено тысячами покупателей.',
  'prod-0232',
  16229,
  'RUB',
  17,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000232?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0233',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight RGB',
  'Оригинальный led светильник brightlight rgb с гарантией качества. Потолочный. Проверено тысячами покупателей.',
  'prod-0233',
  8800,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000233?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0234',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник LuxLight Потолочный',
  'Оригинальный led светильник luxlight потолочный с гарантией качества. Потолочный. Проверено тысячами покупателей.',
  'prod-0234',
  4648,
  'RUB',
  85,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000234?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0235',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Комплект насадок',
  'Дрель BuildPro Комплект насадок - популярная модель с высоким рейтингом на китайских маркетплейсах. 20V. Быстрая доставка.',
  'prod-0235',
  21768,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000235?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0236',
  '00000005-0000-0000-0000-000000050000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель ProWork 18V',
  'Дрель ProWork 18V - популярная модель с высоким рейтингом на китайских маркетплейсах. Аккумуляторная. Быстрая доставка.',
  'prod-0236',
  26486,
  'RUB',
  22,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000236?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0237',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight Пульт ДУ',
  'Качественный led светильник brightlight пульт ду от проверенного китайского производителя. Умный. Отличное соотношение цены и качества.',
  'prod-0237',
  1294,
  'RUB',
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000237?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0238',
  '00000006-0000-0000-0000-000000060000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник BrightLight RGB',
  'Оригинальный led светильник brightlight rgb с гарантией качества. Умный. Проверено тысячами покупателей.',
  'prod-0238',
  2724,
  'RUB',
  64,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000238?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0239',
  '00000005-0000-0000-0000-000000050000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель ToolMax 20V',
  'Качественный дрель toolmax 20v от проверенного китайского производителя. Аккумуляторная. Отличное соотношение цены и качества.',
  'prod-0239',
  10587,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000239?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0240',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник EcoLED Настенный',
  'LED светильник EcoLED Настенный - популярная модель с высоким рейтингом на китайских маркетплейсах. Потолочный. Быстрая доставка.',
  'prod-0240',
  6225,
  'RUB',
  55,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000240?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0241',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro 20V',
  'Качественный дрель buildpro 20v от проверенного китайского производителя. Аккумуляторная. Отличное соотношение цены и качества.',
  'prod-0241',
  22687,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000241?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0242',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED Умный',
  'Топовый led светильник modernled умный по доступной цене. Настенный. Прямые поставки с завода.',
  'prod-0242',
  4570,
  'RUB',
  32,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000242?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0243',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель PowerTool 18V',
  'Оригинальный дрель powertool 18v с гарантией качества. Аккумуляторная. Проверено тысячами покупателей.',
  'prod-0243',
  18825,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000243?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0244',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Аккумуляторная',
  'Качественный дрель buildpro аккумуляторная от проверенного китайского производителя. 18V. Отличное соотношение цены и качества.',
  'prod-0244',
  25676,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000244?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0245',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome Умный',
  'Оригинальный led светильник smarthome умный с гарантией качества. Пульт ДУ. Проверено тысячами покупателей.',
  'prod-0245',
  2717,
  'RUB',
  49,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000245?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0246',
  '00000001-0000-0000-0000-000000010000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED Пульт ДУ',
  'LED светильник ModernLED Пульт ДУ - популярная модель с высоким рейтингом на китайских маркетплейсах. Пульт ДУ. Быстрая доставка.',
  'prod-0246',
  7931,
  'RUB',
  61,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000246?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0247',
  '00000000-0000-0000-0000-000000000000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель PowerTool Ударная',
  'Дрель PowerTool Ударная - популярная модель с высоким рейтингом на китайских маркетплейсах. Комплект насадок. Быстрая доставка.',
  'prod-0247',
  17201,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000247?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0248',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome Настенный',
  'LED светильник SmartHome Настенный - популярная модель с высоким рейтингом на китайских маркетплейсах. Пульт ДУ. Быстрая доставка.',
  'prod-0248',
  4306,
  'RUB',
  22,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000248?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0249',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель ToolMax Ударная',
  'Дрель ToolMax Ударная - популярная модель с высоким рейтингом на китайских маркетплейсах. Аккумуляторная. Быстрая доставка.',
  'prod-0249',
  23147,
  'RUB',
  10,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000249?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0250',
  '00000001-0000-0000-0000-000000010000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель MasterCraft 20V',
  'Качественный дрель mastercraft 20v от проверенного китайского производителя. 18V. Отличное соотношение цены и качества.',
  'prod-0250',
  19192,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000250?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0251',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome Умный',
  'Топовый led светильник smarthome умный по доступной цене. RGB. Прямые поставки с завода.',
  'prod-0251',
  3241,
  'RUB',
  52,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000251?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0252',
  '00000001-0000-0000-0000-000000010000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель BuildPro Ударная',
  'Качественный дрель buildpro ударная от проверенного китайского производителя. 18V. Отличное соотношение цены и качества.',
  'prod-0252',
  25968,
  'RUB',
  46,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000252?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0253',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник EcoLED Умный',
  'LED светильник EcoLED Умный - популярная модель с высоким рейтингом на китайских маркетплейсах. Потолочный. Быстрая доставка.',
  'prod-0253',
  7665,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000253?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0254',
  '00000004-0000-0000-0000-000000040000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник EcoLED Потолочный',
  'Топовый led светильник ecoled потолочный по доступной цене. Настенный. Прямые поставки с завода.',
  'prod-0254',
  5138,
  'RUB',
  64,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000254?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 250/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0255',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник SmartHome Пульт ДУ',
  'LED светильник SmartHome Пульт ДУ - популярная модель с высоким рейтингом на китайских маркетплейсах. Пульт ДУ. Быстрая доставка.',
  'prod-0255',
  7779,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000255?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0256',
  '00000006-0000-0000-0000-000000060000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник ModernLED RGB',
  'LED светильник ModernLED RGB - популярная модель с высоким рейтингом на китайских маркетплейсах. Умный. Быстрая доставка.',
  'prod-0256',
  6084,
  'RUB',
  89,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000256?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0257',
  '00000002-0000-0000-0000-000000020000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель PowerTool Комплект насадок',
  'Качественный дрель powertool комплект насадок от проверенного китайского производителя. Ударная. Отличное соотношение цены и качества.',
  'prod-0257',
  15762,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000257?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0258',
  '00000007-0000-0000-0000-000000070000',
  '00000067-0000-0000-0000-000000670000',
  'Дрель PowerTool Комплект насадок',
  'Дрель PowerTool Комплект насадок - популярная модель с высоким рейтингом на китайских маркетплейсах. 20V. Быстрая доставка.',
  'prod-0258',
  22244,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000258?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Аккумуляторная","spec_2":"Ударная","spec_3":"18V"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0259',
  '00000003-0000-0000-0000-000000030000',
  '00000067-0000-0000-0000-000000670000',
  'LED светильник LuxLight RGB',
  'Топовый led светильник luxlight rgb по доступной цене. Умный. Прямые поставки с завода.',
  'prod-0259',
  4174,
  'RUB',
  51,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000259?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Потолочный","spec_2":"Настенный","spec_3":"Умный"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0260',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Оригинальный тормозные колодки ate type с гарантией качества. Передние. Проверено тысячами покупателей.',
  'prod-0260',
  14869,
  'RUB',
  16,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000260?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0261',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Liqui Moly Type Синтетика',
  'Моторное масло Liqui Moly Type Синтетика - популярная модель с высоким рейтингом на китайских маркетплейсах. 10W-40. Быстрая доставка.',
  'prod-0261',
  3278,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000261?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0262',
  '00000003-0000-0000-0000-000000030000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Liqui Moly Type 5W-30',
  'Качественный моторное масло liqui moly type 5w-30 от проверенного китайского производителя. 5W-30. Отличное соотношение цены и качества.',
  'prod-0262',
  2993,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000262?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0263',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Bosch Type',
  'Оригинальный тормозные колодки bosch type с гарантией качества. Задние. Проверено тысячами покупателей.',
  'prod-0263',
  12328,
  'RUB',
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000263?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0264',
  '00000000-0000-0000-0000-000000000000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Mobil Type 5W-30',
  'Топовый моторное масло mobil type 5w-30 по доступной цене. 10W-40. Прямые поставки с завода.',
  'prod-0264',
  6056,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000264?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0265',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Castrol Type 5W-40',
  'Качественный моторное масло castrol type 5w-40 от проверенного китайского производителя. Синтетика. Отличное соотношение цены и качества.',
  'prod-0265',
  3216,
  'RUB',
  41,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000265?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0266',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Качественный тормозные колодки ate type от проверенного китайского производителя. Керамические. Отличное соотношение цены и качества.',
  'prod-0266',
  15768,
  'RUB',
  38,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000266?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0267',
  '00000000-0000-0000-0000-000000000000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Ferodo Type',
  'Качественный тормозные колодки ferodo type от проверенного китайского производителя. Передние. Отличное соотношение цены и качества.',
  'prod-0267',
  10502,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000267?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0268',
  '00000001-0000-0000-0000-000000010000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Тормозные колодки TRW Type - популярная модель с высоким рейтингом на китайских маркетплейсах. Органические. Быстрая доставка.',
  'prod-0268',
  12682,
  'RUB',
  28,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000268?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0269',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 5W-30',
  'Топовый моторное масло shell type 5w-30 по доступной цене. Полусинтетика. Прямые поставки с завода.',
  'prod-0269',
  2972,
  'RUB',
  23,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000269?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0270',
  '00000006-0000-0000-0000-000000060000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type Синтетика',
  'Моторное масло Shell Type Синтетика - популярная модель с высоким рейтингом на китайских маркетплейсах. 10W-40. Быстрая доставка.',
  'prod-0270',
  6294,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000270?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0271',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Total Type Полусинтетика',
  'Качественный моторное масло total type полусинтетика от проверенного китайского производителя. 5W-40. Отличное соотношение цены и качества.',
  'prod-0271',
  8882,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000271?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0272',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Металлические. Прямые поставки с завода.',
  'prod-0272',
  15048,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000272?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0273',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Bosch Type',
  'Оригинальный тормозные колодки bosch type с гарантией качества. Задние. Проверено тысячами покупателей.',
  'prod-0273',
  5758,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000273?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0274',
  '00000001-0000-0000-0000-000000010000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Передние. Прямые поставки с завода.',
  'prod-0274',
  4618,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000274?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0275',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Оригинальный тормозные колодки trw type с гарантией качества. Задние. Проверено тысячами покупателей.',
  'prod-0275',
  10311,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000275?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0276',
  '00000006-0000-0000-0000-000000060000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Bosch Type',
  'Качественный тормозные колодки bosch type от проверенного китайского производителя. Керамические. Отличное соотношение цены и качества.',
  'prod-0276',
  13135,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000276?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0277',
  '00000003-0000-0000-0000-000000030000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Liqui Moly Type 5W-40',
  'Оригинальный моторное масло liqui moly type 5w-40 с гарантией качества. Синтетика. Проверено тысячами покупателей.',
  'prod-0277',
  5560,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000277?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0278',
  '00000001-0000-0000-0000-000000010000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Качественный тормозные колодки ate type от проверенного китайского производителя. Передние. Отличное соотношение цены и качества.',
  'prod-0278',
  9557,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000278?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0279',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 5W-40',
  'Качественный моторное масло shell type 5w-40 от проверенного китайского производителя. 5W-30. Отличное соотношение цены и качества.',
  'prod-0279',
  6711,
  'RUB',
  27,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000279?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0280',
  '00000001-0000-0000-0000-000000010000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Оригинальный тормозные колодки trw type с гарантией качества. Передние. Проверено тысячами покупателей.',
  'prod-0280',
  13235,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000280?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0281',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Оригинальный тормозные колодки trw type с гарантией качества. Органические. Проверено тысячами покупателей.',
  'prod-0281',
  11291,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000281?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0282',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Оригинальный тормозные колодки ate type с гарантией качества. Задние. Проверено тысячами покупателей.',
  'prod-0282',
  10836,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000282?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0283',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Задние. Прямые поставки с завода.',
  'prod-0283',
  9435,
  'RUB',
  24,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000283?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0284',
  '00000001-0000-0000-0000-000000010000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Total Type 5W-30',
  'Качественный моторное масло total type 5w-30 от проверенного китайского производителя. Синтетика. Отличное соотношение цены и качества.',
  'prod-0284',
  9446,
  'RUB',
  31,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000284?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0285',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Передние. Прямые поставки с завода.',
  'prod-0285',
  11298,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000285?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0286',
  '00000000-0000-0000-0000-000000000000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Топовый тормозные колодки ate type по доступной цене. Передние. Прямые поставки с завода.',
  'prod-0286',
  7664,
  'RUB',
  46,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000286?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0287',
  '00000003-0000-0000-0000-000000030000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 5W-40',
  'Топовый моторное масло shell type 5w-40 по доступной цене. 5W-40. Прямые поставки с завода.',
  'prod-0287',
  10103,
  'RUB',
  42,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000287?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0288',
  '00000003-0000-0000-0000-000000030000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Mobil Type Полусинтетика',
  'Оригинальный моторное масло mobil type полусинтетика с гарантией качества. Синтетика. Проверено тысячами покупателей.',
  'prod-0288',
  5649,
  'RUB',
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000288?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0289',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Liqui Moly Type 5W-40',
  'Топовый моторное масло liqui moly type 5w-40 по доступной цене. 10W-40. Прямые поставки с завода.',
  'prod-0289',
  5381,
  'RUB',
  28,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000289?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0290',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Total Type Синтетика',
  'Оригинальный моторное масло total type синтетика с гарантией качества. 10W-40. Проверено тысячами покупателей.',
  'prod-0290',
  8805,
  'RUB',
  24,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000290?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0291',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 5W-30',
  'Топовый моторное масло shell type 5w-30 по доступной цене. Полусинтетика. Прямые поставки с завода.',
  'prod-0291',
  6363,
  'RUB',
  25,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000291?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0292',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Тормозные колодки ATE Type - популярная модель с высоким рейтингом на китайских маркетплейсах. Металлические. Быстрая доставка.',
  'prod-0292',
  7100,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000292?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0293',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Castrol Type Синтетика',
  'Оригинальный моторное масло castrol type синтетика с гарантией качества. 5W-40. Проверено тысячами покупателей.',
  'prod-0293',
  6162,
  'RUB',
  37,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000293?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0294',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Тормозные колодки ATE Type - популярная модель с высоким рейтингом на китайских маркетплейсах. Керамические. Быстрая доставка.',
  'prod-0294',
  4633,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000294?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0295',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Total Type 5W-40',
  'Топовый моторное масло total type 5w-40 по доступной цене. Полусинтетика. Прямые поставки с завода.',
  'prod-0295',
  7553,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000295?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0296',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки ATE Type',
  'Топовый тормозные колодки ate type по доступной цене. Передние. Прямые поставки с завода.',
  'prod-0296',
  5408,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000296?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0297',
  '00000004-0000-0000-0000-000000040000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Качественный тормозные колодки brembo style от проверенного китайского производителя. Металлические. Отличное соотношение цены и качества.',
  'prod-0297',
  8580,
  'RUB',
  24,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000297?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0298',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Органические. Прямые поставки с завода.',
  'prod-0298',
  4168,
  'RUB',
  31,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000298?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0299',
  '00000000-0000-0000-0000-000000000000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Топовый тормозные колодки brembo style по доступной цене. Керамические. Прямые поставки с завода.',
  'prod-0299',
  10599,
  'RUB',
  49,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000299?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0300',
  '00000006-0000-0000-0000-000000060000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type Полусинтетика',
  'Качественный моторное масло shell type полусинтетика от проверенного китайского производителя. 5W-30. Отличное соотношение цены и качества.',
  'prod-0300',
  6458,
  'RUB',
  37,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000300?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0301',
  '00000006-0000-0000-0000-000000060000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Оригинальный тормозные колодки trw type с гарантией качества. Металлические. Проверено тысячами покупателей.',
  'prod-0301',
  9224,
  'RUB',
  23,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000301?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0302',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки TRW Type',
  'Тормозные колодки TRW Type - популярная модель с высоким рейтингом на китайских маркетплейсах. Органические. Быстрая доставка.',
  'prod-0302',
  17128,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000302?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0303',
  '00000003-0000-0000-0000-000000030000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Mobil Type Синтетика',
  'Моторное масло Mobil Type Синтетика - популярная модель с высоким рейтингом на китайских маркетплейсах. 5W-30. Быстрая доставка.',
  'prod-0303',
  7497,
  'RUB',
  22,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000303?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0304',
  '00000002-0000-0000-0000-000000020000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Brembo Style',
  'Качественный тормозные колодки brembo style от проверенного китайского производителя. Органические. Отличное соотношение цены и качества.',
  'prod-0304',
  7552,
  'RUB',
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000304?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 300/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0305',
  '00000000-0000-0000-0000-000000000000',
  '00000068-0000-0000-0000-000000680000',
  'Тормозные колодки Bosch Type',
  'Тормозные колодки Bosch Type - популярная модель с высоким рейтингом на китайских маркетплейсах. Задние. Быстрая доставка.',
  'prod-0305',
  4223,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000305?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Передние","spec_2":"Задние","spec_3":"Керамические"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0306',
  '00000006-0000-0000-0000-000000060000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Castrol Type Полусинтетика',
  'Качественный моторное масло castrol type полусинтетика от проверенного китайского производителя. 5W-30. Отличное соотношение цены и качества.',
  'prod-0306',
  3732,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000306?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0307',
  '00000007-0000-0000-0000-000000070000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 10W-40',
  'Качественный моторное масло shell type 10w-40 от проверенного китайского производителя. Синтетика. Отличное соотношение цены и качества.',
  'prod-0307',
  9736,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000307?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0308',
  '00000005-0000-0000-0000-000000050000',
  '00000068-0000-0000-0000-000000680000',
  'Моторное масло Shell Type 5W-40',
  'Топовый моторное масло shell type 5w-40 по доступной цене. Синтетика. Прямые поставки с завода.',
  'prod-0308',
  6860,
  'RUB',
  47,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000308?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"5W-30","spec_2":"5W-40","spec_3":"10W-40"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0309',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Антипригарное',
  'Набор посуды KitchenPro Антипригарное - популярная модель с высоким рейтингом на китайских маркетплейсах. Антипригарное. Быстрая доставка.',
  'prod-0309',
  11756,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000309?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0310',
  '00000001-0000-0000-0000-000000010000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Стекло',
  'Топовый набор посуды diningelite стекло по доступной цене. Стекло. Прямые поставки с завода.',
  'prod-0310',
  16997,
  'RUB',
  49,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000310?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0311',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Керамика',
  'Топовый набор посуды kitchenpro керамика по доступной цене. Набор. Прямые поставки с завода.',
  'prod-0311',
  6658,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000311?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0312',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Керамика',
  'Топовый набор посуды kitchenpro керамика по доступной цене. Керамика. Прямые поставки с завода.',
  'prod-0312',
  4513,
  'RUB',
  37,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000312?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0313',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Стекло',
  'Топовый набор посуды cookmaster стекло по доступной цене. Набор. Прямые поставки с завода.',
  'prod-0313',
  19091,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000313?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0314',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Керамика',
  'Набор посуды CookMaster Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Стекло. Быстрая доставка.',
  'prod-0314',
  11253,
  'RUB',
  48,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000314?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0315',
  '00000005-0000-0000-0000-000000050000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Стекло',
  'Качественный набор посуды tableart стекло от проверенного китайского производителя. Стекло. Отличное соотношение цены и качества.',
  'prod-0315',
  20505,
  'RUB',
  43,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000315?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0316',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Стекло',
  'Оригинальный набор посуды cookmaster стекло с гарантией качества. Керамика. Проверено тысячами покупателей.',
  'prod-0316',
  9357,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000316?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0317',
  '00000005-0000-0000-0000-000000050000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Антипригарное',
  'Оригинальный набор посуды tableart антипригарное с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0317',
  8719,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000317?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0318',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Керамика',
  'Оригинальный набор посуды diningelite керамика с гарантией качества. Керамика. Проверено тысячами покупателей.',
  'prod-0318',
  7034,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000318?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0319',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Набор',
  'Оригинальный набор посуды diningelite набор с гарантией качества. Стекло. Проверено тысячами покупателей.',
  'prod-0319',
  19013,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000319?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0320',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Нержавеющая сталь',
  'Набор посуды TableArt Нержавеющая сталь - популярная модель с высоким рейтингом на китайских маркетплейсах. Стекло. Быстрая доставка.',
  'prod-0320',
  9524,
  'RUB',
  30,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000320?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0321',
  '00000005-0000-0000-0000-000000050000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Качественный набор посуды kitchenpro набор от проверенного китайского производителя. Стекло. Отличное соотношение цены и качества.',
  'prod-0321',
  20655,
  'RUB',
  24,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000321?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0322',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Керамика',
  'Набор посуды CookMaster Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Антипригарное. Быстрая доставка.',
  'prod-0322',
  10216,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000322?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0323',
  '00000000-0000-0000-0000-000000000000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Набор',
  'Набор посуды CookMaster Набор - популярная модель с высоким рейтингом на китайских маркетплейсах. Набор. Быстрая доставка.',
  'prod-0323',
  17411,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000323?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0324',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Оригинальный набор посуды kitchenpro набор с гарантией качества. Керамика. Проверено тысячами покупателей.',
  'prod-0324',
  19660,
  'RUB',
  17,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000324?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0325',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Стекло',
  'Набор посуды DiningElite Стекло - популярная модель с высоким рейтингом на китайских маркетплейсах. Набор. Быстрая доставка.',
  'prod-0325',
  19241,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000325?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0326',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Стекло',
  'Топовый набор посуды kitchenpro стекло по доступной цене. Набор. Прямые поставки с завода.',
  'prod-0326',
  15912,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000326?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0327',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Набор',
  'Оригинальный набор посуды tableart набор с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0327',
  14457,
  'RUB',
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000327?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0328',
  '00000000-0000-0000-0000-000000000000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Керамика',
  'Качественный набор посуды kitchenpro керамика от проверенного китайского производителя. Нержавеющая сталь. Отличное соотношение цены и качества.',
  'prod-0328',
  16998,
  'RUB',
  37,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000328?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0329',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды HomeChef Стекло',
  'Набор посуды HomeChef Стекло - популярная модель с высоким рейтингом на китайских маркетплейсах. Нержавеющая сталь. Быстрая доставка.',
  'prod-0329',
  21577,
  'RUB',
  50,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000329?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0330',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Керамика',
  'Набор посуды TableArt Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Керамика. Быстрая доставка.',
  'prod-0330',
  18940,
  'RUB',
  39,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000330?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0331',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Керамика',
  'Качественный набор посуды cookmaster керамика от проверенного китайского производителя. Антипригарное. Отличное соотношение цены и качества.',
  'prod-0331',
  14435,
  'RUB',
  18,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000331?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0332',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Антипригарное',
  'Набор посуды KitchenPro Антипригарное - популярная модель с высоким рейтингом на китайских маркетплейсах. Антипригарное. Быстрая доставка.',
  'prod-0332',
  8928,
  'RUB',
  31,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000332?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0333',
  '00000005-0000-0000-0000-000000050000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Набор',
  'Набор посуды TableArt Набор - популярная модель с высоким рейтингом на китайских маркетплейсах. Керамика. Быстрая доставка.',
  'prod-0333',
  16305,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000333?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0334',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Нержавеющая сталь',
  'Набор посуды CookMaster Нержавеющая сталь - популярная модель с высоким рейтингом на китайских маркетплейсах. Керамика. Быстрая доставка.',
  'prod-0334',
  7322,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000334?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0335',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Стекло',
  'Оригинальный набор посуды cookmaster стекло с гарантией качества. Стекло. Проверено тысячами покупателей.',
  'prod-0335',
  20463,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000335?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0336',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды HomeChef Керамика',
  'Набор посуды HomeChef Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Нержавеющая сталь. Быстрая доставка.',
  'prod-0336',
  13787,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000336?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0337',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Керамика',
  'Набор посуды TableArt Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Стекло. Быстрая доставка.',
  'prod-0337',
  12328,
  'RUB',
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000337?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0338',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Качественный набор посуды kitchenpro набор от проверенного китайского производителя. Нержавеющая сталь. Отличное соотношение цены и качества.',
  'prod-0338',
  18871,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000338?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0339',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Стекло',
  'Качественный набор посуды cookmaster стекло от проверенного китайского производителя. Антипригарное. Отличное соотношение цены и качества.',
  'prod-0339',
  20410,
  'RUB',
  38,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000339?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0340',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Керамика',
  'Оригинальный набор посуды diningelite керамика с гарантией качества. Керамика. Проверено тысячами покупателей.',
  'prod-0340',
  8246,
  'RUB',
  25,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000340?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0341',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Стекло',
  'Оригинальный набор посуды cookmaster стекло с гарантией качества. Нержавеющая сталь. Проверено тысячами покупателей.',
  'prod-0341',
  13843,
  'RUB',
  41,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000341?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0342',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Нержавеющая сталь',
  'Качественный набор посуды kitchenpro нержавеющая сталь от проверенного китайского производителя. Антипригарное. Отличное соотношение цены и качества.',
  'prod-0342',
  21056,
  'RUB',
  31,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000342?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0343',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Набор посуды KitchenPro Набор - популярная модель с высоким рейтингом на китайских маркетплейсах. Антипригарное. Быстрая доставка.',
  'prod-0343',
  4502,
  'RUB',
  11,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000343?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0344',
  '00000005-0000-0000-0000-000000050000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Набор',
  'Оригинальный набор посуды tableart набор с гарантией качества. Керамика. Проверено тысячами покупателей.',
  'prod-0344',
  5951,
  'RUB',
  31,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000344?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0345',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Антипригарное',
  'Качественный набор посуды kitchenpro антипригарное от проверенного китайского производителя. Керамика. Отличное соотношение цены и качества.',
  'prod-0345',
  16734,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000345?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0346',
  '00000000-0000-0000-0000-000000000000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Антипригарное',
  'Топовый набор посуды tableart антипригарное по доступной цене. Нержавеющая сталь. Прямые поставки с завода.',
  'prod-0346',
  10852,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000346?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0347',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Керамика',
  'Оригинальный набор посуды kitchenpro керамика с гарантией качества. Стекло. Проверено тысячами покупателей.',
  'prod-0347',
  21779,
  'RUB',
  13,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000347?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0348',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Керамика',
  'Оригинальный набор посуды tableart керамика с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0348',
  5855,
  'RUB',
  14,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000348?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0349',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Набор',
  'Оригинальный набор посуды diningelite набор с гарантией качества. Стекло. Проверено тысячами покупателей.',
  'prod-0349',
  6345,
  'RUB',
  34,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000349?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0350',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Керамика',
  'Оригинальный набор посуды cookmaster керамика с гарантией качества. Стекло. Проверено тысячами покупателей.',
  'prod-0350',
  17694,
  'RUB',
  10,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000350?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0351',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Нержавеющая сталь',
  'Топовый набор посуды tableart нержавеющая сталь по доступной цене. Керамика. Прямые поставки с завода.',
  'prod-0351',
  24085,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000351?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0352',
  '00000001-0000-0000-0000-000000010000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды DiningElite Стекло',
  'Качественный набор посуды diningelite стекло от проверенного китайского производителя. Нержавеющая сталь. Отличное соотношение цены и качества.',
  'prod-0352',
  17376,
  'RUB',
  39,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000352?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0353',
  '00000001-0000-0000-0000-000000010000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Антипригарное',
  'Набор посуды TableArt Антипригарное - популярная модель с высоким рейтингом на китайских маркетплейсах. Набор. Быстрая доставка.',
  'prod-0353',
  9582,
  'RUB',
  23,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000353?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0354',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Нержавеющая сталь',
  'Топовый набор посуды tableart нержавеющая сталь по доступной цене. Набор. Прямые поставки с завода.',
  'prod-0354',
  23097,
  'RUB',
  46,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000354?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 350/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0355',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Стекло',
  'Качественный набор посуды tableart стекло от проверенного китайского производителя. Керамика. Отличное соотношение цены и качества.',
  'prod-0355',
  6466,
  'RUB',
  10,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000355?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0356',
  '00000007-0000-0000-0000-000000070000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Антипригарное',
  'Топовый набор посуды kitchenpro антипригарное по доступной цене. Нержавеющая сталь. Прямые поставки с завода.',
  'prod-0356',
  7602,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000356?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0357',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Качественный набор посуды kitchenpro набор от проверенного китайского производителя. Антипригарное. Отличное соотношение цены и качества.',
  'prod-0357',
  5132,
  'RUB',
  27,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000357?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0358',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Антипригарное',
  'Набор посуды TableArt Антипригарное - популярная модель с высоким рейтингом на китайских маркетплейсах. Антипригарное. Быстрая доставка.',
  'prod-0358',
  7221,
  'RUB',
  36,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000358?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0359',
  '00000006-0000-0000-0000-000000060000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды CookMaster Набор',
  'Качественный набор посуды cookmaster набор от проверенного китайского производителя. Стекло. Отличное соотношение цены и качества.',
  'prod-0359',
  12373,
  'RUB',
  19,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000359?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0360',
  '00000003-0000-0000-0000-000000030000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды HomeChef Нержавеющая сталь',
  'Оригинальный набор посуды homechef нержавеющая сталь с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0360',
  20401,
  'RUB',
  12,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000360?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0361',
  '00000002-0000-0000-0000-000000020000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Керамика',
  'Набор посуды TableArt Керамика - популярная модель с высоким рейтингом на китайских маркетплейсах. Нержавеющая сталь. Быстрая доставка.',
  'prod-0361',
  19961,
  'RUB',
  46,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000361?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0362',
  '00000001-0000-0000-0000-000000010000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Набор',
  'Топовый набор посуды tableart набор по доступной цене. Антипригарное. Прямые поставки с завода.',
  'prod-0362',
  17244,
  'RUB',
  32,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000362?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0363',
  '00000000-0000-0000-0000-000000000000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды TableArt Керамика',
  'Качественный набор посуды tableart керамика от проверенного китайского производителя. Набор. Отличное соотношение цены и качества.',
  'prod-0363',
  10156,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000363?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0364',
  '00000000-0000-0000-0000-000000000000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды KitchenPro Набор',
  'Топовый набор посуды kitchenpro набор по доступной цене. Нержавеющая сталь. Прямые поставки с завода.',
  'prod-0364',
  27524,
  'RUB',
  48,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000364?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0365',
  '00000004-0000-0000-0000-000000040000',
  '00000069-0000-0000-0000-000000690000',
  'Набор посуды HomeChef Набор',
  'Топовый набор посуды homechef набор по доступной цене. Антипригарное. Прямые поставки с завода.',
  'prod-0365',
  16498,
  'RUB',
  41,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000365?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Нержавеющая сталь","spec_2":"Керамика","spec_3":"Стекло"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0366',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Городской',
  'Качественный велосипед mountain king городской от проверенного китайского производителя. Горный. Отличное соотношение цены и качества.',
  'prod-0366',
  68214,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000366?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0367',
  '00000006-0000-0000-0000-000000060000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Набор',
  'Гантели HomeFit Набор - популярная модель с высоким рейтингом на китайских маркетплейсах. Хром. Быстрая доставка.',
  'prod-0367',
  8213,
  'RUB',
  21,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000367?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0368',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Trail Boss Городской',
  'Топовый велосипед trail boss городской по доступной цене. Шоссейный. Прямые поставки с завода.',
  'prod-0368',
  158020,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000368?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0369',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Speed Master Алюминиевая рама',
  'Топовый велосипед speed master алюминиевая рама по доступной цене. Шоссейный. Прямые поставки с завода.',
  'prod-0369',
  62054,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000369?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0370',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Городской',
  'Качественный велосипед mountain king городской от проверенного китайского производителя. Городской. Отличное соотношение цены и качества.',
  'prod-0370',
  132885,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000370?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0371',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели PowerGym Неопрен',
  'Качественный гантели powergym неопрен от проверенного китайского производителя. Хром. Отличное соотношение цены и качества.',
  'prod-0371',
  7077,
  'RUB',
  48,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000371?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0372',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Bike Pro Складной',
  'Оригинальный велосипед bike pro складной с гарантией качества. Шоссейный. Проверено тысячами покупателей.',
  'prod-0372',
  108544,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000372?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0373',
  '00000003-0000-0000-0000-000000030000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Городской',
  'Топовый велосипед mountain king городской по доступной цене. Городской. Прямые поставки с завода.',
  'prod-0373',
  122673,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000373?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0374',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели PowerGym Регулируемые',
  'Оригинальный гантели powergym регулируемые с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0374',
  11520,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000374?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0375',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели IronForce Хром',
  'Гантели IronForce Хром - популярная модель с высоким рейтингом на китайских маркетплейсах. Набор. Быстрая доставка.',
  'prod-0375',
  2714,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000375?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0376',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели IronForce Набор',
  'Оригинальный гантели ironforce набор с гарантией качества. Разборные. Проверено тысячами покупателей.',
  'prod-0376',
  11111,
  'RUB',
  28,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000376?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0377',
  '00000003-0000-0000-0000-000000030000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Регулируемые',
  'Топовый гантели homefit регулируемые по доступной цене. Хром. Прямые поставки с завода.',
  'prod-0377',
  8932,
  'RUB',
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000377?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0378',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели FitPro Регулируемые',
  'Топовый гантели fitpro регулируемые по доступной цене. Регулируемые. Прямые поставки с завода.',
  'prod-0378',
  5543,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000378?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0379',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед City Rider Складной',
  'Велосипед City Rider Складной - популярная модель с высоким рейтингом на китайских маркетплейсах. Горный. Быстрая доставка.',
  'prod-0379',
  118359,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000379?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0380',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели PowerGym Неопрен',
  'Качественный гантели powergym неопрен от проверенного китайского производителя. Хром. Отличное соотношение цены и качества.',
  'prod-0380',
  5540,
  'RUB',
  42,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000380?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0381',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели MuscleMaster Набор',
  'Оригинальный гантели musclemaster набор с гарантией качества. Хром. Проверено тысячами покупателей.',
  'prod-0381',
  5515,
  'RUB',
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000381?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0382',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели MuscleMaster Хром',
  'Качественный гантели musclemaster хром от проверенного китайского производителя. Регулируемые. Отличное соотношение цены и качества.',
  'prod-0382',
  2205,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000382?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0383',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Trail Boss Шоссейный',
  'Топовый велосипед trail boss шоссейный по доступной цене. Алюминиевая рама. Прямые поставки с завода.',
  'prod-0383',
  73825,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000383?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0384',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Неопрен',
  'Топовый гантели homefit неопрен по доступной цене. Неопрен. Прямые поставки с завода.',
  'prod-0384',
  10480,
  'RUB',
  44,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000384?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0385',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед City Rider Шоссейный',
  'Топовый велосипед city rider шоссейный по доступной цене. Шоссейный. Прямые поставки с завода.',
  'prod-0385',
  142588,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000385?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0386',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели FitPro Набор',
  'Оригинальный гантели fitpro набор с гарантией качества. Хром. Проверено тысячами покупателей.',
  'prod-0386',
  13037,
  'RUB',
  29,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000386?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0387',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Bike Pro Горный',
  'Оригинальный велосипед bike pro горный с гарантией качества. Алюминиевая рама. Проверено тысячами покупателей.',
  'prod-0387',
  114783,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000387?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0388',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Trail Boss Складной',
  'Велосипед Trail Boss Складной - популярная модель с высоким рейтингом на китайских маркетплейсах. Алюминиевая рама. Быстрая доставка.',
  'prod-0388',
  154502,
  'RUB',
  1,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000388?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0389',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Bike Pro Городской',
  'Качественный велосипед bike pro городской от проверенного китайского производителя. Алюминиевая рама. Отличное соотношение цены и качества.',
  'prod-0389',
  219921,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000389?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0390',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели MuscleMaster Неопрен',
  'Гантели MuscleMaster Неопрен - популярная модель с высоким рейтингом на китайских маркетплейсах. Регулируемые. Быстрая доставка.',
  'prod-0390',
  5297,
  'RUB',
  42,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000390?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0391',
  '00000004-0000-0000-0000-000000040000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Speed Master Горный',
  'Велосипед Speed Master Горный - популярная модель с высоким рейтингом на китайских маркетплейсах. Шоссейный. Быстрая доставка.',
  'prod-0391',
  67336,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000391?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0392',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели MuscleMaster Регулируемые',
  'Качественный гантели musclemaster регулируемые от проверенного китайского производителя. Хром. Отличное соотношение цены и качества.',
  'prod-0392',
  10413,
  'RUB',
  33,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000392?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0393',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Speed Master Складной',
  'Оригинальный велосипед speed master складной с гарантией качества. Городской. Проверено тысячами покупателей.',
  'prod-0393',
  60622,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000393?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0394',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Bike Pro Горный',
  'Оригинальный велосипед bike pro горный с гарантией качества. Городской. Проверено тысячами покупателей.',
  'prod-0394',
  121629,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000394?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0395',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели PowerGym Хром',
  'Оригинальный гантели powergym хром с гарантией качества. Регулируемые. Проверено тысячами покупателей.',
  'prod-0395',
  3177,
  'RUB',
  12,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000395?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0396',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Набор',
  'Топовый гантели homefit набор по доступной цене. Хром. Прямые поставки с завода.',
  'prod-0396',
  2766,
  'RUB',
  31,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000396?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0397',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Городской',
  'Оригинальный велосипед mountain king городской с гарантией качества. Складной. Проверено тысячами покупателей.',
  'prod-0397',
  61744,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000397?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0398',
  '00000002-0000-0000-0000-000000020000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Горный',
  'Качественный велосипед mountain king горный от проверенного китайского производителя. Алюминиевая рама. Отличное соотношение цены и качества.',
  'prod-0398',
  91338,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000398?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0399',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели FitPro Хром',
  'Топовый гантели fitpro хром по доступной цене. Разборные. Прямые поставки с завода.',
  'prod-0399',
  10004,
  'RUB',
  43,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000399?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0400',
  '00000006-0000-0000-0000-000000060000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Разборные',
  'Оригинальный гантели homefit разборные с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0400',
  9709,
  'RUB',
  40,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000400?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0401',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели HomeFit Разборные',
  'Оригинальный гантели homefit разборные с гарантией качества. Набор. Проверено тысячами покупателей.',
  'prod-0401',
  8424,
  'RUB',
  32,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000401?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0402',
  '00000003-0000-0000-0000-000000030000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Bike Pro Шоссейный',
  'Топовый велосипед bike pro шоссейный по доступной цене. Складной. Прямые поставки с завода.',
  'prod-0402',
  141863,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000402?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0403',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели IronForce Разборные',
  'Качественный гантели ironforce разборные от проверенного китайского производителя. Хром. Отличное соотношение цены и качества.',
  'prod-0403',
  11658,
  'RUB',
  17,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000403?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0404',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели IronForce Хром',
  'Топовый гантели ironforce хром по доступной цене. Неопрен. Прямые поставки с завода.',
  'prod-0404',
  5041,
  'RUB',
  48,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000404?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 400/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0405',
  '00000000-0000-0000-0000-000000000000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед City Rider Шоссейный',
  'Оригинальный велосипед city rider шоссейный с гарантией качества. Городской. Проверено тысячами покупателей.',
  'prod-0405',
  175230,
  'RUB',
  1,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000405?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0406',
  '00000005-0000-0000-0000-000000050000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Trail Boss Горный',
  'Оригинальный велосипед trail boss горный с гарантией качества. Городской. Проверено тысячами покупателей.',
  'prod-0406',
  60390,
  'RUB',
  2,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000406?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0407',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Trail Boss Шоссейный',
  'Топовый велосипед trail boss шоссейный по доступной цене. Складной. Прямые поставки с завода.',
  'prod-0407',
  83717,
  'RUB',
  5,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000407?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0408',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед City Rider Алюминиевая рама',
  'Топовый велосипед city rider алюминиевая рама по доступной цене. Складной. Прямые поставки с завода.',
  'prod-0408',
  85636,
  'RUB',
  4,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000408?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0409',
  '00000007-0000-0000-0000-000000070000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Гантели PowerGym Разборные',
  'Гантели PowerGym Разборные - популярная модель с высоким рейтингом на китайских маркетплейсах. Неопрен. Быстрая доставка.',
  'prod-0409',
  8529,
  'RUB',
  26,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000409?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Разборные","spec_2":"Неопрен","spec_3":"Хром"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0410',
  '00000001-0000-0000-0000-000000010000',
  '0000006a-0000-0000-0000-0000006a0000',
  'Велосипед Mountain King Алюминиевая рама',
  'Топовый велосипед mountain king алюминиевая рама по доступной цене. Горный. Прямые поставки с завода.',
  'prod-0410',
  77800,
  'RUB',
  3,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000410?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Горный","spec_2":"Городской","spec_3":"Складной"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0411',
  '00000005-0000-0000-0000-000000050000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Увлажняющий',
  'Крем для лица DermaLine Увлажняющий - популярная модель с высоким рейтингом на китайских маркетплейсах. SPF защита. Быстрая доставка.',
  'prod-0411',
  2659,
  'RUB',
  71,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000411?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0412',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow SPF защита',
  'Крем для лица Natural Glow SPF защита - популярная модель с высоким рейтингом на китайских маркетплейсах. Увлажняющий. Быстрая доставка.',
  'prod-0412',
  5655,
  'RUB',
  167,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000412?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0413',
  '00000001-0000-0000-0000-000000010000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Для сухой кожи',
  'Крем для лица Natural Glow Для сухой кожи - популярная модель с высоким рейтингом на китайских маркетплейсах. Для сухой кожи. Быстрая доставка.',
  'prod-0413',
  5496,
  'RUB',
  180,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000413?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0414',
  '00000002-0000-0000-0000-000000020000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Натуральный',
  'Качественный крем для лица dermaline натуральный от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0414',
  3909,
  'RUB',
  65,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000414?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0415',
  '00000001-0000-0000-0000-000000010000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Антивозрастной',
  'Топовый крем для лица skincare pro антивозрастной по доступной цене. Увлажняющий. Прямые поставки с завода.',
  'prod-0415',
  2662,
  'RUB',
  81,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000415?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0416',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Натуральный',
  'Крем для лица Natural Glow Натуральный - популярная модель с высоким рейтингом на китайских маркетплейсах. Антивозрастной. Быстрая доставка.',
  'prod-0416',
  1660,
  'RUB',
  51,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000416?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0417',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux Для сухой кожи',
  'Качественный крем для лица beautylux для сухой кожи от проверенного китайского производителя. Для сухой кожи. Отличное соотношение цены и качества.',
  'prod-0417',
  5577,
  'RUB',
  169,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000417?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0418',
  '00000002-0000-0000-0000-000000020000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty SPF защита',
  'Качественный крем для лица purebeauty spf защита от проверенного китайского производителя. Антивозрастной. Отличное соотношение цены и качества.',
  'prod-0418',
  5079,
  'RUB',
  200,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000418?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0419',
  '00000000-0000-0000-0000-000000000000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Увлажняющий',
  'Крем для лица PureBeauty Увлажняющий - популярная модель с высоким рейтингом на китайских маркетплейсах. Увлажняющий. Быстрая доставка.',
  'prod-0419',
  7475,
  'RUB',
  93,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000419?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0420',
  '00000002-0000-0000-0000-000000020000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow SPF защита',
  'Качественный крем для лица natural glow spf защита от проверенного китайского производителя. SPF защита. Отличное соотношение цены и качества.',
  'prod-0420',
  6334,
  'RUB',
  79,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000420?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0421',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux SPF защита',
  'Оригинальный крем для лица beautylux spf защита с гарантией качества. Антивозрастной. Проверено тысячами покупателей.',
  'prod-0421',
  6529,
  'RUB',
  77,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000421?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0422',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Увлажняющий',
  'Крем для лица SkinCare Pro Увлажняющий - популярная модель с высоким рейтингом на китайских маркетплейсах. SPF защита. Быстрая доставка.',
  'prod-0422',
  3674,
  'RUB',
  96,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000422?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0423',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Увлажняющий',
  'Качественный крем для лица natural glow увлажняющий от проверенного китайского производителя. Антивозрастной. Отличное соотношение цены и качества.',
  'prod-0423',
  5824,
  'RUB',
  179,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000423?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0424',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Антивозрастной',
  'Топовый крем для лица purebeauty антивозрастной по доступной цене. SPF защита. Прямые поставки с завода.',
  'prod-0424',
  6964,
  'RUB',
  180,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000424?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0425',
  '00000000-0000-0000-0000-000000000000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Для сухой кожи',
  'Топовый крем для лица natural glow для сухой кожи по доступной цене. Для сухой кожи. Прямые поставки с завода.',
  'prod-0425',
  3018,
  'RUB',
  185,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000425?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0426',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Увлажняющий',
  'Оригинальный крем для лица natural glow увлажняющий с гарантией качества. Натуральный. Проверено тысячами покупателей.',
  'prod-0426',
  8761,
  'RUB',
  94,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000426?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0427',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux SPF защита',
  'Оригинальный крем для лица beautylux spf защита с гарантией качества. Антивозрастной. Проверено тысячами покупателей.',
  'prod-0427',
  5026,
  'RUB',
  192,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000427?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0428',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Натуральный',
  'Качественный крем для лица dermaline натуральный от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0428',
  5587,
  'RUB',
  136,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000428?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0429',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Антивозрастной',
  'Качественный крем для лица purebeauty антивозрастной от проверенного китайского производителя. Увлажняющий. Отличное соотношение цены и качества.',
  'prod-0429',
  4877,
  'RUB',
  167,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000429?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0430',
  '00000002-0000-0000-0000-000000020000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro SPF защита',
  'Оригинальный крем для лица skincare pro spf защита с гарантией качества. Антивозрастной. Проверено тысячами покупателей.',
  'prod-0430',
  2808,
  'RUB',
  130,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000430?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0431',
  '00000000-0000-0000-0000-000000000000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro SPF защита',
  'Оригинальный крем для лица skincare pro spf защита с гарантией качества. Увлажняющий. Проверено тысячами покупателей.',
  'prod-0431',
  6803,
  'RUB',
  62,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000431?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0432',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Натуральный',
  'Оригинальный крем для лица natural glow натуральный с гарантией качества. Для сухой кожи. Проверено тысячами покупателей.',
  'prod-0432',
  3874,
  'RUB',
  184,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000432?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0433',
  '00000005-0000-0000-0000-000000050000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Для сухой кожи',
  'Качественный крем для лица skincare pro для сухой кожи от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0433',
  9458,
  'RUB',
  157,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000433?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0434',
  '00000003-0000-0000-0000-000000030000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Для сухой кожи',
  'Качественный крем для лица purebeauty для сухой кожи от проверенного китайского производителя. Для сухой кожи. Отличное соотношение цены и качества.',
  'prod-0434',
  3362,
  'RUB',
  101,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000434?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0435',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Для сухой кожи',
  'Топовый крем для лица skincare pro для сухой кожи по доступной цене. Увлажняющий. Прямые поставки с завода.',
  'prod-0435',
  6898,
  'RUB',
  88,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000435?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0436',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Увлажняющий',
  'Оригинальный крем для лица skincare pro увлажняющий с гарантией качества. Натуральный. Проверено тысячами покупателей.',
  'prod-0436',
  4339,
  'RUB',
  140,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000436?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0437',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Для сухой кожи',
  'Топовый крем для лица purebeauty для сухой кожи по доступной цене. SPF защита. Прямые поставки с завода.',
  'prod-0437',
  5733,
  'RUB',
  195,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000437?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0438',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux Для сухой кожи',
  'Оригинальный крем для лица beautylux для сухой кожи с гарантией качества. Увлажняющий. Проверено тысячами покупателей.',
  'prod-0438',
  2343,
  'RUB',
  164,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000438?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0439',
  '00000003-0000-0000-0000-000000030000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Увлажняющий',
  'Качественный крем для лица skincare pro увлажняющий от проверенного китайского производителя. SPF защита. Отличное соотношение цены и качества.',
  'prod-0439',
  1507,
  'RUB',
  56,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000439?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0440',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Для сухой кожи',
  'Крем для лица DermaLine Для сухой кожи - популярная модель с высоким рейтингом на китайских маркетплейсах. Натуральный. Быстрая доставка.',
  'prod-0440',
  4597,
  'RUB',
  176,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000440?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0441',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Натуральный',
  'Оригинальный крем для лица skincare pro натуральный с гарантией качества. Натуральный. Проверено тысячами покупателей.',
  'prod-0441',
  8718,
  'RUB',
  172,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000441?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0442',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Увлажняющий',
  'Оригинальный крем для лица purebeauty увлажняющий с гарантией качества. Для сухой кожи. Проверено тысячами покупателей.',
  'prod-0442',
  3806,
  'RUB',
  89,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000442?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0443',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Увлажняющий',
  'Крем для лица Natural Glow Увлажняющий - популярная модель с высоким рейтингом на китайских маркетплейсах. SPF защита. Быстрая доставка.',
  'prod-0443',
  7753,
  'RUB',
  195,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000443?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0444',
  '00000006-0000-0000-0000-000000060000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Увлажняющий',
  'Оригинальный крем для лица natural glow увлажняющий с гарантией качества. Увлажняющий. Проверено тысячами покупателей.',
  'prod-0444',
  5681,
  'RUB',
  82,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000444?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0445',
  '00000003-0000-0000-0000-000000030000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Для сухой кожи',
  'Качественный крем для лица dermaline для сухой кожи от проверенного китайского производителя. SPF защита. Отличное соотношение цены и качества.',
  'prod-0445',
  3112,
  'RUB',
  53,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000445?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0446',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Антивозрастной',
  'Оригинальный крем для лица natural glow антивозрастной с гарантией качества. SPF защита. Проверено тысячами покупателей.',
  'prod-0446',
  5925,
  'RUB',
  105,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000446?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0447',
  '00000003-0000-0000-0000-000000030000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow SPF защита',
  'Крем для лица Natural Glow SPF защита - популярная модель с высоким рейтингом на китайских маркетплейсах. Увлажняющий. Быстрая доставка.',
  'prod-0447',
  9795,
  'RUB',
  98,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000447?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0448',
  '00000001-0000-0000-0000-000000010000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Антивозрастной',
  'Топовый крем для лица natural glow антивозрастной по доступной цене. Натуральный. Прямые поставки с завода.',
  'prod-0448',
  2523,
  'RUB',
  180,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000448?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0449',
  '00000000-0000-0000-0000-000000000000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux Натуральный',
  'Топовый крем для лица beautylux натуральный по доступной цене. Увлажняющий. Прямые поставки с завода.',
  'prod-0449',
  3981,
  'RUB',
  72,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000449?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0450',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine SPF защита',
  'Качественный крем для лица dermaline spf защита от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0450',
  3508,
  'RUB',
  179,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000450?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0451',
  '00000000-0000-0000-0000-000000000000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица Natural Glow Для сухой кожи',
  'Качественный крем для лица natural glow для сухой кожи от проверенного китайского производителя. SPF защита. Отличное соотношение цены и качества.',
  'prod-0451',
  8158,
  'RUB',
  75,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000451?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0452',
  '00000005-0000-0000-0000-000000050000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Антивозрастной',
  'Топовый крем для лица dermaline антивозрастной по доступной цене. Для сухой кожи. Прямые поставки с завода.',
  'prod-0452',
  4316,
  'RUB',
  195,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000452?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0453',
  '00000003-0000-0000-0000-000000030000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица DermaLine Натуральный',
  'Качественный крем для лица dermaline натуральный от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0453',
  10781,
  'RUB',
  148,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000453?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0454',
  '00000001-0000-0000-0000-000000010000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux Натуральный',
  'Оригинальный крем для лица beautylux натуральный с гарантией качества. SPF защита. Проверено тысячами покупателей.',
  'prod-0454',
  3321,
  'RUB',
  123,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000454?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- Прогресс: 450/455 товаров

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0455',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Антивозрастной',
  'Крем для лица PureBeauty Антивозрастной - популярная модель с высоким рейтингом на китайских маркетплейсах. Для сухой кожи. Быстрая доставка.',
  'prod-0455',
  4947,
  'RUB',
  111,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000455?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0456',
  '00000005-0000-0000-0000-000000050000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Антивозрастной',
  'Крем для лица PureBeauty Антивозрастной - популярная модель с высоким рейтингом на китайских маркетплейсах. Увлажняющий. Быстрая доставка.',
  'prod-0456',
  7465,
  'RUB',
  139,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000456?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0457',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица SkinCare Pro Для сухой кожи',
  'Качественный крем для лица skincare pro для сухой кожи от проверенного китайского производителя. Натуральный. Отличное соотношение цены и качества.',
  'prod-0457',
  7313,
  'RUB',
  111,
  false,
  ARRAY['https://images.unsplash.com/photo-1500000000457?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0458',
  '00000004-0000-0000-0000-000000040000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица BeautyLux Увлажняющий',
  'Крем для лица BeautyLux Увлажняющий - популярная модель с высоким рейтингом на китайских маркетплейсах. Для сухой кожи. Быстрая доставка.',
  'prod-0458',
  5385,
  'RUB',
  137,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000458?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  'prod-0459',
  '00000007-0000-0000-0000-000000070000',
  '0000006b-0000-0000-0000-0000006b0000',
  'Крем для лица PureBeauty Увлажняющий',
  'Качественный крем для лица purebeauty увлажняющий от проверенного китайского производителя. Увлажняющий. Отличное соотношение цены и качества.',
  'prod-0459',
  3744,
  'RUB',
  68,
  true,
  ARRAY['https://images.unsplash.com/photo-1500000000459?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  '{"spec_1":"Увлажняющий","spec_2":"Антивозрастной","spec_3":"Для сухой кожи"}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

-- ====================
-- ГОТОВО!
-- ====================

-- Обновление счетчиков товаров в категориях
UPDATE categories c SET product_count = (
  SELECT COUNT(*) FROM products p WHERE p.category_id = c.id
);

-- Статистика
SELECT
  'Поставщиков' as type, COUNT(*)::text as count FROM suppliers
UNION ALL
SELECT
  'Категорий', COUNT(*)::text FROM categories WHERE level = 1
UNION ALL
SELECT
  'Подкатегорий', COUNT(*)::text FROM categories WHERE level = 2
UNION ALL
SELECT
  'Товаров', COUNT(*)::text FROM products;
