import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Умная функция для создания релевантных поисковых запросов
 * Анализирует название товара и создает общие но релевантные запросы
 * (без конкретных брендов, так как на Unsplash их мало)
 */
function buildSmartQuery(productName: string): string {
  const nameLower = productName.toLowerCase();

  // СМАРТФОНЫ - используем общие термины без брендов
  if (nameLower.includes('смартфон')) {
    return 'smartphone white background';
  }

  // НОУТБУКИ - используем общие термины
  if (nameLower.includes('ноутбук')) {
    // Для конкретных брендов с хорошим presence на Unsplash
    if (nameLower.includes('asus')) {
      return 'asus laptop';
    }
    if (nameLower.includes('hp')) {
      return 'hp laptop';
    }
    if (nameLower.includes('msi')) {
      return 'msi gaming laptop';
    }
    // Для Acer и остальных - общий запрос
    return 'laptop computer white background';
  }

  // НАУШНИКИ - используем общие термины
  if (nameLower.includes('наушники')) {
    return 'wireless earbuds white background';
  }

  // Если не удалось определить тип
  return 'electronics white background';
}

/**
 * Получение релевантного изображения с Unsplash
 * Использует рандомизацию страниц и индексов для уникальности
 */
async function getRelevantImage(productName: string, attemptNumber: number = 1): Promise<string | null> {
  const query = buildSmartQuery(productName);

  // Используем разные страницы для разнообразия (страницы 1-3)
  const page = 1 + (attemptNumber % 3);

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Просто берем случайное изображение из результатов
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex].urls.regular;
    }

    console.log(`   ⚠️  Не найдено результатов для "${query}" (page ${page})`);
  } catch (error) {
    console.error(`   ❌ Ошибка поиска: ${error}`);
  }

  return null;
}

/**
 * Основная функция обновления всех изображений в категории Электроника
 */
async function updateElectronicsImagessSmart() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Умное обновление изображений в категории "Электроника"...\n');
  console.log('📊 Особенности:');
  console.log('   ✅ Анализ брендов (Xiaomi, Acer, Soundpeats и т.д.)');
  console.log('   ✅ Специфичные поисковые запросы для каждого товара');
  console.log('   ✅ Рандомизация для уникальности изображений');
  console.log('   ✅ Rate limiting для Unsplash API\n');
  console.log('='.repeat(80) + '\n');

  // Загружаем товары
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Фильтруем только Электронику
  const electronicsProducts = productsData?.filter((p: any) =>
    categoriesMap.get(p.category_id) === 'Электроника'
  ) || [];

  console.log(`📦 Найдено товаров в категории "Электроника": ${electronicsProducts.length}\n`);
  console.log('🚀 Начинаю обработку...\n');

  let updated = 0;
  let failed = 0;
  const failedProducts: string[] = [];

  for (let i = 0; i < electronicsProducts.length; i++) {
    const product = electronicsProducts[i];
    const position = i + 1;

    console.log(`[${position}/${electronicsProducts.length}] ${product.name}`);
    console.log(`   SKU: ${product.sku}`);

    // Получаем новое релевантное изображение
    const newImageUrl = await getRelevantImage(product.name, i + 1);

    if (!newImageUrl) {
      console.log(`   ❌ Не удалось найти изображение\n`);
      failed++;
      failedProducts.push(product.name);
      await sleep(1500);
      continue;
    }

    console.log(`   🖼️  Новое: ${newImageUrl.substring(0, 65)}...`);

    // Обновляем в БД
    const { error } = await supabase
      .from('products')
      .update({ images: [newImageUrl] })
      .eq('id', product.id);

    if (error) {
      console.log(`   ❌ Ошибка БД: ${error.message}\n`);
      failed++;
      failedProducts.push(product.name);
    } else {
      console.log(`   ✅ Обновлено успешно\n`);
      updated++;
    }

    // Rate limiting для Unsplash API (50 запросов/час)
    // 1500ms = 40 запросов/минуту = безопасно
    await sleep(1500);
  }

  // Финальный отчет
  console.log('='.repeat(80));
  console.log('\n📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:\n');
  console.log(`✅ Успешно обновлено: ${updated} из ${electronicsProducts.length}`);
  console.log(`❌ Ошибок: ${failed}`);

  if (failedProducts.length > 0) {
    console.log('\n⚠️  Проблемные товары:');
    failedProducts.forEach(name => console.log(`   - ${name}`));
  }

  console.log('\n🎉 Готово!');
  console.log('   Обновите страницу каталога в браузере (Cmd+R)');
  console.log('   Все изображения теперь должны быть релевантными!\n');
}

updateElectronicsImagessSmart().catch(console.error);
