/**
 * 🎨 Скрипт для назначения уникальных изображений товарам из Unsplash
 *
 * Использование:
 * 1. Получите Unsplash API ключ на https://unsplash.com/developers
 * 2. Добавьте UNSPLASH_ACCESS_KEY в .env.local
 * 3. Запустите: node scripts/assign-contextual-images.js
 */

require('dotenv').config({ path: '.env.local' });
const { createApi } = require('unsplash-js');
const { createClient } = require('@supabase/supabase-js');

// ==================== КОНФИГУРАЦИЯ ====================

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Количество товаров для обработки
const PRODUCTS_LIMIT = 50;

// Задержка между запросами (мс)
const REQUEST_DELAY = 3000;

// ==================== ИНИЦИАЛИЗАЦИЯ КЛИЕНТОВ ====================

if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ ОШИБКА: Не найден UNSPLASH_ACCESS_KEY в .env.local');
  console.log('\n📋 Инструкция:');
  console.log('1. Зарегистрируйтесь на https://unsplash.com/developers');
  console.log('2. Создайте приложение');
  console.log('3. Скопируйте Access Key');
  console.log('4. Добавьте в .env.local: UNSPLASH_ACCESS_KEY=your_key_here');
  process.exit(1);
}

const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Извлекает ключевые слова из названия товара
 * Убирает артикулы, модели, цифры
 */
function extractKeywords(productName) {
  let keywords = productName
    .replace(/\d+/g, '') // Убрать все цифры
    .replace(/[A-Z]{2,}/g, '') // Убрать артикулы (несколько заглавных букв подряд)
    .replace(/Pro|Max|Ultra|Plus|Mini|Lite/gi, '') // Убрать модификаторы
    .replace(/\s+/g, ' ') // Убрать множественные пробелы
    .trim();

  return keywords;
}

/**
 * Переводит русские термины на английский для лучшего поиска
 */
function translateToEnglish(russianText, categoryName) {
  const dictionary = {
    // Электроника
    'смартфон': 'smartphone',
    'телефон': 'phone',
    'ноутбук': 'laptop',
    'компьютер': 'computer',
    'планшет': 'tablet',
    'наушники': 'headphones',
    'колонка': 'speaker',
    'клавиатура': 'keyboard',
    'мышь': 'mouse',
    'монитор': 'monitor',
    'часы': 'watch smartwatch',
    'камера': 'camera',
    'телевизор': 'tv television',

    // Одежда
    'куртка': 'jacket',
    'пальто': 'coat',
    'футболка': 'tshirt',
    'рубашка': 'shirt',
    'брюки': 'pants',
    'джинсы': 'jeans',
    'платье': 'dress',
    'юбка': 'skirt',
    'костюм': 'suit',
    'кроссовки': 'sneakers',
    'ботинки': 'boots',
    'туфли': 'shoes',

    // Мебель
    'диван': 'sofa',
    'кресло': 'armchair',
    'стол': 'table',
    'стул': 'chair',
    'шкаф': 'wardrobe cabinet',
    'кровать': 'bed',
    'комод': 'dresser',
    'полка': 'shelf',

    // Дом и сад
    'светильник': 'lamp',
    'люстра': 'chandelier',
    'ковер': 'carpet rug',
    'подушка': 'pillow',
    'одеяло': 'blanket',
    'шторы': 'curtains',
    'ваза': 'vase',
    'картина': 'painting',

    // Категории
    'электроника': 'electronics',
    'одежда': 'clothing fashion',
    'мебель': 'furniture',
    'дом': 'home',
    'сад': 'garden',
    'спорт': 'sport fitness',
    'игрушки': 'toys',
    'красота': 'beauty cosmetics',
    'книги': 'books',
    'автомобиль': 'car automotive',

    // Характеристики
    'мужской': 'men male',
    'женский': 'women female',
    'детский': 'kids children',
    'угловой': 'corner',
    'складной': 'folding',
    'портативный': 'portable',
    'беспроводной': 'wireless',
    'тканевый': 'fabric',
    'кожаный': 'leather',
    'деревянный': 'wooden',
    'металлический': 'metal',
  };

  let englishQuery = russianText.toLowerCase();

  // Заменяем известные термины
  Object.entries(dictionary).forEach(([ru, en]) => {
    const regex = new RegExp(ru, 'gi');
    englishQuery = englishQuery.replace(regex, en);
  });

  // Добавляем категорию
  const categoryEnglish = dictionary[categoryName?.toLowerCase()] || '';
  if (categoryEnglish) {
    englishQuery += ' ' + categoryEnglish;
  }

  return englishQuery.trim();
}

