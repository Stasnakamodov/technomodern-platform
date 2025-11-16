import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEarbudsImage(excludeUrls: Set<string>): Promise<string | null> {
  const query = 'wireless earbuds white background';

  // Пробуем разные страницы
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
          if (!excludeUrls.has(imageUrl)) {
            console.log(`   ✅ Найдено изображение на странице ${page}`);
            return imageUrl;
          }
        }
      }

      await sleep(500);
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error}`);
    }
  }

  return null;
}

async function fixBaseusMaxImage() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Исправление изображения "Наушники Baseus Max"...\n');

  // Находим товар
  const { data: product, error: findError } = await supabase
    .from('products')
    .select('*')
    .eq('name', 'Наушники Baseus Max')
    .single();

  if (findError || !product) {
    console.log('❌ Товар не найден');
    return;
  }

  console.log(`📦 Найден товар: ${product.name}`);
  console.log(`   SKU: ${product.sku}`);
  console.log(`   Текущее изображение: ${product.images?.[0]?.substring(0, 70)}...\n`);

  // Получаем все существующие изображения наушников чтобы избежать дубликатов
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

  const existingUrls = new Set(
    electronics
      .filter((p: any) => p.name.toLowerCase().includes('наушники'))
      .map((p: any) => p.images?.[0])
      .filter(Boolean)
  );

  console.log(`🔍 Найдено ${existingUrls.size} существующих изображений наушников`);
  console.log('🔍 Ищу новое уникальное изображение...\n');

  const newImageUrl = await getEarbudsImage(existingUrls);

  if (!newImageUrl) {
    console.log('❌ Не удалось найти уникальное изображение');
    return;
  }

  console.log(`🖼️  Новое изображение: ${newImageUrl}\n`);

  // Обновляем в БД
  const { error: updateError } = await supabase
    .from('products')
    .update({ images: [newImageUrl] })
    .eq('id', product.id);

  if (updateError) {
    console.log(`❌ Ошибка обновления: ${updateError.message}`);
  } else {
    console.log('✅ Изображение успешно обновлено!');
    console.log('\n🎉 Готово! Обновите страницу каталога в браузере (Cmd+R)');
  }
}

fixBaseusMaxImage().catch(console.error);
