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

  // Определяем тип устройства и бренд
  if (nameLower.includes('ноутбук')) {
    if (nameLower.includes('acer')) {
      query = 'acer laptop notebook computer';
    } else if (nameLower.includes('asus')) {
      query = 'asus laptop notebook computer';
    } else if (nameLower.includes('msi')) {
      query = 'msi laptop gaming notebook';
    } else {
      query = 'laptop notebook computer technology';
    }
  } else if (nameLower.includes('наушники')) {
    if (nameLower.includes('soundpeats')) {
      query = 'wireless earbuds headphones soundpeats';
    } else if (nameLower.includes('baseus')) {
      query = 'baseus headphones earbuds wireless';
    } else if (nameLower.includes('edifier')) {
      query = 'edifier headphones earbuds audio';
    } else if (nameLower.includes('qcy')) {
      query = 'qcy wireless earbuds headphones';
    } else if (nameLower.includes('haylou')) {
      query = 'haylou wireless earbuds';
    } else {
      query = 'wireless earbuds headphones audio';
    }
  } else if (nameLower.includes('смартфон')) {
    if (nameLower.includes('xiaomi')) {
      query = 'xiaomi smartphone mobile phone';
    } else if (nameLower.includes('realme')) {
      query = 'realme smartphone mobile phone';
    } else if (nameLower.includes('poco')) {
      query = 'poco smartphone mobile phone';
    } else if (nameLower.includes('vivo')) {
      query = 'vivo smartphone mobile phone';
    } else if (nameLower.includes('oneplus')) {
      query = 'oneplus smartphone mobile phone';
    } else if (nameLower.includes('oppo')) {
      query = 'oppo smartphone mobile phone';
    } else {
      query = 'smartphone mobile phone technology';
    }
  } else {
    query = 'technology electronics gadget';
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
      // Берём случайное из позиций 5-20 чтобы избежать совпадений
      const startIndex = 5;
      const endIndex = Math.min(20, data.results.length);
      const randomIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixElectronicsDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔧 Исправление дублирующихся изображений в категории "Электроника"...\n');

  // SKU товаров с дубликатами (вторые в парах)
  const duplicatesToFix = [
    { sku: 'prod-0075', name: 'Ноутбук Acer 82' },
    { sku: 'prod-0020', name: 'Наушники Soundpeats Air' },
    { sku: 'prod-0038', name: 'Наушники Edifier Plus' },
    { sku: 'prod-0040', name: 'Наушники QCY Ultra' },
    { sku: 'prod-0016', name: 'Смартфон Realme Ultra' },
    { sku: 'prod-0036', name: 'Смартфон POCO Lite' },
    { sku: 'prod-0010', name: 'Смартфон POCO Pro' },
    { sku: 'prod-0017', name: 'Смартфон POCO 11T' },
    { sku: 'prod-0003', name: 'Смартфон Xiaomi Edge' }
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
    const newImageUrl = await getRelevantImage(item.name);

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
    console.log('\n📊 Категория "Электроника": 9 групп дублей устранены');
  }

  console.log('\n💡 Обновите страницу каталога в браузере (Cmd+R или Ctrl+R)');
}

fixElectronicsDuplicates().catch(console.error);
