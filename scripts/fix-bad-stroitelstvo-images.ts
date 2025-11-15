import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedImageIds = new Set<string>();

// Улучшенные поисковые запросы с альтернативными вариантами
function getAlternativeSearchQueries(productName: string): string[] {
  const name = productName.toLowerCase();

  if (name.includes('дрель')) {
    if (name.includes('ударная')) {
      return [
        'cordless impact drill product white background',
        'electric hammer drill professional tool isolated',
        'power drill impact driver construction tool',
        'professional impact drill closeup studio shot'
      ];
    }
    if (name.includes('комплект насадок')) {
      return [
        'drill bit set case professional accessories',
        'power drill with bits toolkit box',
        'cordless drill kit accessories case complete',
        'drill driver set professional toolbox bits'
      ];
    }
    if (name.includes('аккумуляторная')) {
      return [
        'cordless drill lithium battery professional',
        'battery powered drill driver tool',
        'electric cordless drill professional isolated',
        'rechargeable drill driver professional tool'
      ];
    }
    if (name.includes('18v') || name.includes('20v')) {
      return [
        'cordless drill driver professional tool isolated',
        'lithium battery drill professional product',
        'electric cordless power drill studio shot',
        'professional drill driver battery powered'
      ];
    }
  }

  if (name.includes('led') || name.includes('светильник')) {
    if (name.includes('умный')) {
      return [
        'smart LED light bulb white background product',
        'wifi LED bulb smart home lighting isolated',
        'intelligent LED lamp app controlled white',
        'smart bulb LED technology modern white'
      ];
    }
    if (name.includes('rgb')) {
      return [
        'RGB LED light bulb multicolor smart',
        'color changing LED strip lights colorful',
        'multicolor LED lighting RGB technology',
        'RGB smart bulb color changing light'
      ];
    }
    if (name.includes('пульт ду')) {
      return [
        'LED bulb remote control wireless white',
        'smart LED light with remote control',
        'LED lamp remote controlled lighting',
        'wireless control LED bulb modern'
      ];
    }
  }

  return ['construction professional tool product'];
}

async function getBetterImage(productName: string): Promise<string | null> {
  const queries = getAlternativeSearchQueries(productName);

  for (const query of queries) {
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
        // Ищем первое неиспользованное изображение
        for (const image of data.results) {
          if (!usedImageIds.has(image.id)) {
            usedImageIds.add(image.id);
            console.log(`   ✅ Найдено по запросу: "${query}"`);
            return image.urls.regular;
          }
        }
      }

      await sleep(500); // Небольшая задержка между попытками
    } catch (error) {
      console.error(`   ⚠️  Ошибка запроса "${query}":`, error);
    }
  }

  return null;
}

async function fixBadImages() {
  const supabase = createClient(url, serviceKey);

  console.log('🔨 ЗАГРУЖАЮ ТОВАРЫ КАТЕГОРИИ "СТРОИТЕЛЬСТВО"...\n');

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

  const badPositions = [1, 7, 8, 9, 10, 11, 12, 13, 14, 18, 19, 20, 23, 25, 26, 27, 28, 30, 31, 34, 42];

  console.log(`✅ Найдено товаров в категории: ${constructionProducts.length}`);
  console.log(`🔄 Позиций для исправления: ${badPositions.length}\n`);
  console.log('=' + '='.repeat(79) + '\n');

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < badPositions.length; i++) {
    const position = badPositions[i];
    const product = constructionProducts[position - 1];

    if (!product) {
      console.log(`❌ Позиция ${position} не найдена\n`);
      failed++;
      continue;
    }

    console.log(`[${i + 1}/${badPositions.length}] 📦 Позиция ${position}: ${product.name}`);
    console.log(`   🔍 Ищу лучшее изображение...`);

    const newImageUrl = await getBetterImage(product.name);

    if (!newImageUrl) {
      console.log(`   ❌ Не удалось найти новое изображение\n`);
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
      console.log(`   ✅ ИЗОБРАЖЕНИЕ ЗАМЕНЕНО`);
      console.log(`   🖼️  ${newImageUrl.substring(0, 70)}...\n`);
      updated++;
    }

    await sleep(1500);
  }

  console.log('\n' + '=' + '='.repeat(79));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`   Позиций для исправления: ${badPositions.length}`);
  console.log(`   Успешно заменено: ${updated}`);
  console.log(`   Не удалось заменить: ${failed}`);
  console.log(`   Использовано уникальных изображений: ${usedImageIds.size}`);
  console.log('\n✅ ЗАМЕНА ЗАВЕРШЕНА!');
  console.log('\n🔄 Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixBadImages().catch(console.error);
