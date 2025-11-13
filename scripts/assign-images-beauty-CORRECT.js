/**
 * 🎨 ПРАВИЛЬНЫЙ скрипт для категории "Красота и здоровье"
 *
 * Логика:
 * 1. Парсим ТИП товара (увлажняющий, антивозрастной, SPF и т.д.)
 * 2. Делаем РЕЛЕВАНТНЫЙ запрос для этого типа
 * 3. Используем разные СТРАНИЦЫ для одинаковых типов (чтобы избежать дублей)
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

// Счетчики для каждого типа (чтобы использовать разные страницы)
const typeCounters = {};

// ==================== ОПРЕДЕЛЕНИЕ ТИПА ТОВАРА ====================

/**
 * Определяет ТИП товара по названию и возвращает РЕЛЕВАНТНЫЙ поисковый запрос
 */
function getRelevantSearchQuery(productName) {
  const lowerName = productName.toLowerCase();

  // Определяем тип и формируем релевантный запрос
  let searchQuery = '';
  let queryType = 'default';

  if (lowerName.includes('увлажняющий')) {
    searchQuery = 'moisturizing hydrating face cream skincare product';
    queryType = 'увлажняющий';
  }
  else if (lowerName.includes('антивозрастной')) {
    searchQuery = 'anti-aging wrinkle face cream serum skincare';
    queryType = 'антивозрастной';
  }
  else if (lowerName.includes('spf') || lowerName.includes('защита')) {
    searchQuery = 'SPF sunscreen face cream sun protection skincare';
    queryType = 'spf';
  }
  else if (lowerName.includes('для сухой кожи')) {
    searchQuery = 'dry skin face cream nourishing moisturizer';
    queryType = 'для_сухой_кожи';
  }
  else if (lowerName.includes('натуральный') || lowerName.includes('organic')) {
    searchQuery = 'natural organic face cream skincare product';
    queryType = 'натуральный';
  }
  else if (lowerName.includes('для жирной кожи')) {
    searchQuery = 'oily skin face cream mattifying skincare';
    queryType = 'для_жирной_кожи';
  }
  else if (lowerName.includes('очищающий')) {
    searchQuery = 'cleansing face wash foam skincare product';
    queryType = 'очищающий';
  }
  else if (lowerName.includes('питательный')) {
    searchQuery = 'nourishing face cream rich moisturizer skincare';
    queryType = 'питательный';
  }
  else {
    // Дефолтный запрос для кремов
    searchQuery = 'face cream skincare cosmetic product jar';
    queryType = 'default';
  }

  // Считаем сколько раз использовали этот тип
  if (!typeCounters[queryType]) {
    typeCounters[queryType] = 0;
  }
  typeCounters[queryType]++;

  // Используем разные страницы для одинаковых типов
  const page = typeCounters[queryType];

  return { query: searchQuery, page, type: queryType };
}

/**
 * Ищет РЕЛЕВАНТНОЕ изображение на Pexels
 */
async function findImageForProduct(product) {
  try {
    const { query, page, type } = getRelevantSearchQuery(product.name);

    console.log(`   🔍 Тип: "${type}"`);
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

    console.log(`   ⚠️  Не найдено на странице ${page}, пробуем следующую...`);

    // Пробуем следующую страницу
    const fallbackResult = await pexels.photos.search({
      query: query,
      per_page: 1,
      page: page + 1,
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
  console.log(`  Красота и здоровье - ПРАВИЛЬНАЯ ВЕРСИЯ`);
  console.log(`  Релевантные изображения для каждого типа`);
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

    if (products.length === 0) {
      console.log('⚠️  Нет товаров для обработки');
      return;
    }

    // 3. Обрабатываем каждый товар
    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      console.log(`\n[${i + 1}/${products.length}] 💄 ${product.name}`);

      // Ищем РЕЛЕВАНТНОЕ изображение
      const imageUrl = await findImageForProduct(product);

      if (imageUrl) {
        const updated = await updateProductImage(product.id, imageUrl);

        if (updated) {
          console.log(`   ✅ Релевантное изображение обновлено!`);
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
    console.log('\n📊 Распределение по типам:');
    Object.entries(typeCounters).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} товаров`);
    });
    console.log('========================================\n');

    console.log('🎉 Готово! Проверьте http://localhost:3000/catalog\n');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ==================== ЗАПУСК ====================

console.log('\n🚀 Запуск ПРАВИЛЬНОГО скрипта...\n');
console.log('💡 Логика:');
console.log('   1. Определяем ТИП товара (увлажняющий, антивозрастной, SPF и т.д.)');
console.log('   2. Делаем РЕЛЕВАНТНЫЙ запрос для этого типа');
console.log('   3. Используем разные страницы для одинаковых типов\n');

assignBeautyImages()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
