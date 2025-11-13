/**
 * Обновление изображений товаров реальными фото с Unsplash
 *
 * Использует Unsplash API для загрузки качественных фото по категориям
 * Бесплатно: 50 запросов в час
 *
 * Использование: npx tsx scripts/update-images-unsplash.ts
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'

// Unsplash Access Key (demo key, ограничение 50 запросов/час)
const UNSPLASH_ACCESS_KEY = 'YOUR_ACCESS_KEY' // Можно использовать без ключа через source.unsplash.com

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Мапинг категорий на поисковые запросы Unsplash
const CATEGORY_TO_UNSPLASH_QUERY: Record<string, string> = {
  'Электроника': 'technology,gadget,electronics,phone,laptop',
  'Одежда': 'fashion,clothing,apparel,clothes',
  'Мебель': 'furniture,interior,home,decor',
  'Строительство': 'tools,construction,hardware,building',
  'Автотовары': 'car,automotive,vehicle,auto',
  'Дом и сад': 'home,kitchen,garden,house',
  'Спорт и отдых': 'sports,fitness,exercise,outdoor',
  'Красота и здоровье': 'beauty,cosmetics,skincare,health'
}

// Подкатегории для более точного поиска
const SUBCATEGORY_QUERIES: Record<string, string> = {
  'Смартфоны': 'smartphone,mobile phone,iphone',
  'Ноутбуки': 'laptop,notebook,macbook',
  'Наушники': 'headphones,earbuds,earphones',
  'Планшеты': 'tablet,ipad',
  'Умные часы': 'smartwatch,watch',
  'Телевизоры': 'tv,television,monitor',
  'Камеры': 'camera,photography',

  'Верхняя одежда': 'jacket,coat,outerwear',
  'Обувь': 'shoes,sneakers,boots',
  'Джинсы': 'jeans,denim',
  'Футболки': 'tshirt,shirt',
  'Толстовки': 'hoodie,sweatshirt',

  'Офисная мебель': 'office chair,desk',
  'Мягкая мебель': 'sofa,couch,armchair',

  'Электроинструменты': 'power tools,drill',
  'Освещение': 'lighting,lamp,led',

  'Автомасла': 'motor oil,engine oil',
  'Тормозная система': 'brake pads,brakes'
}

function getUnsplashImageUrl(query: string, index: number, width = 600, height = 400): string {
  // Используем Unsplash Source API (не требует ключа, но случайные фото)
  const cleanQuery = query.split(',')[0].replace(/\s+/g, '-')
  return `https://source.unsplash.com/${width}x${height}/?${cleanQuery}&sig=${index}`
}

async function updateProductImages() {
  console.log('🎨 Обновление изображений товаров...\n')

  try {
    // Получаем все товары с категориями
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        images
      `)
      .limit(1000)

    if (error) {
      throw error
    }

    console.log(`📦 Найдено ${products.length} товаров`)

    // Получаем категории
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')

    const categoriesMap = new Map(categories?.map(c => [c.id, c.name]) || [])

    let updated = 0
    let skipped = 0

    for (const product of products) {
      const categoryName = categoriesMap.get(product.category_id) || 'Электроника'

      // Определяем поисковый запрос
      let searchQuery = CATEGORY_TO_UNSPLASH_QUERY[categoryName] || 'product,item'

      // Пробуем найти более точный запрос по названию товара
      const productNameLower = product.name.toLowerCase()
      for (const [subcategory, query] of Object.entries(SUBCATEGORY_QUERIES)) {
        if (productNameLower.includes(subcategory.toLowerCase())) {
          searchQuery = query
          break
        }
      }

      // Генерируем новый URL изображения
      const newImageUrl = getUnsplashImageUrl(searchQuery, updated + skipped)

      // Обновляем товар
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: [newImageUrl] })
        .eq('id', product.id)

      if (updateError) {
        console.error(`   ❌ Ошибка обновления ${product.name}:`, updateError.message)
        skipped++
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`   ✅ Обновлено: ${updated}/${products.length}`)
        }
      }

      // Небольшая задержка чтобы не перегружать API
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    console.log(`\n✅ Обновление завершено!`)
    console.log(`   Обновлено: ${updated}`)
    console.log(`   Пропущено: ${skipped}`)
    console.log(`\n💡 Изображения будут обновлены автоматически на сайте`)

  } catch (error: any) {
    console.error('❌ Критическая ошибка:', error.message)
    process.exit(1)
  }
}

// Альтернативный вариант: использовать конкретные URL с Unsplash Collections
async function updateWithCollections() {
  console.log('🎨 Обновление через Unsplash Collections...\n')

  // ID коллекций на Unsplash по темам
  const collections: Record<string, string> = {
    'Электроника': '3330455', // Technology collection
    'Одежда': '1163637',      // Fashion collection
    'Мебель': '1058803',      // Interior design
    'Строительство': '9475869', // Tools
    'Автотовары': '1319040',  // Cars
    'Дом и сад': '139386',    // Home & Garden
    'Спорт и отдых': '537051', // Fitness
    'Красота и здоровье': '3213364' // Beauty
  }

  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, category_id')
      .limit(1000)

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')

    const categoriesMap = new Map(categories?.map(c => [c.id, c.name]) || [])

    let updated = 0

    for (const product of products) {
      const categoryName = categoriesMap.get(product.category_id) || 'Электроника'
      const collectionId = collections[categoryName] || collections['Электроника']

      // URL из коллекции (случайное фото)
      const imageUrl = `https://source.unsplash.com/collection/${collectionId}/600x400`

      await supabase
        .from('products')
        .update({ images: [imageUrl] })
        .eq('id', product.id)

      updated++
      if (updated % 50 === 0) {
        console.log(`   ✅ Обновлено: ${updated}/${products.length}`)
      }

      await new Promise(resolve => setTimeout(resolve, 50))
    }

    console.log(`\n✅ Обновлено ${updated} товаров`)

  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
  }
}

// Выбираем метод
const args = process.argv.slice(2)
const useCollections = args.includes('--collections')

console.log('╔═══════════════════════════════════════════════════════════════╗')
console.log('║                                                               ║')
console.log('║     🎨  ОБНОВЛЕНИЕ ИЗОБРАЖЕНИЙ ТОВАРОВ (UNSPLASH)  🎨        ║')
console.log('║                                                               ║')
console.log('╚═══════════════════════════════════════════════════════════════╝\n')

if (useCollections) {
  console.log('📚 Используем Unsplash Collections\n')
  updateWithCollections()
} else {
  console.log('🔍 Используем поиск по категориям\n')
  updateProductImages()
}
