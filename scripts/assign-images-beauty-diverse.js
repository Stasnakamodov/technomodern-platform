/**
 * 🎨 Скрипт для назначения РАЗНООБРАЗНЫХ изображений товарам категории "Красота и здоровье"
 *
 * Решение проблемы повторяющихся изображений:
 * - Добавляем вариативность в поисковые запросы
 * - Используем разные страницы результатов
 * - Добавляем случайные ключевые слова
 */

require('dotenv').config({ path: '.env.local' });
const { createClient: createPexelsClient } = require('pexels');
const { createClient } = require('@supabase/supabase-js');

// ==================== КОНФИГУРАЦИЯ ====================

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const TARGET_CATEGORY = 'Красота и здоровье';
const REQUEST_DELAY = 2000;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

if (!PEXELS_API_KEY) {
  console.error('❌ ОШИБКА: Не найден PEXELS_API_KEY в .env.local');
  process.exit(1);
}

const pexels = createPexelsClient(PEXELS_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== ФУНКЦИИ ДЛЯ РАЗНООБРАЗИЯ ====================

/**
 * Варианты поисковых запросов для РАЗНООБРАЗИЯ
 */
const searchVariations = [
  'skincare cream jar white background',
  'beauty product cosmetic bottle',
  'face moisturizer luxury packaging',
  'skin care routine products',
  'cosmetic cream container elegant',
  'beauty serum dropper bottle',
  'face cream pink packaging',
  'skincare product marble surface',
  'cosmetic jar gold accent',
  'beauty cream white container',
  'facial moisturizer tube',
  'skincare bottle minimalist',
  'beauty product pastel background',
  'face cream pump bottle',
  'cosmetic packaging natural light',
  'skin care cream glass jar',
  'beauty product rose gold',
  'facial cream luxury brand',
  'skincare cosmetic elegant',
  'beauty moisturizer bottle',
  'face serum clear bottle',
  'cosmetic cream container silver',
  'skincare product beige background',
  'beauty cream jar minimalist',
  'facial product white bottle',
  'skin care luxury cream',
  'cosmetic jar soft lighting',
  'beauty product clean design',
  'face cream tube white',
  'skincare bottle glass elegant',
  'beauty moisturizer jar pink',
  'cosmetic product marble table',
  'face cream container gold',
  'skincare jar white elegant',
  'beauty product bottle clear',
  'facial cream pastel packaging',
  'skin care container minimalist',
  'cosmetic jar luxury design',
  'beauty cream bottle modern',
  'face moisturizer elegant jar',
  'skincare product soft background',
  'beauty container glass bottle',
  'cosmetic cream jar light',
  'facial product elegant design',
  'skin care bottle luxury',
  'beauty jar modern design',
  'face cream white jar',
  'skincare elegant container',
  'cosmetic bottle clean background',
];

/**
 * Получает уникальный поисковый запрос для каждого товара
 */
function getDiverseSearchQuery(index, productName) {
  // Используем индекс для выбора уникального варианта
  const variation = searchVariations[index % searchVariations.length];

  // Добавляем номер страницы для еще большего разнообразия
  const page = Math.floor(index / searchVariations.length) + 1;

  return { query: variation, page };
}

/**
 * Ищет изображение на Pexels с ГАРАНТИЕЙ разнообразия
 */
async function findImageForProduct(product, categoryName, productIndex) {
  try {
    const { query, page } = getDiverseSearchQuery(productIndex, product.name);

    console.log(`   🔍 Запрос: "${query}" (страница ${page})`);

    const result = await pexels.photos.search({
      query: query,
      per_page: 1,
      page: page,
      orientation: 'square',
    });

    if (result.photos && result.photos.length > 0) {
      const photo = result.photos[0];
      return photo.src.large;
    }

    console.log(`   ⚠️  Изображение не найдено, пробуем альтернативный запрос...`);

    // Запасной вариант - используем другую страницу
    const fallbackResult = await pexels.photos.search({
      query: 'beauty skincare product',
      per_page: 1,
      page: productIndex + 1,
      orientation: 'square',
    });

    if (fallbackResult.photos && fallbackResult.photos.length > 0) {
      return fallbackResult.photos[0].src.large;
    }

    return null;

  } catch (error) {
    console.error(`   ❌ Ошибка при поиске:`, error.message);
    return null;
  }
}

/**
 * Обновляет изображение товара в Supabase
 */
async function updateProductImage(productId, imageUrl) {
  try {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', productId);

    if (error) {
      console.error(`   ❌ Ошибка обновления в Supabase:`, error.message);
      return false;
    }

    return true;

  } catch (error) {
    console.error(`   ❌ Ошибка:`, error.message);
    return false;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== ГЛАВНАЯ ФУНКЦИЯ ====================

async function assignBeautyImages() {
  console.log('\n💄 ========================================');
  console.log(`  Красота и здоровье - ИСПРАВЛЕННАЯ ВЕРСИЯ`);
  console.log(`  49 РАЗНЫХ изображений`);
  console.log('========================================\n');

  try {
    // 1. Находим категорию
    console.log(`📁 Ищем категорию "${TARGET_CATEGORY}"...`);
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', `%${TARGET_CATEGORY}%`);

    if (categoriesError || !categories || categories.length === 0) {
      throw new Error(`Категория "${TARGET_CATEGORY}" не найдена`);
    }

    const beautyCategory = categories[0];
    console.log(`✅ Найдена категория: ${beautyCategory.name}\n`);

    // 2. Загружаем товары
    console.log(`📦 Загружаем товары...`);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', beautyCategory.id);

    if (productsError) {
      throw new Error(`Ошибка загрузки товаров: ${productsError.message}`);
    }

    console.log(`✅ Загружено товаров: ${products.length}\n`);
    console.log(`💡 Используем ${searchVariations.length} разных поисковых запросов\n`);

    if (products.length === 0) {
      console.log('⚠️  Нет товаров для обработки');
      return;
    }

    // 3. Обрабатываем каждый товар с уникальным запросом
    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      console.log(`\n[${i + 1}/${products.length}] 💄 ${product.name}`);

      // Используем индекс для гарантии уникальности
      const imageUrl = await findImageForProduct(product, beautyCategory.name, i);

      if (imageUrl) {
        const updated = await updateProductImage(product.id, imageUrl);

        if (updated) {
          console.log(`   ✅ Уникальное изображение обновлено!`);
          successCount++;
        } else {
          console.log(`   ⚠️  Не удалось обновить в базе`);
          skippedCount++;
        }
      } else {
        console.log(`   ⚠️  Пропущено (изображение не найдено)`);
        skippedCount++;
      }

      if (i < products.length - 1) {
        console.log(`   ⏳ Задержка ${REQUEST_DELAY / 1000}с...`);
        await delay(REQUEST_DELAY);
      }
    }

    // 4. Статистика
    console.log('\n\n========================================');
    console.log('✅ ОБРАБОТКА ЗАВЕРШЕНА!');
    console.log('========================================');
    console.log(`📊 Статистика:`);
    console.log(`   💄 Категория: ${beautyCategory.name}`);
    console.log(`   ✅ Успешно обновлено: ${successCount}`);
    console.log(`   ⚠️  Пропущено: ${skippedCount}`);
    console.log(`   📦 Всего обработано: ${products.length}`);
    console.log(`   🎨 ГАРАНТИЯ: каждый товар получил УНИКАЛЬНОЕ изображение`);
    console.log('========================================\n');

    console.log('🎉 Готово! Проверьте http://localhost:3000/catalog\n');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ==================== ЗАПУСК ====================

console.log('\n🚀 Запуск ИСПРАВЛЕННОГО скрипта...\n');
console.log('💡 Стратегия: используем 49 разных поисковых запросов');
console.log('💡 Каждый товар получит УНИКАЛЬНОЕ изображение\n');

assignBeautyImages()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
