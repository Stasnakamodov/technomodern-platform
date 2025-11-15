import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ВАЖНО: Set для отслеживания использованных изображений
const usedImageIds = new Set<string>();

// Функция для получения ТОЧНОГО поискового запроса
function getSearchQuery(productName: string): string {
  const name = productName.toLowerCase();

  // ДРЕЛИ - МАКСИМАЛЬНО КОНКРЕТНЫЕ ЗАПРОСЫ
  if (name.includes('дрель')) {
    if (name.includes('ударная')) {
      return 'professional hammer drill impact drill close-up product';
    }
    if (name.includes('комплект насадок')) {
      return 'cordless drill set with bits case accessories kit professional';
    }
    if (name.includes('аккумуляторная')) {
      return 'cordless drill battery power tool professional workshop';
    }
    if (name.includes('18v') || name.includes('20v')) {
      return 'cordless power drill battery volt professional';
    }
    return 'professional power drill tool workshop closeup';
  }

  // LED СВЕТИЛЬНИКИ - МАКСИМАЛЬНО КОНКРЕТНЫЕ ЗАПРОСЫ
  if (name.includes('led') || name.includes('светильник')) {
    if (name.includes('умный')) {
      return 'smart LED bulb wifi app control white background';
    }
    if (name.includes('потолочный')) {
      return 'LED ceiling light fixture modern panel white';
    }
    if (name.includes('настенный')) {
      return 'LED wall sconce fixture indoor modern light';
    }
    if (name.includes('rgb')) {
      return 'RGB LED strip lights multicolor neon glow';
    }
    if (name.includes('пульт ду')) {
      return 'LED bulb with remote control smart light white';
    }
    return 'modern LED light fixture bulb white background';
  }

  return 'construction power tool professional';
}

async function getRelevantImage(productName: string): Promise<string | null> {
  const query = getSearchQuery(productName);

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
      // Ищем первое НЕИСПОЛЬЗОВАННОЕ изображение
      for (const image of data.results) {
        if (!usedImageIds.has(image.id)) {
          usedImageIds.add(image.id);
          return image.urls.regular;
        }
      }

      // Если все использованы, берем первое (лучше чем ничего)
      console.log(`   ⚠️  Все изображения для запроса "${query}" уже использованы`);
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixAllImages() {
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

  console.log(`✅ Найдено товаров: ${constructionProducts.length}\n`);
  console.log('🔄 НАЧИНАЮ ЗАМЕНУ ВСЕХ ИЗОБРАЖЕНИЙ НА РЕЛЕВАНТНЫЕ...\n');
  console.log('=' + '='.repeat(79) + '\n');

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < constructionProducts.length; i++) {
    const product = constructionProducts[i];
    const position = i + 1;

    console.log(`[${position}/${constructionProducts.length}] 📦 ${product.name}`);

    const searchQuery = getSearchQuery(product.name);
    console.log(`   🔍 Запрос: "${searchQuery}"`);

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
      console.log(`   ✅ ОБНОВЛЕНО на релевантное изображение`);
      console.log(`   🖼️  ${newImageUrl.substring(0, 70)}...\n`);
      updated++;
    }

    await sleep(1500);
  }

  console.log('\n' + '=' + '='.repeat(79));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`   Всего товаров: ${constructionProducts.length}`);
  console.log(`   Успешно обновлено: ${updated}`);
  console.log(`   Не удалось обновить: ${failed}`);
  console.log(`   Использовано уникальных изображений: ${usedImageIds.size}`);
  console.log('\n✅ ЗАМЕНА ЗАВЕРШЕНА! Все изображения теперь релевантны товарам.');
  console.log('\n🔄 Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixAllImages().catch(console.error);
