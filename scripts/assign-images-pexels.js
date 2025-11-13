/**
 * 🎨 Скрипт для назначения изображений через Pexels API
 *
 * Преимущества Pexels:
 * - 200 запросов в час (vs 50 у Unsplash)
 * - Высокое качество изображений
 * - Бесплатный доступ
 *
 * Использование:
 * 1. Получите Pexels API ключ на https://www.pexels.com/api/
 * 2. Добавьте PEXELS_API_KEY в .env.local
 * 3. Запустите: node scripts/assign-images-pexels.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient: createPexelsClient } = require('pexels');
const { createClient } = require('@supabase/supabase-js');

// ==================== КОНФИГУРАЦИЯ ====================

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Настройки обработки
const PRODUCTS_LIMIT = 50;
const PRODUCTS_OFFSET = 50; // Начинаем с 51-го товара
const REQUEST_DELAY = 2000; // Задержка между запросами

// ==================== ИНИЦИАЛИЗАЦИЯ КЛИЕНТОВ ====================

if (!PEXELS_API_KEY) {
  console.error('❌ ОШИБКА: Не найден PEXELS_API_KEY в .env.local');
  console.log('\n📋 Инструкция:');
  console.log('1. Зарегистрируйтесь на https://www.pexels.com/api/');
  console.log('2. Создайте API ключ');
  console.log('3. Добавьте в .env.local: PEXELS_API_KEY=your_key_here');
  process.exit(1);
}

const pexels = createPexelsClient(PEXELS_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Извлекает ключевые слова из названия товара
 */
function extractKeywords(productName) {
  let keywords = productName
    .replace(/\d+/g, '')
    .replace(/[A-Z]{2,}/g, '')
    .replace(/Pro|Max|Ultra|Plus|Mini|Lite/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return keywords;
}

/**
 * Переводит русские термины на английский
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
    'зарядка': 'charger',
    'кабель': 'cable',
    'повербанк': 'powerbank',

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
    'сумка': 'bag',
    'рюкзак': 'backpack',

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
    'посуда': 'dishes',
    'кухня': 'kitchen',

    // Спорт
    'гантели': 'dumbbells',
    'коврик': 'mat',
    'тренажер': 'fitness equipment',
    'велосипед': 'bicycle',
    'скейтборд': 'skateboard',

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
    'мужской': 'men',
    'женский': 'women',
    'детский': 'kids',
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

  Object.entries(dictionary).forEach(([ru, en]) => {
    const regex = new RegExp(ru, 'gi');
    englishQuery = englishQuery.replace(regex, en);
  });

  const categoryEnglish = dictionary[categoryName?.toLowerCase()] || '';
  if (categoryEnglish) {
    englishQuery += ' ' + categoryEnglish;
  }

  return englishQuery.trim();
}

/**
 * Ищет изображение на Pexels
 */
async function findImageForProduct(product, categoryName) {
  try {
    const keywords = extractKeywords(product.name);
    const englishQuery = translateToEnglish(keywords, categoryName);

    console.log(`   🔍 Поисковый запрос: "${englishQuery}"`);

    const result = await pexels.photos.search({
      query: englishQuery,
      per_page: 1,
      orientation: 'square', // Квадратные изображения
    });

    if (result.photos && result.photos.length > 0) {
      const photo = result.photos[0];
      // Используем средний размер для оптимальной загрузки
      return photo.src.large;
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
  console.log('  Назначение изображений через Pexels');
  console.log(`  Товары: ${PRODUCTS_OFFSET + 1}-${PRODUCTS_OFFSET + PRODUCTS_LIMIT}`);
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

    // 2. Загружаем товары с offset
    console.log(`📦 Загружаем товары ${PRODUCTS_OFFSET + 1}-${PRODUCTS_OFFSET + PRODUCTS_LIMIT}...`);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .range(PRODUCTS_OFFSET, PRODUCTS_OFFSET + PRODUCTS_LIMIT - 1);

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
      const categoryName = categoryMap.get(product.category_id) || 'Неизвестная категория';

      console.log(`\n[${i + 1}/${products.length}] 📦 ${product.name}`);
      console.log(`   📂 Категория: ${categoryName}`);

      // Ищем изображение
      const imageUrl = await findImageForProduct(product, categoryName);

      if (imageUrl) {
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

    console.log('🎉 Готово! Откройте http://localhost:3000/catalog для проверки\n');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ==================== ЗАПУСК ====================

console.log('\n🚀 Запуск скрипта Pexels...\n');

assignContextualImages()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
