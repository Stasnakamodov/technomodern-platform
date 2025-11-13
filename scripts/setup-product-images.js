const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const fs = require('fs')
const path = require('path')

// Supabase credentials
const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || prompt('Введите SUPABASE_SERVICE_ROLE_KEY:')

if (!supabaseServiceKey) {
  console.error('❌ Нужен SUPABASE_SERVICE_ROLE_KEY')
  console.log('Получите его в Supabase Dashboard → Settings → API → service_role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Placeholder изображения для товаров (высокое качество, без водяных знаков)
const PLACEHOLDER_IMAGES = {
  electronics: 'https://placehold.co/800x800/667eea/ffffff/png?text=Electronics',
  furniture: 'https://placehold.co/800x800/f6ad55/ffffff/png?text=Furniture',
  clothing: 'https://placehold.co/800x800/fc8181/ffffff/png?text=Clothing',
  construction: 'https://placehold.co/800x800/f687b3/ffffff/png?text=Construction',
  textile: 'https://placehold.co/800x800/9f7aea/ffffff/png?text=Textile',
  equipment: 'https://placehold.co/800x800/48bb78/ffffff/png?text=Equipment',
  default: 'https://placehold.co/800x800/cbd5e0/2d3748/png?text=Product'
}

async function setupStorage() {
  console.log('🚀 Настройка Supabase Storage для изображений товаров...\n')

  try {
    // 1. Создаем bucket для изображений товаров
    console.log('📦 Создаем Storage bucket "product-images"...')
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('product-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket уже существует')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Bucket создан:', bucket)
    }

    // 2. Загружаем товары из базы
    console.log('\n📊 Загружаем товары из базы данных...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1000)

    if (productsError) throw productsError

    console.log(`✅ Найдено товаров: ${products.length}`)

    // 3. Обновляем изображения для каждого товара
    console.log('\n🖼️  Обновляем изображения товаров...')

    let updated = 0
    for (const product of products) {
      // Определяем категорию для placeholder
      const categoryKey = product.category?.toLowerCase() || 'default'
      const placeholderUrl = PLACEHOLDER_IMAGES[categoryKey] || PLACEHOLDER_IMAGES.default

      // Создаем прямую ссылку на Supabase Storage (пока используем placeholder)
      const storageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${product.id}.png`

      // Обновляем поле images в товаре
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: [placeholderUrl] // Используем placeholder пока не загрузим реальные изображения
        })
        .eq('id', product.id)

      if (updateError) {
        console.error(`❌ Ошибка обновления ${product.name}:`, updateError.message)
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`   Обновлено: ${updated}/${products.length}`)
        }
      }
    }

    console.log(`\n✅ Обновлено товаров: ${updated}/${products.length}`)

    // 4. Проверяем результат
    console.log('\n🔍 Проверяем обновленные данные...')
    const { data: check, error: checkError } = await supabase
      .from('products')
      .select('id, name, images')
      .limit(5)

    if (!checkError && check) {
      console.log('\n📸 Примеры обновленных товаров:')
      check.forEach(p => {
        console.log(`   ${p.name}: ${p.images?.[0] || 'нет изображения'}`)
      })
    }

    console.log('\n✅ ГОТОВО! Изображения товаров обновлены!')
    console.log('\n📝 Следующие шаги:')
    console.log('   1. Откройте http://localhost:3000/catalog')
    console.log('   2. Проверьте что изображения отображаются')
    console.log('   3. Позже можно загрузить реальные изображения в Storage')

  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Запускаем скрипт
setupStorage()
