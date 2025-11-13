/**
 * Скрипт для подбора РЕЛЕВАНТНЫХ изображений
 * Анализирует название товара и находит подходящее изображение
 */

const { createClient } = require('@supabase/supabase-js')
const { createApi } = require('unsplash-js')
const { createClient: createPexelsClient } = require('pexels')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
const supabase = createClient(supabaseUrl, supabaseKey)

const unsplash = createApi({
  accessKey: 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M',
})

const pexels = createPexelsClient('5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G')

// Словарь перевода для ключевых слов
const translations = {
  // Спорт и фитнес
  'велосипед': 'bicycle',
  'гантели': 'dumbbells',
  'гантеля': 'dumbbell',
  'спорт': 'sport',
  'фитнес': 'fitness',
  'тренажер': 'gym equipment',
  'коврик': 'yoga mat',
  'скакалка': 'jump rope',
  'эспандер': 'resistance band',

  // Посуда и кухня
  'посуда': 'kitchenware',
  'набор': 'set',
  'тарелка': 'plate',
  'чашка': 'cup',
  'кружка': 'mug',
  'сковорода': 'frying pan',
  'кастрюля': 'pot',
  'нож': 'knife',
  'вилка': 'fork',
  'ложка': 'spoon',
  'чайник': 'kettle',
  'блендер': 'blender',
  'миксер': 'mixer',
  'кофеварка': 'coffee maker',

  // Электроника
  'смартфон': 'smartphone',
  'телефон': 'phone',
  'наушники': 'headphones',
  'колонка': 'speaker',
  'планшет': 'tablet',
  'ноутбук': 'laptop',
  'компьютер': 'computer',
  'клавиатура': 'keyboard',
  'мышь': 'mouse',
  'монитор': 'monitor',
  'камера': 'camera',
  'фотоаппарат': 'camera',
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
  'кеды': 'sneakers',
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

// Функция для извлечения ключевых слов из названия товара
function extractKeywords(productName) {
  const name = productName.toLowerCase()
  const keywords = []

  // Проходим по словарю и ищем совпадения
  for (const [russian, english] of Object.entries(translations)) {
    if (name.includes(russian)) {
      keywords.push(english)
    }
  }

  // Если не нашли ключевых слов, берем первое слово
  if (keywords.length === 0) {
    const firstWord = name.split(' ')[0]
    keywords.push(firstWord)
  }

  return keywords
}

// Функция формирования поискового запроса
function buildSearchQuery(productName) {
  const keywords = extractKeywords(productName)

  // Берем первые 2-3 самых релевантных слова
  const query = keywords.slice(0, 3).join(' ')

  console.log(`   📝 Название: "${productName}"`)
  console.log(`   🔍 Поисковый запрос: "${query}"`)

  return query
}

async function getRelevantImageFromUnsplash(productName, page = 1) {
  try {
    const query = buildSearchQuery(productName)

    const result = await unsplash.search.getPhotos({
      query: query,
      page: page,
      perPage: 1,
      orientation: 'squarish'
    })

    if (result.response && result.response.results.length > 0) {
      const photo = result.response.results[0]
      return `${photo.urls.raw}&w=1080&h=1080&fit=crop&q=80`
    }
  } catch (error) {
    console.error('   ❌ Ошибка Unsplash:', error.message)
  }
  return null
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
    console.error('   ❌ Ошибка Pexels:', error.message)
  }
  return null
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🎨 Начинаем подбор релевантных изображений...\n')

  // 1. Получаем все товары, сгруппированные по категориям
  const { data: allProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, images, category_id')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('❌ Ошибка загрузки товаров:', fetchError)
    return
  }

  // 2. Получаем категории для группировки
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || [])

  console.log(`📦 Загружено товаров: ${allProducts.length}`)
  console.log(`📁 Категорий: ${categories?.length}\n`)

  // 3. Группируем товары по дублирующимся изображениям
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

  // 4. Находим товары с дублирующимися изображениями
  const duplicates = Object.entries(imageGroups)
    .filter(([url, products]) => products.length > 1)
    .sort((a, b) => b[1].length - a[1].length)

  console.log(`🔍 Найдено дублирующихся изображений: ${duplicates.length}\n`)

  // 5. Обрабатываем товары по категориям
  let totalUpdated = 0
  let totalFailed = 0
  const usedImages = new Set()

  for (const [imageUrl, products] of duplicates) {
    // Пропускаем первый товар, обновляем остальные
    for (let i = 1; i < products.length; i++) {
      const product = products[i]
      const categoryName = categoryMap.get(product.category_id) || 'Без категории'

      console.log(`\n[${totalUpdated + totalFailed + 1}] 📦 ${product.name}`)
      console.log(`   📁 Категория: ${categoryName}`)

      let newImageUrl = null
      let attempts = 0
      const maxAttempts = 3

      while (!newImageUrl && attempts < maxAttempts) {
        attempts++
        console.log(`   🔄 Попытка ${attempts}/${maxAttempts}`)

        // Чередуем Unsplash и Pexels
        if (attempts % 2 === 1) {
          newImageUrl = await getRelevantImageFromUnsplash(product.name, attempts)
        } else {
          newImageUrl = await getRelevantImageFromPexels(product.name, Math.ceil(attempts / 2))
        }

        // Проверяем уникальность
        if (newImageUrl && usedImages.has(newImageUrl)) {
          console.log(`   ⚠️  Изображение уже использовано, пробуем снова...`)
          newImageUrl = null
        }

        await sleep(300) // Задержка между запросами API
      }

      if (newImageUrl) {
        usedImages.add(newImageUrl)

        // Обновляем товар
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: [newImageUrl] })
          .eq('id', product.id)

        if (updateError) {
          console.log(`   ❌ Ошибка обновления: ${updateError.message}`)
          totalFailed++
        } else {
          console.log(`   ✅ Изображение обновлено`)
          totalUpdated++
        }
      } else {
        console.log(`   ❌ Не удалось получить изображение`)
        totalFailed++
      }

      // Задержка между товарами
      await sleep(500)

      // Останавливаемся после 100 обновлений
      if (totalUpdated >= 100) {
        console.log('\n⏹️  Достигнут лимит 100 обновлений, останавливаемся...')
        break
      }
    }

    if (totalUpdated >= 100) break
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Обновление завершено!')
  console.log(`✅ Успешно обновлено: ${totalUpdated}`)
  console.log(`❌ Ошибок: ${totalFailed}`)
  console.log('='.repeat(60))

  // 6. Финальная статистика
  const { data: updatedProducts } = await supabase
    .from('products')
    .select('images')

  const uniqueImages = new Set()
  updatedProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
      uniqueImages.add(p.images[0])
    }
  })

  console.log(`\n📊 Финальная статистика:`)
  console.log(`   Всего товаров: ${updatedProducts.length}`)
  console.log(`   Уникальных изображений: ${uniqueImages.size}`)
}

main().catch(console.error)
