/**
 * 🎨 Скрипт для назначения изображений товарам категории "Красота и здоровье"
 *
 * Использование:
 * node scripts/assign-images-beauty.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient: createPexelsClient } = require('pexels');
const { createClient } = require('@supabase/supabase-js');

// ==================== КОНФИГУРАЦИЯ ====================

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Целевая категория
const TARGET_CATEGORY = 'Красота и здоровье';

// Задержка между запросами (мс)
const REQUEST_DELAY = 2000;

// ==================== ИНИЦИАЛИЗАЦИЯ КЛИЕНТОВ ====================

if (!PEXELS_API_KEY) {
  console.error('❌ ОШИБКА: Не найден PEXELS_API_KEY в .env.local');
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
 * Переводит русские термины на английский (специально для косметики и здоровья)
 */
function translateToEnglish(russianText, categoryName) {
  const dictionary = {
    // Косметика и уход
    'крем': 'cream skincare',
    'маска': 'face mask skincare',
    'сыворотка': 'serum skincare',
    'тоник': 'toner skincare',
    'пенка': 'foam cleanser',
    'гель': 'gel',
    'лосьон': 'lotion',
    'шампунь': 'shampoo',
    'кондиционер': 'conditioner hair',
    'бальзам': 'balm',
    'помада': 'lipstick makeup',
    'тушь': 'mascara makeup',
    'тени': 'eyeshadow makeup',
    'румяна': 'blush makeup',
    'пудра': 'powder makeup',
    'тональный': 'foundation makeup',
    'консилер': 'concealer makeup',
    'парфюм': 'perfume fragrance',
    'духи': 'perfume fragrance',
    'туалетная вода': 'eau de toilette',
    'дезодорант': 'deodorant',

    // Уход за телом
    'мыло': 'soap',
    'гель для душа': 'shower gel',
    'скраб': 'scrub exfoliator',
    'пилинг': 'peeling',
    'массаж': 'massage',
    'масло': 'oil',
    'крем для рук': 'hand cream',
    'крем для ног': 'foot cream',
    'крем для тела': 'body cream',

    // Уход за волосами
    'маска для волос': 'hair mask',
    'спрей': 'spray',
    'воск': 'wax hair',
    'лак': 'hairspray',
    'расческа': 'brush comb',
    'фен': 'hair dryer',
    'плойка': 'curling iron',
    'утюжок': 'hair straightener',

    // Уход за ногтями
    'лак для ногтей': 'nail polish',
    'маникюр': 'manicure',
    'педикюр': 'pedicure',
    'пилка': 'nail file',

    // Здоровье
    'витамины': 'vitamins supplements',
    'бад': 'supplements',
    'протеин': 'protein powder',
    'коллаген': 'collagen',
    'омега': 'omega fish oil',
    'массажер': 'massager',
    'термометр': 'thermometer',
    'тонометр': 'blood pressure monitor',
    'ингалятор': 'inhaler nebulizer',
    'грелка': 'heating pad',

    // Гигиена
    'зубная щетка': 'toothbrush',
    'зубная паста': 'toothpaste',
    'ополаскиватель': 'mouthwash',
    'бритва': 'razor shaver',
    'эпилятор': 'epilator',
    'триммер': 'trimmer',

    // Характеристики
    'увлажняющий': 'moisturizing hydrating',
    'питательный': 'nourishing',
    'очищающий': 'cleansing',
    'антивозрастной': 'anti-aging',
    'солнцезащитный': 'sunscreen SPF',
    'органический': 'organic natural',
    'натуральный': 'natural organic',
    'гипоаллергенный': 'hypoallergenic',
    'для чувствительной кожи': 'sensitive skin',
    'для сухой кожи': 'dry skin',
    'для жирной кожи': 'oily skin',
    'матирующий': 'mattifying',
    'сияние': 'glow radiance',

    // Бренды (если нужно)
    'корейский': 'korean k-beauty',
    'японский': 'japanese j-beauty',

    // Категории
    'красота': 'beauty cosmetics',
    'здоровье': 'health wellness',
    'косметика': 'cosmetics makeup',
    'уход': 'skincare',
    'макияж': 'makeup',
    'парфюмерия': 'perfume fragrance',

    // Дополнительные термины
    'для лица': 'face facial',
    'для тела': 'body',
    'для волос': 'hair',
    'для ногтей': 'nails',
    'для губ': 'lips',
    'для глаз': 'eyes',
    'для рук': 'hands',
    'для ног': 'feet',
  };

  let englishQuery = russianText.toLowerCase();

  // Заменяем известные термины
  Object.entries(dictionary).forEach(([ru, en]) => {
    const regex = new RegExp(ru, 'gi');
    englishQuery = englishQuery.replace(regex, en);
  });

  // Всегда добавляем "beauty" для лучшего поиска
  englishQuery += ' beauty';

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
      orientation: 'square',
    });

    if (result.photos && result.photos.length > 0) {
      const photo = result.photos[0];
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

async function assignBeautyImages() {
  console.log('\n💄 ========================================');
  console.log(`  Красота и здоровье`);
  console.log(`  Назначение уникальных изображений`);
  console.log('========================================\n');

  try {
    // 1. Находим категорию "Красота и здоровье"
    console.log(`📁 Ищем категорию "${TARGET_CATEGORY}"...`);
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', `%${TARGET_CATEGORY}%`);

    if (categoriesError) {
      throw new Error(`Ошибка загрузки категорий: ${categoriesError.message}`);
    }

    if (!categories || categories.length === 0) {
      throw new Error(`Категория "${TARGET_CATEGORY}" не найдена`);
    }

    const beautyCategory = categories[0];
    console.log(`✅ Найдена категория: ${beautyCategory.name} (ID: ${beautyCategory.id})\n`);

    // 2. Загружаем все товары этой категории
    console.log(`📦 Загружаем товары категории "${TARGET_CATEGORY}"...`);
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

      // Ищем изображение
      const imageUrl = await findImageForProduct(product, beautyCategory.name);

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
    console.log(`   💄 Категория: ${beautyCategory.name}`);
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

console.log('\n🚀 Запуск скрипта для категории "Красота и здоровье"...\n');

assignBeautyImages()
  .then(() => {
    console.log('✅ Скрипт завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
