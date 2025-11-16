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

  if (nameLower.includes('штаны женские')) {
    query = 'woman pants trousers fashion casual';
  } else if (nameLower.includes('майка') || nameLower.includes('белая женская')) {
    query = 'white tank top woman fashion casual';
  } else if (nameLower.includes('панамка')) {
    query = 'beige panama hat summer bucket hat woman';
  } else if (nameLower.includes('кроссовки puma')) {
    query = 'puma sneakers sport shoes running athletic';
  } else {
    query = 'fashion clothing woman apparel';
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
      // Берём случайное из первых 10
      const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixClothingPositions() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Обновляем позиции в категории "Одежда"...\n');

  const updates = [
    { sku: 'prod-0140', name: 'Штаны женские', action: 'update_image' },
    { sku: 'prod-0126', name: 'Майка белая женская', action: 'update_name_and_image' },
    { sku: 'prod-0141', name: 'Панамка летняя бежевая', action: 'update_image' },
    { sku: 'prod-0119', name: 'Кроссовки Puma Style Амортизация', action: 'update_image' }
  ];

  const toDelete = [
    { sku: 'prod-0118', name: 'Кроссовки Reebok Style Амортизация' },
    { sku: 'prod-0123', name: 'Кроссовки New Balance Style Спортивные' }
  ];

  let updated = 0;
  let deleted = 0;
  let failed = 0;

  // Обновления
  for (const item of updates) {
    console.log(`\n📦 ${item.name} (SKU: ${item.sku})`);

    const { data: product } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('sku', item.sku)
      .single();

    if (!product) {
      console.log('   ❌ Товар не найден');
      failed++;
      continue;
    }

    const updateData: any = {};

    // Обновляем название если нужно
    if (item.action === 'update_name_and_image') {
      updateData.name = item.name;
      console.log(`   📝 Новое название: ${item.name}`);
    }

    // Получаем новое изображение
    console.log('   🔄 Получаю новое изображение...');
    const newImageUrl = await getRelevantImage(item.name);

    if (!newImageUrl) {
      console.log('   ❌ Не удалось найти изображение');
      failed++;
      await sleep(1500);
      continue;
    }

    updateData.images = [newImageUrl];
    console.log(`   ✅ Новое изображение: ${newImageUrl.substring(0, 60)}...`);

    // Обновляем в БД
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('sku', item.sku);

    if (error) {
      console.log(`   ❌ Ошибка: ${error.message}`);
      failed++;
    } else {
      console.log(`   ✅ Обновлено успешно`);
      updated++;
    }

    await sleep(1500); // Rate limiting
  }

  // Удаления
  console.log('\n' + '='.repeat(80));
  console.log('\n🗑️  Удаление нерелевантных товаров:\n');

  for (const item of toDelete) {
    console.log(`\n❌ Удаляю: ${item.name} (SKU: ${item.sku})`);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('sku', item.sku);

    if (error) {
      console.log(`   ❌ Ошибка удаления: ${error.message}`);
      failed++;
    } else {
      console.log(`   ✅ Удален успешно`);
      deleted++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Обновлено товаров: ${updated}/${updates.length}`);
  console.log(`Удалено товаров: ${deleted}/${toDelete.length}`);
  console.log(`Ошибок: ${failed}`);

  // Проверяем общее количество товаров
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📦 Всего товаров в БД: ${count}`);
  console.log('\n🎉 Готово! Обновите страницу каталога.');
}

fixClothingPositions().catch(console.error);
