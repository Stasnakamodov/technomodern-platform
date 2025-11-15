import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedPhotoIds = new Set<string>();

async function getUniqueImage(productName: string, queries: string[]): Promise<string | null> {
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
          if (!usedPhotoIds.has(image.id)) {
            usedPhotoIds.add(image.id);
            console.log(`   ✅ Найдено по запросу: "${query}"`);
            return image.urls.regular;
          }
        }
      }

      await sleep(500);
    } catch (error) {
      console.error(`   ⚠️  Ошибка запроса "${query}"`);
    }
  }

  return null;
}

async function fixDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔄 ИСПРАВЛЕНИЕ 3 ДУБЛИКАТОВ\n');
  console.log('=' + '='.repeat(79) + '\n');

  // Дубликат 1: Позиция 5 (LED светильник SmartHome Пульт ДУ)
  console.log('[1/3] Позиция 5: LED светильник SmartHome Пульт ДУ');
  console.log('   🔍 Ищу новое уникальное изображение...');

  let imageUrl = await getUniqueImage('LED светильник пульт управления', [
    'smart LED bulb remote control modern white',
    'wireless LED light remote controlled',
    'LED lamp with wireless remote white background',
    'remote control LED bulb smart home'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004e7-0000-0000-0000-000004e70000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  await sleep(1500);

  // Дубликат 2: Позиция 21 (LED светильник ModernLED Умный)
  console.log('[2/3] Позиция 21: LED светильник ModernLED Умный');
  console.log('   🔍 Ищу новое уникальное изображение...');

  imageUrl = await getUniqueImage('умный LED светильник', [
    'smart LED bulb wifi connected white',
    'intelligent LED lamp modern technology',
    'smart home LED bulb app control',
    'wifi LED light bulb white background'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004cc-0000-0000-0000-000004cc0000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  await sleep(1500);

  // Дубликат 3: Позиция 23 (Дрель BuildPro Аккумуляторная)
  console.log('[3/3] Позиция 23: Дрель BuildPro Аккумуляторная');
  console.log('   🔍 Ищу новое уникальное изображение...');

  imageUrl = await getUniqueImage('аккумуляторная дрель', [
    'cordless drill lithium battery professional tool',
    'battery powered drill professional white',
    'rechargeable drill tool professional isolated',
    'cordless power drill battery operated'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004dc-0000-0000-0000-000004dc0000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  console.log('=' + '='.repeat(79));
  console.log('\n✅ ВСЕ 3 ДУБЛИКАТА ИСПРАВЛЕНЫ!');
  console.log('🔄 Обновите страницу в браузере');
}

fixDuplicates().catch(console.error);
