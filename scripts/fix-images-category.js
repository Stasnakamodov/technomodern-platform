/**
 * Обработка изображений для выбранной категории
 * Использование: node fix-images-category.js "Автотовары"
 */

const { createClient } = require('@supabase/supabase-js')
const { createClient: createPexelsClient } = require('pexels')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
const supabase = createClient(supabaseUrl, supabaseKey)

const pexels = createPexelsClient('5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G')

// Словарь перевода
const translations = {
  'автомобиль': 'car automobile',
  'машина': 'car vehicle',
  'шина': 'car tire wheel',
  'покрышка': 'tire rubber',
  'масло': 'motor oil',
  'фильтр': 'car filter',
  'аккумулятор': 'car battery',
  'свеча': 'spark plug',
  'тормоз': 'brake pad',
  'колодка': 'brake pad',
  'диск': 'brake disc',
  'амортизатор': 'shock absorber',
  'радиатор': 'car radiator',
  'генератор': 'alternator',
  'стартер': 'starter motor',
  'коврик': 'car mat',
  'чехол': 'car seat cover',
  'держатель': 'phone holder',
  'зарядка': 'car charger',
  'видеорегистратор': 'dash cam',
  'антифриз': 'antifreeze coolant',
  'жидкость': 'fluid liquid',
  'велосипед': 'bicycle',
  'гантели': 'dumbbells',
  'гантеля': 'dumbbell weights',
  'спорт': 'sport',
  'фитнес': 'fitness',
  'тренажер': 'gym equipment',
  'посуда': 'kitchenware dishes',
  'набор': 'set',
  'тарелка': 'plate',
  'чашка': 'cup',
  'смартфон': 'smartphone mobile',
  'телефон': 'phone',
  'наушники': 'headphones',
  'колонка': 'speaker',
  'планшет': 'tablet',
  'ноутбук': 'laptop',
  'футболка': 't-shirt',
  'куртка': 'jacket',
  'кроссовки': 'sneakers',
  'дрель': 'power drill',
  'шуруповерт': 'screwdriver drill',
  'пила': 'saw',
  'молоток': 'hammer',
  'светильник': 'lamp light fixture',
  'лампа': 'light bulb',
  'led': 'led lights',
  'крем': 'face cream skincare',
  'шампунь': 'shampoo',
  'маска': 'face mask',
  'стол': 'table',
  'стул': 'chair',
  'кресло': 'armchair',
  'диван': 'sofa',
  'кровать': 'bed'
}

function extractKeywords(productName) {
  const name = productName.toLowerCase()
  const keywords = []

  for (const [russian, english] of Object.entries(translations)) {
    if (name.includes(russian)) {
      keywords.push(english)
    }
  }

  if (keywords.length === 0) {
    const firstWord = name.split(' ')[0]
    keywords.push(firstWord)
  }

  return keywords
}

function buildSearchQuery(productName) {
  const keywords = extractKeywords(productName)
  return keywords.slice(0, 2).join(' ')
}

