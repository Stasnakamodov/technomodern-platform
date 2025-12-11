/**
 * Скрипт импорта товаров из OTAPI в Supabase
 * Использует тестовый API ключ OTAPI для поиска товаров
 */

const OTAPI_KEY = '0e4fb57d-d80e-4274-acc5-f22f354e3577';
const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Поставщики для товаров
const SUPPLIERS = {
  auto: '00000004-0000-0000-0000-000000040000', // Beijing Auto Parts - для автотоваров
  home: '00000002-0000-0000-0000-000000020000', // Yiwu Trading Group - для декора/дома
  default: '00000000-0000-0000-0000-000000000000' // Guangzhou Tech Co.
};

/**
 * Поиск товаров через OTAPI
 */
async function searchOTAPI(query, framePosition = 0, frameSize = 40) {
  const xmlParams = `<SearchItemsParameters><ItemTitle>${encodeXML(query)}</ItemTitle></SearchItemsParameters>`;
  const url = `http://otapi.net/service-json/SearchItemsFrame?instanceKey=${OTAPI_KEY}&language=ru&signature=&timestamp=&framePosition=${framePosition}&frameSize=${frameSize}&xmlParameters=${encodeURIComponent(xmlParams)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.ErrorCode !== 'Ok') {
    throw new Error(`OTAPI Error: ${data.ErrorCode} - ${data.ErrorDescription || 'Unknown error'}`);
  }

  return data.Result?.Items?.Content || [];
}

/**
 * Получение детальной информации о товаре
 */
async function getItemDetails(itemId) {
  const xmlParams = `<BatchGetItemFullInfoParameters><ItemId>${itemId}</ItemId></BatchGetItemFullInfoParameters>`;
  const url = `http://otapi.net/service-json/BatchGetItemFullInfo?instanceKey=${OTAPI_KEY}&language=ru&signature=&timestamp=&xmlParameters=${encodeURIComponent(xmlParams)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.ErrorCode !== 'Ok') {
    console.warn(`Failed to get details for ${itemId}:`, data.ErrorCode);
    return null;
  }

  return data.Result?.Items?.Content?.[0] || null;
}

/**
 * Конвертация товара OTAPI в формат Supabase
 */
