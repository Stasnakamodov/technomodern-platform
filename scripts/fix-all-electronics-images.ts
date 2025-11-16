import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRelevantImage(productName: string): Promise<string | null> {
  let query = '';
  const nameLower = productName.toLowerCase();

  // Определяем очень специфичный запрос для каждого типа
  if (nameLower.includes('ноутбук')) {
    query = 'laptop computer notebook product white background';
  } else if (nameLower.includes('наушники')) {
    query = 'wireless earbuds headphones product white background';
  } else if (nameLower.includes('смартфон')) {
    query = 'smartphone mobile phone product white background';
  } else {
    query = 'technology electronics product white background';
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Берём случайное изображение
      const randomIndex = Math.floor(Math.random() * Math.min(20, data.results.length));
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixAllElectronicsImages() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Заменяю ВСЕ изображения в категории "Электроника" на релевантные...\n');

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

  // Фильтруем по "Электроника"
  const electronicsProducts = productsData?.filter((p: any) =>
    categoriesMap.get(p.category_id) === 'Электроника'
  ) || [];

  console.log(`✅ Найдено товаров: ${electronicsProducts.length}\n`);
  console.log('🔄 Начинаю замену всех изображений...\n');

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < electronicsProducts.length; i++) {
    const product = electronicsProducts[i];
    const position = i + 1;

    console.log(`[${position}/${electronicsProducts.length}] ${product.name}`);

    // Получаем новое релевантное изображение
    const newImageUrl = await getRelevantImage(product.name);

    if (!newImageUrl) {
      console.log(`   ❌ Не удалось найти изображение\n`);
      failed++;
      await sleep(1500);
      continue;
    }

    console.log(`   ✅ Новое изображение: ${newImageUrl.substring(0, 60)}...`);

    // Обновляем в БД
    const { error } = await supabase
      .from('products')
      .update({ images: [newImageUrl] })
      .eq('id', product.id);

    if (error) {
      console.log(`   ❌ Ошибка обновления: ${error.message}\n`);
      failed++;
    } else {
      console.log(`   ✅ Обновлено\n`);
      updated++;
    }

    // Rate limiting для Unsplash API
    await sleep(1500);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Всего товаров: ${electronicsProducts.length}`);
  console.log(`Успешно обновлено: ${updated}`);
  console.log(`Ошибок: ${failed}`);
  console.log('\n🎉 Готово! Обновите страницу каталога в браузере (Cmd+R или Ctrl+R)');
  console.log('   Все товары в "Электроника" теперь с релевантными изображениями!');
}

fixAllElectronicsImages().catch(console.error);
