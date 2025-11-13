/**
 * Скрипт для импорта сгенерированного каталога в Supabase
 *
 * Использование:
 * 1. Запустить: npx tsx scripts/import-catalog-to-db.ts
 * 2. Или создать SQL файл: npx tsx scripts/import-catalog-to-db.ts --sql-only
 */

import fs from 'fs'
import path from 'path'

const catalog = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'data', 'realistic-catalog-v2.json'),
    'utf-8'
  )
)

function generateSQL() {
  let sql = `-- ТехноМодерн Каталог - Импорт данных
-- Сгенерировано: ${new Date().toISOString()}
-- Товаров: ${catalog.total_products}

-- Очистка старых данных (опционально, раскомментируйте если нужно)
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE suppliers CASCADE;
-- TRUNCATE TABLE categories CASCADE;

-- ====================
-- 1. ПОСТАВЩИКИ
-- ====================

`

  // Вставка поставщиков
  catalog.suppliers.forEach((supplier: any, index: number) => {
    sql += `INSERT INTO suppliers (id, name, country, logo_url, verified, rating, created_at)
VALUES (
  '${generateUUID(index)}',
  '${supplier.name}',
  '${supplier.country}',
  NULL,
  ${supplier.verified},
  ${supplier.rating},
  NOW()
) ON CONFLICT (id) DO NOTHING;

`
  })

  sql += `-- ====================
-- 2. КАТЕГОРИИ
-- ====================

`

  // Вставка категорий (уровень 1)
  const categoryMap: Record<string, string> = {}
  catalog.categories.forEach((category: any, index: number) => {
    const categoryId = generateUUID(100 + index)
    categoryMap[category.name] = categoryId

    sql += `INSERT INTO categories (id, name, slug, icon, level, parent_id, display_order, created_at)
VALUES (
  '${categoryId}',
  '${category.name}',
  '${category.id}',
  '${category.icon}',
  1,
  NULL,
  ${index},
  NOW()
) ON CONFLICT (slug) DO NOTHING;

`

    // Вставка подкатегорий (уровень 2)
    category.subcategories.forEach((subcategory: string, subIndex: number) => {
      const subcategoryId = generateUUID(200 + index * 100 + subIndex)
      sql += `INSERT INTO categories (id, name, slug, level, parent_id, display_order, created_at)
VALUES (
  '${subcategoryId}',
  '${subcategory}',
  '${slugify(subcategory)}',
  2,
  '${categoryId}',
  ${subIndex},
  NOW()
) ON CONFLICT (slug) DO NOTHING;

`
    })
  })

  sql += `-- ====================
-- 3. ТОВАРЫ
-- ====================

`

  // Вставка товаров
  catalog.products.forEach((product: any, index: number) => {
    const supplierId = getSupplierIdByName(product.supplier, index)
    const categoryId = categoryMap[product.category]

    sql += `INSERT INTO products (
  id, supplier_id, category_id, name, description, sku,
  price, currency, min_order, in_stock, images, specifications, created_at
)
VALUES (
  '${product.id}',
  '${supplierId}',
  '${categoryId}',
  '${escapeSQLString(product.name)}',
  '${escapeSQLString(product.description)}',
  '${product.id}',
  ${product.price_rub},
  'RUB',
  ${product.moq},
  ${product.in_stock},
  ARRAY['${product.image_url}'],
  '${JSON.stringify(product.specifications).replace(/'/g, "''")}'::jsonb,
  NOW()
) ON CONFLICT (sku) DO NOTHING;

`

    // Добавляем прогресс каждые 50 товаров
    if ((index + 1) % 50 === 0) {
      sql += `-- Прогресс: ${index + 1}/${catalog.total_products} товаров\n\n`
    }
  })

  sql += `-- ====================
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
`

  return sql
}

// Вспомогательные функции
function generateUUID(seed: number): string {
  // Генерация детерминированного UUID из seed
  const hex = seed.toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-0000-0000-0000-${hex.padEnd(12, '0')}`
}

function getSupplierIdByName(supplierName: string, fallbackIndex: number): string {
  const supplierIndex = catalog.suppliers.findIndex((s: any) => s.name === supplierName)
  return generateUUID(supplierIndex >= 0 ? supplierIndex : fallbackIndex % catalog.suppliers.length)
}

function slugify(text: string): string {
  const ru: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => ru[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeSQLString(str: string): string {
  return str.replace(/'/g, "''")
}

// Main
function main() {
  const args = process.argv.slice(2)
  const sqlOnly = args.includes('--sql-only')

  console.log('📊 Импорт каталога в базу данных\n')
  console.log(`   Товаров: ${catalog.total_products}`)
  console.log(`   Категорий: ${catalog.categories.length}`)
  console.log(`   Поставщиков: ${catalog.suppliers.length}\n`)

  // Генерируем SQL
  const sql = generateSQL()

  // Сохраняем SQL файл
  const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '002_import_catalog_data.sql')
  fs.writeFileSync(sqlPath, sql, 'utf-8')
  console.log(`✅ SQL скрипт сохранён: ${sqlPath}`)

  if (sqlOnly) {
    console.log('\n💡 Теперь выполните миграцию вручную:')
    console.log('   1. Откройте Supabase Dashboard')
    console.log('   2. Перейдите в SQL Editor')
    console.log('   3. Скопируйте содержимое файла 002_import_catalog_data.sql')
    console.log('   4. Выполните запрос')
  } else {
    console.log('\n💡 Для импорта в Supabase:')
    console.log('   npx supabase db push (если используете Supabase CLI)')
    console.log('   или скопируйте SQL в Supabase Dashboard → SQL Editor')
  }

  console.log('\n✨ Готово!')
}

main()
