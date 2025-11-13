/**
 * ИНТЕРАКТИВНЫЙ скрипт для подбора релевантных изображений
 * - Выбор категории вручную
 * - Товар за товаром с проверкой
 * - Предотвращение дублей
 */

const { createClient } = require('@supabase/supabase-js')
const { createClient: createPexelsClient } = require('pexels')
const readline = require('readline')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
const supabase = createClient(supabaseUrl, supabaseKey)

const pexels = createPexelsClient('5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G')

// Словарь перевода
const translations = {
  'велосипед': 'bicycle',
  'гантели': 'dumbbells',
  'гантеля': 'dumbbell weights',
  'спорт': 'sport',
  'фитнес': 'fitness',
  'тренажер': 'gym equipment',
  'коврик': 'yoga mat',
  'скакалка': 'jump rope',
  'эспандер': 'resistance band',
  'штанга': 'barbell',
  'гиря': 'kettlebell',
  'посуда': 'kitchenware dishes',
  'набор': 'set',
  'тарелка': 'plate',
  'чашка': 'cup',
  'кружка': 'mug',
  'сковорода': 'frying pan',
  'кастрюля': 'pot',
  'нож': 'knife',
  'вилка': 'fork',
  'ложка': 'spoon',
  'чайник': 'kettle teapot',
  'блендер': 'blender',
  'миксер': 'mixer',
  'кофеварка': 'coffee maker',
  'смартфон': 'smartphone mobile',
  'телефон': 'phone',
  'наушники': 'headphones',
  'колонка': 'speaker',
  'планшет': 'tablet',
  'ноутбук': 'laptop',
  'компьютер': 'computer',
  'клавиатура': 'keyboard',
  'мышь': 'computer mouse',
  'монитор': 'monitor',
  'камера': 'camera',
  'фотоаппарат': 'photo camera',
  'зарядка': 'charger',
  'кабель': 'cable',
  'роутер': 'router',
  'часы': 'watch',
  'фитнес-браслет': 'fitness tracker',
  'футболка': 't-shirt',
  'куртка': 'jacket',
  'пальто': 'coat',
  'джинсы': 'jeans',
  'брюки': 'pants',
  'кроссовки': 'sneakers',
  'кеды': 'canvas sneakers',
  'ботинки': 'boots',
  'туфли': 'shoes',
  'рубашка': 'shirt',
  'платье': 'dress',
  'юбка': 'skirt',
  'свитер': 'sweater',
  'стол': 'table',
  'стул': 'chair',
  'кресло': 'armchair',
  'диван': 'sofa',
  'кровать': 'bed',
  'шкаф': 'wardrobe',
  'полка': 'shelf',
  'тумба': 'cabinet',
  'дрель': 'power drill',
  'шуруповерт': 'screwdriver drill',
  'пила': 'saw',
  'молоток': 'hammer',
  'отвертка': 'screwdriver',
  'лобзик': 'jigsaw',
  'болгарка': 'angle grinder',
  'перфоратор': 'rotary hammer',
  'светильник': 'lamp light fixture',
  'лампа': 'light bulb',
  'led': 'led lights',
  'крем': 'face cream skincare',
  'шампунь': 'shampoo',
  'маска': 'face mask',
  'сыворотка': 'serum',
  'лосьон': 'lotion',
  'тоник': 'toner',
  'пудра': 'powder',
  'помада': 'lipstick',
  'тушь': 'mascara',
  'тени': 'eyeshadow',
  'стекло': 'glass',
  'керамика': 'ceramic',
  'дерево': 'wood',
  'металл': 'metal',
  'пластик': 'plastic',
  'нержавеющая сталь': 'stainless steel',
  'алюминий': 'aluminum',
  'складной': 'foldable',
  'портативный': 'portable',
  'беспроводной': 'wireless',
  'умный': 'smart',
  'электрический': 'electric',
  'автоматический': 'automatic',
  'ручной': 'manual',
  'профессиональный': 'professional',
  'детский': 'kids',
  'домашний': 'home'
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
      per_page: 3,
      page: page,
      size: 'large',
      orientation: 'square'
    })

    if (result.photos && result.photos.length > 0) {
      return result.photos.map(photo => ({
        url: `${photo.src.large}?auto=compress&cs=tinysrgb&h=1080&w=1080`,
        query: query
      }))
    }
  } catch (error) {
    console.error('   ❌ Pexels ошибка:', error.message)
  }
  return []
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function main() {
  console.log('🎨 Интерактивное обновление изображений по категориям\n')

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

  // 4. Группируем дубликаты по категориям
  const duplicatesByCategory = {}
  duplicates.forEach(product => {
    const categoryName = categoryMap.get(product.category_id) || 'Без категории'
    if (!duplicatesByCategory[categoryName]) {
      duplicatesByCategory[categoryName] = []
    }
    duplicatesByCategory[categoryName].push(product)
  })

  console.log(`📦 Всего товаров: ${allProducts.length}`)
  console.log(`🔍 Товаров с дублирующимися картинками: ${duplicates.length}\n`)

  // 5. Показываем категории с дублями
  console.log('📁 Категории с дублями:\n')
  const categoryList = Object.entries(duplicatesByCategory)
    .sort((a, b) => b[1].length - a[1].length)

  categoryList.forEach(([categoryName, products], index) => {
    console.log(`${index + 1}. ${categoryName} (${products.length} товаров)`)
  })

  console.log('\n0. Выход\n')

  // 6. Выбор категории
  const categoryChoice = await askQuestion('Выбери номер категории: ')
  const categoryIndex = parseInt(categoryChoice) - 1

  if (categoryIndex === -1 || isNaN(categoryIndex) || categoryIndex >= categoryList.length) {
    console.log('Выход.')
    return
  }

  const [selectedCategory, productsInCategory] = categoryList[categoryIndex]
  console.log(`\n✅ Выбрана категория: ${selectedCategory}`)
  console.log(`📦 Товаров для обновления: ${productsInCategory.length}\n`)

  // 7. Получаем уже использованные изображения
  const usedImages = new Set()
  allProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
      usedImages.add(p.images[0])
    }
  })

  let updated = 0
  let skipped = 0

  // 8. Обрабатываем товары по одному
  for (let i = 0; i < productsInCategory.length; i++) {
    const product = productsInCategory[i]

    console.log(`\n[${ i + 1}/${productsInCategory.length}] 📦 ${product.name}`)
    console.log(`   Текущее изображение: ${product.images[0].substring(0, 80)}...`)

    const searchQuery = buildSearchQuery(product.name)
    console.log(`   🔍 Поисковый запрос: "${searchQuery}"`)

    // Получаем варианты изображений
    const imageOptions = await getRelevantImageFromPexels(product.name, 1)

    if (imageOptions.length === 0) {
      console.log('   ❌ Не удалось найти изображения')
      skipped++
      continue
    }

    // Показываем найденные изображения
    console.log('\n   Найдено изображений:')
    const availableOptions = imageOptions.filter(opt => !usedImages.has(opt.url))

    if (availableOptions.length === 0) {
      console.log('   ⚠️  Все изображения уже используются')
      skipped++
      continue
    }

    availableOptions.forEach((opt, idx) => {
      console.log(`   ${idx + 1}. ${opt.url.substring(0, 80)}...`)
    })

    const choice = await askQuestion('\n   Выбери изображение (1-' + availableOptions.length + ') или s (skip): ')

    if (choice.toLowerCase() === 's') {
      console.log('   ⏭️  Пропущено')
      skipped++
      continue
    }

    const imageIndex = parseInt(choice) - 1
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= availableOptions.length) {
      console.log('   ⚠️  Неверный выбор, пропускаем')
      skipped++
      continue
    }

    const selectedImage = availableOptions[imageIndex].url

    // Обновляем товар
    const { error: updateError } = await supabase
      .from('products')
      .update({ images: [selectedImage] })
      .eq('id', product.id)

    if (updateError) {
      console.log(`   ❌ Ошибка: ${updateError.message}`)
      skipped++
    } else {
      console.log(`   ✅ Обновлено!`)
      usedImages.add(selectedImage)
      updated++
    }

    // Спрашиваем, продолжать ли
    const continueChoice = await askQuestion('\n   Продолжить? (y/n): ')
    if (continueChoice.toLowerCase() !== 'y') {
      break
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Обработка завершена!')
  console.log(`✅ Обновлено: ${updated}`)
  console.log(`⏭️  Пропущено: ${skipped}`)
  console.log('='.repeat(50))
}

main().catch(console.error)
