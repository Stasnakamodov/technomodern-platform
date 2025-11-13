const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Коллекции изображений для каждой категории (реальные ID коллекций Unsplash)
const CATEGORY_COLLECTIONS = {
  'Электроника': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
  ],
  'Мебель': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800',
    'https://images.unsplash.com/photo-1555041469-a5090b14de31?w=800',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
    'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  ],
  'Одежда': [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800',
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800',
  ],
  'Строительство': [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    'https://images.unsplash.com/photo-1590856029620-14e4448ba5f6?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    'https://images.unsplash.com/photo-1581092583537-20d51876f997?w=800',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
  ],
  'Текстиль': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800',
    'https://images.unsplash.com/photo-1615655096345-61a29ef1d384?w=800',
    'https://images.unsplash.com/photo-1558769132-cb1aea39c2f2?w=800',
    'https://images.unsplash.com/photo-1541958880-7e99c90035c7?w=800',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    'https://images.unsplash.com/photo-1567225477277-c1b7992b7fe3?w=800',
  ],
  'Оборудование': [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800',
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1580982324449-8abea9c3f3a9?w=800',
  ]
}

async function assignUniqueImages() {
  console.log('🚀 Назначаем уникальные изображения товарам...\n')

  try {
    // 1. Получаем категории
    console.log('📂 Загружаем категории...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')

    if (catError) throw catError
    console.log(`✅ Найдено категорий: ${categories.length}\n`)

    const categoryMap = new Map(categories.map(c => [c.id, c.name]))

    // 2. Получаем все товары
    console.log('📦 Загружаем товары...')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')

    if (prodError) throw prodError
    console.log(`✅ Найдено товаров: ${products.length}\n`)

    // 3. Назначаем уникальные изображения
    console.log('🖼️  Назначаем уникальные изображения...\n')

    // Счетчики для каждой категории
    const categoryCounters = {}

    let updated = 0
    let failed = 0

    for (const product of products) {
      const categoryName = categoryMap.get(product.category_id) || 'Электроника'

      // Инициализируем счетчик для категории
      if (!categoryCounters[categoryName]) {
        categoryCounters[categoryName] = 0
      }

      // Получаем коллекцию изображений для категории
      const imageCollection = CATEGORY_COLLECTIONS[categoryName] || CATEGORY_COLLECTIONS['Электроника']

      // Берем изображение по кругу (если товаров больше чем изображений)
      const imageIndex = categoryCounters[categoryName] % imageCollection.length
      const imageUrl = imageCollection[imageIndex]

      categoryCounters[categoryName]++

      // Обновляем изображение
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: [imageUrl]
        })
        .eq('id', product.id)

      if (updateError) {
        console.error(`❌ ${product.name}: ${updateError.message}`)
        failed++
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`✅ Обновлено: ${updated}/${products.length}`)
        }
      }

      // Небольшая пауза
      if (updated % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    console.log(`\n✅ ГОТОВО!`)
    console.log(`   Обновлено: ${updated}`)
    console.log(`   Ошибок: ${failed}`)
    console.log(`   Всего: ${products.length}\n`)

    // 4. Статистика по категориям
    console.log('📊 Статистика по категориям:\n')
    for (const [catName, count] of Object.entries(categoryCounters)) {
      console.log(`   ${catName}: ${count} товаров`)
    }

    // 5. Проверяем результат
    console.log('\n🔍 Проверяем разнообразие изображений...\n')
    const { data: check, error: checkError } = await supabase
      .from('products')
      .select('id, name, images')
      .limit(15)

    if (!checkError && check) {
      console.log('📸 Первые 15 товаров:\n')
      check.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`)
        console.log(`   ${p.images?.[0]?.substring(0, 80)}...\n`)
      })
    }

    console.log('✅ Теперь перезагрузите http://localhost:3000/catalog')
    console.log('✅ У каждого товара должна быть своя картинка!\n')

  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Запускаем
assignUniqueImages()
