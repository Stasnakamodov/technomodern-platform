/**
 * Скрипт для обновления товаров с дублирующимися изображениями
 * Цель: Получить 100 товаров с уникальными изображениями
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

// Поисковые запросы для разных категорий товаров
const searchQueries = [
  'modern electronics gadget',
  'wireless headphones technology',
  'smart home device',
  'fitness tracker wearable',
  'portable speaker audio',
  'gaming console controller',
  'laptop computer workspace',
  'tablet device screen',
  'smartphone mobile phone',
  'camera photography equipment',
  'smart watch digital',
  'keyboard mechanical tech',
  'mouse gaming peripheral',
  'monitor display screen',
  'router wifi network',
  'drone aerial camera',
  'action camera gopro',
  'vr headset virtual reality',
  'power bank charger',
  'usb cable connector',
  'home appliance kitchen',
  'air purifier clean',
  'humidifier mist',
  'fan cooling device',
  'heater warming',
  'vacuum cleaner robot',
  'coffee maker machine',
  'blender kitchen appliance',
  'toaster breakfast',
  'microwave oven',
  'rice cooker electric',
  'water kettle electric',
  'pressure cooker instant',
  'air fryer kitchen',
  'dishwasher appliance',
  'washing machine laundry',
  'refrigerator fridge',
  'tv television screen',
  'projector home cinema',
  'soundbar audio system',
  'led light bulb smart',
  'security camera surveillance',
  'doorbell smart ring',
  'thermostat nest smart',
  'plug socket smart',
  'curtain blind smart',
  'lock door smart',
  'sensor motion detector',
  'alarm system security',
  'baby monitor camera'
]

async function getUniqueImageFromUnsplash(query, page = 1) {
  try {
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
    console.error('Ошибка Unsplash:', error.message)
  }
  return null
}

async function getUniqueImageFromPexels(query, page = 1) {
  try {
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
    console.error('Ошибка Pexels:', error.message)
  }
  return null
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🚀 Начинаем обновление изображений...\n')

  // 1. Получаем все товары
  const { data: allProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, images, category_id')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('❌ Ошибка загрузки товаров:', fetchError)
    return
  }

  console.log(`📦 Загружено товаров: ${allProducts.length}`)

  // 2. Группируем товары по изображениям
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

  // 3. Находим дублирующиеся изображения
  const duplicates = Object.entries(imageGroups)
    .filter(([url, products]) => products.length > 1)
    .sort((a, b) => b[1].length - a[1].length)

  console.log(`🔍 Найдено дублирующихся изображений: ${duplicates.length}`)

  // 4. Берем товары для обновления (оставляем первый товар с оригинальной картинкой)
  const productsToUpdate = []
  for (const [imageUrl, products] of duplicates) {
    // Пропускаем первый товар, обновляем остальные
    for (let i = 1; i < products.length; i++) {
      productsToUpdate.push(products[i])
      if (productsToUpdate.length >= 50) break
    }
    if (productsToUpdate.length >= 50) break
  }

  console.log(`📝 Товаров для обновления: ${productsToUpdate.length}\n`)

  // 5. Обновляем изображения
  let updated = 0
  let failed = 0
  const usedImages = new Set()

  for (let i = 0; i < productsToUpdate.length; i++) {
    const product = productsToUpdate[i]
    const query = searchQueries[i % searchQueries.length]
    const page = Math.floor(i / searchQueries.length) + 1

    console.log(`[${i + 1}/${productsToUpdate.length}] Обновляем: ${product.name}`)
    console.log(`   Запрос: "${query}" (страница ${page})`)

    let newImageUrl = null
    let attempts = 0
    const maxAttempts = 3

    while (!newImageUrl && attempts < maxAttempts) {
      attempts++

      // Чередуем Unsplash и Pexels
      if (attempts % 2 === 1) {
        newImageUrl = await getUniqueImageFromUnsplash(query, page + attempts - 1)
      } else {
        newImageUrl = await getUniqueImageFromPexels(query, page + Math.floor(attempts / 2))
      }

      // Проверяем уникальность
      if (newImageUrl && usedImages.has(newImageUrl)) {
        console.log(`   ⚠️  Изображение уже использовано, пробуем снова...`)
        newImageUrl = null
      }

      await sleep(100) // Задержка между запросами
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
        failed++
      } else {
        console.log(`   ✅ Обновлено`)
        updated++
      }
    } else {
      console.log(`   ❌ Не удалось получить изображение`)
      failed++
    }

    // Задержка между обновлениями
    await sleep(500)
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Обновление завершено!')
  console.log(`✅ Успешно обновлено: ${updated}`)
  console.log(`❌ Ошибок: ${failed}`)
  console.log('='.repeat(50))

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
