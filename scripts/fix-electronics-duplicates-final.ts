import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSearchQuery(productName: string): string {
  const nameLower = productName.toLowerCase();

  if (nameLower.includes('смартфон')) {
    return 'smartphone white background';
  }
  if (nameLower.includes('ноутбук')) {
    if (nameLower.includes('asus')) return 'asus laptop';
    if (nameLower.includes('hp')) return 'hp laptop';
    if (nameLower.includes('msi')) return 'msi gaming laptop';
    return 'laptop computer white background';
  }
  if (nameLower.includes('наушники')) {
    return 'wireless earbuds white background';
  }
  return 'electronics white background';
}

async function getUniqueImage(productName: string, existingUrls: Set<string>): Promise<string | null> {
  const query = getSearchQuery(productName);

  // Пробуем разные страницы до тех пор пока не найдем уникальное изображение
  for (let page = 1; page <= 5; page++) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`,
        {
          headers: { 'Authorization': `Client-ID ${unsplashKey}` }
        }
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Ищем уникальное изображение
        for (const result of data.results) {
          const imageUrl = result.urls.regular;
          if (!existingUrls.has(imageUrl)) {
            return imageUrl;
          }
        }
      }

      await sleep(500); // Короткая пауза между запросами страниц
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error}`);
    }
  }

  return null;
}

async function fixDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Исправление дубликатов в категории "Электроника"...\n');

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true);

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  const electronics = productsData?.filter((p: any) =>
    categoriesMap.get(p.category_id) === 'Электроника'
  ) || [];

  // Собираем дубликаты
  const imageMap = new Map<string, any[]>();
  electronics.forEach((product: any) => {
    const imageUrl = product.images?.[0] || '';
    if (imageUrl) {
      if (!imageMap.has(imageUrl)) {
        imageMap.set(imageUrl, []);
      }
      imageMap.get(imageUrl)!.push(product);
    }
  });

  const duplicates = Array.from(imageMap.entries()).filter(([url, products]) => products.length > 1);

  console.log(`Найдено дубликатов: ${duplicates.length}\n`);

  // Собираем все существующие URL для проверки уникальности
  const existingUrls = new Set(Array.from(imageMap.keys()));

  let fixed = 0;

  for (const [duplicateUrl, products] of duplicates) {
    console.log(`\n📦 Изображение используется в ${products.length} товарах:`);
    products.forEach(p => console.log(`   - ${p.name}`));

    // Оставляем первый товар, остальные обновляем
    for (let i = 1; i < products.length; i++) {
      const product = products[i];
      console.log(`\n   [${i}/${products.length - 1}] Обновляю: ${product.name}`);

      const newImageUrl = await getUniqueImage(product.name, existingUrls);

      if (newImageUrl) {
        console.log(`   ✅ Новое: ${newImageUrl.substring(0, 60)}...`);

        const { error } = await supabase
          .from('products')
          .update({ images: [newImageUrl] })
          .eq('id', product.id);

        if (error) {
          console.log(`   ❌ Ошибка: ${error.message}`);
        } else {
          existingUrls.add(newImageUrl);
          fixed++;
        }
      } else {
        console.log(`   ⚠️  Не удалось найти уникальное изображение`);
      }

      await sleep(1500);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ Исправлено дубликатов: ${fixed}`);
  console.log('🎉 Готово!\n');
}

fixDuplicates().catch(console.error);
