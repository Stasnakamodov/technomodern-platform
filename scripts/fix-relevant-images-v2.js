/**
 * Улучшенный скрипт для подбора РЕЛЕВАНТНЫХ изображений v2.0
 * - Расширенный словарь переводов
 * - Увеличенные задержки для избежания rate limit
 * - Больше вариантов поисковых запросов
 */

const { createClient } = require('@supabase/supabase-js')
const { createClient: createPexelsClient } = require('pexels')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
const supabase = createClient(supabaseUrl, supabaseKey)

const pexels = createPexelsClient('5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G')

// РАСШИРЕННЫЙ словарь перевода
const translations = {
  // Спорт и фитнес
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

  // Посуда и кухня
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

  // Электроника
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

  // Одежда и обувь
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

  // Мебель
  'стол': 'table',
  'стул': 'chair',
  'кресло': 'armchair',
  'диван': 'sofa',
  'кровать': 'bed',
  'шкаф': 'wardrobe',
  'полка': 'shelf',
  'тумба': 'cabinet',

  // Инструменты и строительство
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

  // Красота и здоровье
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

  // Материалы
  'стекло': 'glass',
  'керамика': 'ceramic',
  'дерево': 'wood',
  'металл': 'metal',
  'пластик': 'plastic',
  'нержавеющая сталь': 'stainless steel',
  'алюминий': 'aluminum',

  // Характеристики
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

// Функция для извлечения ключевых слов
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

// Функция формирования поискового запроса
function buildSearchQuery(productName) {
  const keywords = extractKeywords(productName)
  const query = keywords.slice(0, 2).join(' ')
  console.log(`   📝 "${productName}" → "${query}"`)
  return query
}

async function getRelevantImageFromPexels(productName, page = 1) {
  try {
    const query = buildSearchQuery(productName)

    const result = await pexels.photos.search({
      query: query,
      per_page: 1,
      page: page,
      size: 'large',
      orientation: 'square'
    })

    if (result.photos && result.photos.length > 0) {
      const photo = result.photos[0]
      return `${photo.src.large}?auto=compress&cs=tinysrgb&h=1080&w=1080`
    }
  } catch (error) {
    console.error('   ❌ Pexels ошибка:', error.message)
  }
  return null
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🎨 Улучшенный подбор релевантных изображений v2.0\n')

  const { data: allProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, images, category_id')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('❌ Ошибка:', fetchError)
    return
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || [])

  console.log(`📦 Товаров: ${allProducts.length}`)
  console.log(`📁 Категорий: ${categories?.length}\n`)

  // Находим дубликаты
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
    .sort((a, b) => b[1].length - a[1].length)

  console.log(`🔍 Дублирующихся изображений: ${duplicates.length}\n`)

  let totalUpdated = 0
  let totalFailed = 0
  const usedImages = new Set()

  for (const [imageUrl, products] of duplicates) {
    // Обрабатываем все товары кроме первого
    for (let i = 1; i < products.length; i++) {
      const product = products[i]
      const categoryName = categoryMap.get(product.category_id) || 'Без категории'

      console.log(`\n[${totalUpdated + totalFailed + 1}] ${categoryName}`)

      let newImageUrl = null
      let attempts = 0
      const maxAttempts = 5

      while (!newImageUrl && attempts < maxAttempts) {
        attempts++
        console.log(`   🔄 Попытка ${attempts}/${maxAttempts}`)

        newImageUrl = await getRelevantImageFromPexels(product.name, attempts)

        if (newImageUrl && usedImages.has(newImageUrl)) {
          console.log(`   ⚠️  Дубль, пробуем еще...`)
          newImageUrl = null
        }

        await sleep(1000) // 1 секунда задержка между запросами
      }

      if (newImageUrl) {
        usedImages.add(newImageUrl)

        const { error: updateError } = await supabase
          .from('products')
          .update({ images: [newImageUrl] })
          .eq('id', product.id)

        if (updateError) {
          console.log(`   ❌ Ошибка: ${updateError.message}`)
          totalFailed++
        } else {
          console.log(`   ✅ Обновлено!`)
          totalUpdated++
        }
      } else {
        console.log(`   ❌ Не удалось`)
        totalFailed++
      }

      await sleep(500)

      if (totalUpdated >= 150) {
        console.log('\n⏹️  Лимит 150 достигнут')
        break
      }
    }

    if (totalUpdated >= 150) break
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Завершено!')
  console.log(`✅ Обновлено: ${totalUpdated}`)
  console.log(`❌ Ошибок: ${totalFailed}`)
  console.log('='.repeat(50))

  // Финальная статистика
  const { data: updatedProducts } = await supabase
    .from('products')
    .select('images')

  const uniqueImages = new Set()
  updatedProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
      uniqueImages.add(p.images[0])
    }
  })

  console.log(`\n📊 Статистика:`)
  console.log(`   Товаров: ${updatedProducts.length}`)
  console.log(`   Уникальных изображений: ${uniqueImages.size}`)
}

main().catch(console.error)
