import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRelevantImage(productName: string): Promise<string | null> {
  let query = '';

  if (productName.includes('Дрель')) {
    if (productName.includes('Ударная')) {
      query = 'impact drill power tool professional';
    } else if (productName.includes('Аккумуляторная') || productName.includes('V')) {
      query = 'cordless drill battery tool professional';
    } else if (productName.includes('Комплект насадок')) {
      query = 'drill bits set tools case';
    } else {
      query = 'power drill professional tool';
    }
  } else if (productName.includes('LED') || productName.includes('светильник')) {
    if (productName.includes('Потолочный')) {
      query = 'ceiling led lamp fixture modern home';
    } else if (productName.includes('Настенный')) {
      query = 'wall led lamp sconce modern';
    } else if (productName.includes('RGB')) {
      query = 'rgb led strip lights colorful smart home';
    } else if (productName.includes('Умный') || productName.includes('SmartHome')) {
      query = 'smart led bulb wifi control home';
    } else if (productName.includes('Пульт ДУ')) {
      query = 'led bulb remote control smart lighting';
    } else {
      query = 'led bulb lamp bright modern';
    }
  } else {
    query = 'construction tool hardware';
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
      const randomIndex = Math.floor(Math.random() * Math.min(25, data.results.length));
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixPositions() {
  const supabase = createClient(url, serviceKey);

  console.log('🔨 Загружаю товары категории "Строительство"...\n');

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  const transformedProducts = productsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: categoriesMap.get(p.category_id) || 'Без категории',
    category_id: p.category_id,
    images: p.images || []
  })) || [];

  const constructionProducts = transformedProducts.filter(product =>
    product.category === 'Строительство'
  );

  console.log(`✅ Найдено товаров: ${constructionProducts.length}\n`);

  const positionsToFix = [9,13,17,21,24,26,28,29,30,34,42,44,45];

  console.log(`📋 Заменяю ${positionsToFix.length} позиций:\n`);

  let updated = 0;
  let failed = 0;

  for (const position of positionsToFix) {
    const product = constructionProducts[position - 1];

    if (!product) {
      console.log(`[Позиция ${position}] ❌ Товар не найден\n`);
      failed++;
      continue;
    }

    console.log(`[${position}/45] ${product.name}`);

    const newImageUrl = await getRelevantImage(product.name);

    if (!newImageUrl) {
      console.log(`   ❌ Не удалось найти изображение\n`);
      failed++;
      await sleep(1500);
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ images: [newImageUrl] })
      .eq('id', product.id);

    if (error) {
      console.log(`   ❌ Ошибка обновления: ${error.message}\n`);
      failed++;
    } else {
      console.log(`   ✅ Обновлено`);
      console.log(`   🖼️  ${newImageUrl.substring(0, 60)}...\n`);
      updated++;
    }

    await sleep(1500);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Позиций для замены: ${positionsToFix.length}`);
  console.log(`Успешно обновлено: ${updated}`);
  console.log(`Ошибок: ${failed}`);
  console.log('\n🎉 Готово! Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixPositions().catch(console.error);