function convertToSupabaseProduct(item, categoryId, supplierId) {
  // Получаем цену в рублях (конвертируем из CNY)
  const priceYuan = item.Price?.OriginalPrice || 0;
  const priceRub = Math.round(priceYuan * 12.5); // Примерный курс CNY/RUB

  // Собираем изображения
  const images = [];
  if (item.MainPictureUrl) {
    images.push(item.MainPictureUrl);
  }
  if (item.Pictures) {
    item.Pictures.forEach(pic => {
      if (pic.Url && !images.includes(pic.Url)) {
        images.push(pic.Url);
      }
    });
  }

  // Ограничиваем до 5 изображений
  const limitedImages = images.slice(0, 5);

  return {
    name: item.Title || item.OriginalTitle || 'Без названия',
    description: item.OriginalTitle || item.Title || '',
    price: priceRub > 0 ? priceRub : 100,
    images: limitedImages,
    sku: `OTAPI-${item.Id}`,
    category_id: categoryId,
    supplier_id: supplierId,
    in_stock: true,
    min_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Проверка существования товара по SKU
 */
async function checkProductExists(sku) {
  const url = `${SUPABASE_URL}/rest/v1/products?sku=eq.${encodeURIComponent(sku)}&select=id`;
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await response.json();
  return data.length > 0;
}

/**
 * Добавление товара в Supabase
 */
async function insertProduct(product) {
  const url = `${SUPABASE_URL}/rest/v1/products`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to insert product: ${error}`);
  }

  return await response.json();
}

/**
 * Обновление счетчика товаров в категории
 */
async function updateCategoryCount(categoryId) {
  // Подсчитываем товары
  const countUrl = `${SUPABASE_URL}/rest/v1/products?category_id=eq.${categoryId}&in_stock=eq.true&deleted_at=is.null&select=id`;
  const countResponse = await fetch(countUrl, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
      'Range': '0-0'
    }
  });

  const contentRange = countResponse.headers.get('content-range');
  const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0;

  // Обновляем категорию
  const updateUrl = `${SUPABASE_URL}/rest/v1/categories?id=eq.${categoryId}`;
  await fetch(updateUrl, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_count: count })
  });

  return count;
}

/**
 * Экранирование XML
 */
function encodeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Задержка
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Основная функция импорта
 */
async function importProducts(categoryId, searchQueries, targetCount = 88, supplierId = SUPPLIERS.default) {
  console.log(`\n========================================`);
  console.log(`Импорт товаров в категорию: ${categoryId}`);
  console.log(`Целевое количество: ${targetCount}`);
  console.log(`Поисковые запросы: ${searchQueries.join(', ')}`);
  console.log(`========================================\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const query of searchQueries) {
    if (imported >= targetCount) break;

    console.log(`\n🔍 Поиск: "${query}"`);

    try {
      // Получаем товары порциями
      for (let position = 0; position < 200 && imported < targetCount; position += 40) {
        const items = await searchOTAPI(query, position, 40);

        if (items.length === 0) {
          console.log(`  Больше товаров не найдено`);
          break;
        }

        console.log(`  Найдено ${items.length} товаров (позиция ${position})`);

        for (const item of items) {
          if (imported >= targetCount) break;

          const sku = `OTAPI-${item.Id}`;

          // Проверяем, не существует ли уже
          const exists = await checkProductExists(sku);
          if (exists) {
            skipped++;
            continue;
          }

          try {
            const product = convertToSupabaseProduct(item, categoryId, supplierId);
            await insertProduct(product);
            imported++;
            console.log(`  ✅ [${imported}/${targetCount}] ${product.name.substring(0, 50)}...`);

            // Небольшая задержка между запросами
            await delay(100);
          } catch (err) {
            errors++;
            console.error(`  ❌ Ошибка: ${err.message}`);
          }
        }

        // Задержка между batch запросами к OTAPI
        await delay(500);
      }
    } catch (err) {
      console.error(`  ❌ Ошибка поиска: ${err.message}`);
    }
  }

  // Обновляем счетчик категории
  const newCount = await updateCategoryCount(categoryId);

  console.log(`\n========================================`);
  console.log(`ИТОГО:`);
  console.log(`  ✅ Импортировано: ${imported}`);
  console.log(`  ⏭️  Пропущено (дубликаты): ${skipped}`);
  console.log(`  ❌ Ошибок: ${errors}`);
  console.log(`  📊 Всего в категории: ${newCount}`);
  console.log(`========================================\n`);

  return { imported, skipped, errors, total: newCount };
}

// =============================================
// КОНФИГУРАЦИЯ ИМПОРТА
// =============================================

const CATEGORIES_TO_IMPORT = [
  {
    id: '0dcee08a-a381-41d2-a05c-c54d7a39df9b', // Системы хранения
    name: 'Системы хранения',
    queries: [
      'органайзер для шкафа',
      'коробка для хранения пластик',
      'корзина для белья',
      'вешалка для одежды',
      'полка настенная',
      'ящик для инструментов',
      'контейнер пищевой',
      'органайзер для косметики',
      'стеллаж металлический',
      'кофр для хранения',
      'вакуумный пакет для одежды',
      'подставка для обуви',
      'крючки настенные',
      'держатель для полотенец',
      'органайзер для документов'
    ],
    target: 482, // чтобы общий импорт = 888
    supplierId: SUPPLIERS.home
  }
];

// =============================================
// ЗАПУСК
// =============================================

async function main() {
  console.log('🚀 Запуск импорта товаров из OTAPI\n');
  console.log(`API Key: ${OTAPI_KEY.substring(0, 8)}...`);
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  for (const category of CATEGORIES_TO_IMPORT) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📦 Категория: ${category.name}`);
    console.log(`${'='.repeat(50)}`);

    await importProducts(category.id, category.queries, category.target, category.supplierId);

    // Пауза между категориями
    await delay(2000);
  }

  console.log('\n✅ Импорт завершен!');
}

main().catch(console.error);