/**
 * Ищет изображение на Unsplash для товара
 */
async function findImageForProduct(product, categoryName) {
  try {
    // Извлекаем ключевые слова
    const keywords = extractKeywords(product.name);

    // Переводим на английский для лучшего поиска
    const englishQuery = translateToEnglish(keywords, categoryName);

    console.log(`   🔍 Поисковый запрос: "${englishQuery}"`);

    // Ищем на Unsplash
    const result = await unsplash.search.getPhotos({
      query: englishQuery,
      perPage: 1,
      orientation: 'squarish', // Квадратные изображения лучше для карточек
    });

    if (result.errors) {
      console.error(`   ❌ Ошибка Unsplash API:`, result.errors);
      return null;
    }

    if (result.response?.results?.length > 0) {
      const photo = result.response.results[0];

      // Возвращаем URL изображения в высоком качестве
      return photo.urls.regular;
    }

    console.log(`   ⚠️  Изображение не найдено`);
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

/**
 * Задержка выполнения
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== ГЛАВНАЯ ФУНКЦИЯ ====================

async function assignContextualImages() {
  console.log('\n🎨 ========================================');
  console.log('  Назначение уникальных изображений');
  console.log('========================================\n');

  try {
    // 1. Загружаем категории
    console.log('📁 Загружаем категории...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      throw new Error(`Ошибка загрузки категорий: ${categoriesError.message}`);
    }

    const categoryMap = new Map(categories.map(c => [c.id, c.name]));
    console.log(`✅ Загружено категорий: ${categories.length}\n`);

    // 2. Загружаем первые N товаров
    console.log(`📦 Загружаем первые ${PRODUCTS_LIMIT} товаров...`);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(PRODUCTS_LIMIT);

    if (productsError) {
      throw new Error(`Ошибка загрузки товаров: ${productsError.message}`);
    }

    console.log(`✅ Загружено товаров: ${products.length}\n`);

    // 3. Обрабатываем каждый товар
    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const categoryName = categoryMap.get(product.category_id) || 'Неизвестная категория';

      console.log(`\n[${ i + 1}/${products.length}] 📦 ${product.name}`);
      console.log(`   📂 Категория: ${categoryName}`);

      // Ищем изображение
      const imageUrl = await findImageForProduct(product, categoryName);

      if (imageUrl) {
        // Обновляем в базе
        const updated = await updateProductImage(product.id, imageUrl);

        if (updated) {
          console.log(`   ✅ Изображение обновлено!`);
          successCount++;
        } else {
          console.log(`   ⚠️  Не удалось обновить в базе`);
          skippedCount++;
        }
      } else {
        console.log(`   ⚠️  Пропущено (изображение не найдено)`);
        skippedCount++;
      }

      // Задержка между запросами для соблюдения rate limit
      if (i < products.length - 1) {
        console.log(`   ⏳ Задержка ${REQUEST_DELAY / 1000}с...`);
        await delay(REQUEST_DELAY);
      }
    }

    // 4. Итоговая статистика
    console.log('\n\n========================================');
    console.log('✅ ОБРАБОТКА ЗАВЕРШЕНА!');
    console.log('========================================');
    console.log(`📊 Статистика:`);
    console.log(`   ✅ Успешно обновлено: ${successCount}`);
    console.log(`   ⚠️  Пропущено: ${skippedCount}`);
    console.log(`   📦 Всего обработано: ${products.length}`);
    console.log('========================================\n');

    // 5. Рекомендации
    if (skippedCount > 0) {
      console.log('💡 Рекомендации:');
      console.log('   - Проверьте пропущенные товары в базе данных');
      console.log('   - Возможно, нужно улучшить поисковые запросы');
      console.log('   - Можно запустить скрипт повторно для пропущенных товаров\n');
    }

    console.log('🎉 Готово! Откройте http://localhost:3000/catalog для проверки\n');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ==================== ЗАПУСК ====================

console.log('\n🚀 Запуск скрипта...\n');

assignContextualImages()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
