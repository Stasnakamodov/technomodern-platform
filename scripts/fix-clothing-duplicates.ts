import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRelevantImage(productName: string, skuToAvoid: string): Promise<string | null> {
  let query = '';
  const nameLower = productName.toLowerCase();

  if (nameLower.includes('куртка') && nameLower.includes('зимняя')) {
    query = 'winter jacket coat fashion woman outdoor snow';
  } else if (nameLower.includes('футболка') && nameLower.includes('хлопок')) {
    query = 'cotton t-shirt casual woman white basic';
  } else if (nameLower.includes('кроссовки') && nameLower.includes('puma')) {
    query = 'puma sneakers sport shoes athletic running';
  } else {
    query = 'fashion clothing apparel';
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
      // Берём случайное из позиций 5-15 чтобы избежать совпадений с первым товаром
      const startIndex = 5;
      const endIndex = Math.min(15, data.results.length);
      const randomIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixClothingDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Исправление дублирующихся изображений в категории "Одежда"...\n');

  // SKU товаров, которые нужно обновить (вторые в парах дублей)
  const duplicatesToFix = [
    { sku: 'prod-0098', name: 'Куртка Classic Зимняя' },
    { sku: 'prod-0125', name: 'Футболка Cotton Хлопок' },
    { sku: 'prod-0109', name: 'Кроссовки Puma Style Амортизация' }
  ];

  let updated = 0;
  let failed = 0;

  for (const item of duplicatesToFix) {
    console.log(`\n📦 ${item.name} (SKU: ${item.sku})`);
    console.log('   🔄 Ищу новое уникальное изображение...');

    // Получаем товар из БД
    const { data: product } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('sku', item.sku)
      .single();

    if (!product) {
      console.log('   ❌ Товар не найден в БД');
      failed++;
      continue;
    }

    console.log(`   Текущее изображение: ${product.images[0]?.substring(0, 60)}...`);

    // Получаем новое изображение
    const newImageUrl = await getRelevantImage(item.name, item.sku);

    if (!newImageUrl) {
      console.log('   ❌ Не удалось найти новое изображение');
      failed++;
      await sleep(1500);
      continue;
    }

    console.log(`   ✅ Новое изображение: ${newImageUrl.substring(0, 60)}...`);

    // Обновляем в БД
    const { error } = await supabase
      .from('products')
      .update({ images: [newImageUrl] })
      .eq('sku', item.sku);

    if (error) {
      console.log(`   ❌ Ошибка обновления: ${error.message}`);
      failed++;
    } else {
      console.log(`   ✅ Успешно обновлено!`);
      updated++;
    }

    // Rate limiting для Unsplash API
    await sleep(1500);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Товаров для обновления: ${duplicatesToFix.length}`);
  console.log(`Успешно обновлено: ${updated}`);
  console.log(`Ошибок: ${failed}`);

  if (updated === duplicatesToFix.length) {
    console.log('\n🎉 Все дубликаты успешно исправлены!');
    console.log('   Каждый товар теперь имеет уникальное изображение.');
  }

  console.log('\n💡 Обновите страницу каталога в браузере (Cmd+R или Ctrl+R)');
}

fixClothingDuplicates().catch(console.error);