async function getRelevantImageFromPexels(productName, page = 1) {
  try {
    const query = buildSearchQuery(productName)

    const result = await pexels.photos.search({
      query: query,
      per_page: 5,
      page: page,
      size: 'large',
      orientation: 'square'
    })

    if (result.photos && result.photos.length > 0) {
      return result.photos.map((photo, idx) => ({
        url: `${photo.src.large}?auto=compress&cs=tinysrgb&h=1080&w=1080`,
        query: query,
        index: idx + 1
      }))
    }
  } catch (error) {
    console.error('   ❌ Pexels ошибка:', error.message)
  }
  return []
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const categoryName = process.argv[2] || 'Автотовары'

  console.log(`🎨 Обработка категории: ${categoryName}\n`)

  // 1. Загружаем все товары
  const { data: allProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, images, category_id')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('❌ Ошибка:', fetchError)
    return
  }

  // 2. Загружаем категории
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || [])
  const categoryIdMap = new Map(categories?.map(c => [c.name, c.id]) || [])

  // 3. Находим дубликаты
  const imageGroups = {}
  allProducts.forEach(product => {
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0]
      if (!imageGroups[imageUrl]) {
        imageGroups[imageUrl] = []
      }
      imageGroups[imageUrl].push(product)
    }
  })

  const duplicates = Object.entries(imageGroups)
    .filter(([url, products]) => products.length > 1)
    .flatMap(([url, products]) => products.slice(1))

  // 4. Фильтруем по категории
  const targetCategoryId = categoryIdMap.get(categoryName)
  const productsInCategory = duplicates.filter(p =>
    categoryMap.get(p.category_id) === categoryName
  )

  console.log(`📦 Товаров в категории с дублями: ${productsInCategory.length}\n`)

  if (productsInCategory.length === 0) {
    console.log('✅ Нет товаров для обработки!')
    return
  }

  // 5. Получаем уже использованные изображения
  const usedImages = new Set()
  allProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
      usedImages.add(p.images[0])
    }
  })

  let updated = 0
  let skipped = 0

  console.log('🚀 Начинаем обработку товар за товаром...\n')
  console.log('Для каждого товара показываются варианты изображений.')
  console.log('Проверь каждое и выбери лучшее!\n')

  // 6. Обрабатываем товары
  for (let i = 0; i < Math.min(10, productsInCategory.length); i++) {
    const product = productsInCategory[i]

    console.log('='.repeat(60))
    console.log(`\n[${i + 1}/${Math.min(10, productsInCategory.length)}] 📦 ${product.name}`)
    console.log(`   Старое изображение: ${product.images[0].substring(0, 70)}...`)

    const searchQuery = buildSearchQuery(product.name)
    console.log(`   🔍 Поисковый запрос: "${searchQuery}"`)
    console.log('\n   🔄 Ищу варианты изображений...')

    await sleep(1000)

    // Пробуем разные страницы результатов (1, 2, 3)
    let imageOptions = []
    for (let page = 1; page <= 3 && imageOptions.length === 0; page++) {
      console.log(`   📄 Страница ${page}...`)
      const options = await getRelevantImageFromPexels(product.name, page)
      const availableOptions = options.filter(opt => !usedImages.has(opt.url))
      if (availableOptions.length > 0) {
        imageOptions = availableOptions
        break
      }
      await sleep(800)
    }

    if (imageOptions.length === 0) {
      console.log('   ❌ Не удалось найти уникальные изображения')
      skipped++
      continue
    }

    console.log(`\n   ✅ Найдено ${imageOptions.length} вариантов:\n`)
    imageOptions.forEach((opt, idx) => {
      console.log(`   ${idx + 1}. ${opt.url}`)
    })

    console.log(`\n   💡 РЕКОМЕНДАЦИЯ: Выбери вариант 1 (самый релевантный)\n`)

    // Автоматически берем первый вариант (самый релевантный от Pexels)
    const selectedImage = imageOptions[0].url

    console.log(`   ✨ Выбрано изображение #1`)
    console.log(`   🔗 ${selectedImage}\n`)

    // Обновляем товар
    const { error: updateError } = await supabase
      .from('products')
      .update({ images: [selectedImage] })
      .eq('id', product.id)

    if (updateError) {
      console.log(`   ❌ Ошибка обновления: ${updateError.message}`)
      skipped++
    } else {
      console.log(`   ✅ ОБНОВЛЕНО!\n`)
      usedImages.add(selectedImage)
      updated++
    }

    await sleep(800)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Обработка завершена!')
  console.log(`✅ Обновлено: ${updated}`)
  console.log(`⏭️  Пропущено: ${skipped}`)
  console.log('='.repeat(60))

  if (productsInCategory.length > 10) {
    console.log(`\n💡 Осталось еще ${productsInCategory.length - 10} товаров в этой категории`)
    console.log('   Запусти скрипт снова для продолжения')
  }
}

main().catch(console.error)
