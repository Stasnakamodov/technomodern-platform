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
      query = 'electric drill power tool construction';
    } else if (productName.includes('Аккумуляторная') || productName.includes('V')) {
      query = 'cordless drill battery power tool';
    } else if (productName.includes('Комплект насадок')) {
      query = 'drill bit set tools accessories';
    } else {
      query = 'power drill electric tool construction';
    }
  } else if (productName.includes('LED') || productName.includes('светильник')) {
    if (productName.includes('Потолочный')) {
      query = 'ceiling led light fixture modern';
    } else if (productName.includes('Настенный')) {
      query = 'wall led light fixture sconce';
    } else if (productName.includes('RGB')) {
      query = 'rgb led light colorful smart';
    } else if (productName.includes('Умный') || productName.includes('SmartHome')) {
      query = 'smart led light bulb control';
    } else if (productName.includes('Пульт ДУ')) {
      query = 'led light remote control smart';
    } else {
      query = 'led light fixture modern bright';
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

async function fixDuplicates() {
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

  const imageUrlMap = new Map<string, Array<{position: number, name: string, id: string}>>();

  constructionProducts.forEach((product, index) => {
    const imageUrl = product.images[0] || '';
    if (imageUrl) {
      if (!imageUrlMap.has(imageUrl)) {
        imageUrlMap.set(imageUrl, []);
      }
      imageUrlMap.get(imageUrl)!.push({
        position: index + 1,
        name: product.name,
        id: product.id
      });
    }
  });

  const duplicates = Array.from(imageUrlMap.entries())
    .filter(([_, products]) => products.length > 1);

  console.log(`❌ Найдено ${duplicates.length} дублирующихся изображений\n`);
  console.log('🔄 Заменяю дубликаты на уникальные изображения...\n');

  let updated = 0;
  let failed = 0;

  for (const [imageUrl, products] of duplicates) {
    console.log(`\nДубликат: ${imageUrl.substring(0, 60)}...`);
    console.log(`Товаров с этим изображением: ${products.length}`);

    for (let i = 1; i < products.length; i++) {
      const product = products[i];
      console.log(`\n  [Позиция ${product.position}] ${product.name}`);

      const newImageUrl = await getRelevantImage(product.name);

      if (!newImageUrl) {
        console.log(`     ❌ Не удалось найти изображение`);
        failed++;
        await sleep(1500);
        continue;
      }

      const { error } = await supabase
        .from('products')
        .update({ images: [newImageUrl] })
        .eq('id', product.id);

      if (error) {
        console.log(`     ❌ Ошибка обновления: ${error.message}`);
        failed++;
      } else {
        console.log(`     ✅ Обновлено`);
        console.log(`     🖼️  ${newImageUrl.substring(0, 60)}...`);
        updated++;
      }

      await sleep(1500);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Дублирующихся изображений: ${duplicates.length}`);
  console.log(`Успешно заменено: ${updated}`);
  console.log(`Ошибок: ${failed}`);
  console.log('\n🎉 Готово! Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixDuplicates().catch(console.error);
