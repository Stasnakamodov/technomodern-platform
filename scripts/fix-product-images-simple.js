const { createClient } = require('@supabase/supabase-js')

// Используем обычный клиент (работает с ANON key)
const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Рабочие placeholder изображения (гарантированно загружаются)
const CATEGORY_IMAGES = {
  'Электроника': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop',
  'Мебель': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
  'Одежда': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop',
  'Строительство': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=800&fit=crop',
  'Текстиль': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  'Оборудование': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=800&fit=crop'
}

async function fixImages() {
  console.log('🚀 Исправляем изображения товаров...\n')

  try {
    // 1. Получаем все категории
    console.log('📂 Загружаем категории...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')

    if (catError) throw catError
    console.log(`✅ Найдено категорий: ${categories.length}\n`)

    // Создаем мапу категорий
    const categoryMap = new Map(categories.map(c => [c.id, c.name]))

    // 2. Получаем все товары
    console.log('📦 Загружаем товары...')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')

    if (prodError) throw prodError
    console.log(`✅ Найдено товаров: ${products.length}\n`)

    // 3. Обновляем изображения
    console.log('🖼️  Обновляем изображения...\n')

    let updated = 0
    let failed = 0

    for (const product of products) {
      const categoryName = categoryMap.get(product.category_id) || 'Электроника'
      const imageUrl = CATEGORY_IMAGES[categoryName] || CATEGORY_IMAGES['Электроника']

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

      // Небольшая пауза чтобы не перегрузить API
      if (updated % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`\n✅ ГОТОВО!`)
    console.log(`   Обновлено: ${updated}`)
    console.log(`   Ошибок: ${failed}`)
    console.log(`   Всего: ${products.length}\n`)

    // 4. Проверяем результат
    console.log('🔍 Проверяем обновленные данные...\n')
    const { data: check, error: checkError } = await supabase
      .from('products')
      .select('id, name, images')
      .limit(10)

    if (!checkError && check) {
      console.log('📸 Примеры обновленных товаров:\n')
      check.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`)
        console.log(`   URL: ${p.images?.[0] || 'нет изображения'}\n`)
      })
    }

    console.log('✅ Теперь откройте http://localhost:3000/catalog и проверьте изображения!')

  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Запускаем
fixImages()
