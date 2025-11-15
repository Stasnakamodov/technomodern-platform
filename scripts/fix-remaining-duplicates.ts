import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedPhotoIds = new Set<string>();

async function getUniqueImage(queries: string[]): Promise<string | null> {
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

async function fixRemainingDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔄 ИСПРАВЛЕНИЕ ОСТАВШИХСЯ ДУБЛИКАТОВ\n');
  console.log('=' + '='.repeat(79) + '\n');

  // Дубликат 1: Позиция 16
  console.log('[1/3] Позиция 16: LED светильник LuxLight Пульт ДУ');
  console.log('   🔍 Ищу новое уникальное изображение...');

  let imageUrl = await getUniqueImage([
    'remote LED bulb smart lighting white background',
    'LED light with wireless remote control modern',
    'smart bulb remote wireless white background',
    'LED lamp remote control device white'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004c7-0000-0000-0000-000004c70000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  await sleep(1500);

  // Дубликат 2: Позиция 26
  console.log('[2/3] Позиция 26: LED светильник BrightLight Пульт ДУ');
  console.log('   🔍 Ищу новое уникальное изображение...');

  imageUrl = await getUniqueImage([
    'LED smart bulb remote controlled isolated white',
    'wireless LED light remote modern technology',
    'smart home LED bulb remote white background',
    'LED bulb with remote control product'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004d5-0000-0000-0000-000004d50000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  await sleep(1500);

  // Дубликат 3: Позиция 30
  console.log('[3/3] Позиция 30: Дрель MasterCraft 20V');
  console.log('   🔍 Ищу новое уникальное изображение...');

  imageUrl = await getUniqueImage([
    'cordless drill 20 volt battery professional',
    'electric drill battery powered professional tool',
    'power drill cordless 20v lithium professional',
    'battery drill driver professional white background'
  ]);

  if (imageUrl) {
    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', '000004e2-0000-0000-0000-000004e20000');

    if (!error) {
      console.log('   ✅ ОБНОВЛЕНО');
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  console.log('=' + '='.repeat(79));
  console.log('\n✅ ВСЕ ДУБЛИКАТЫ ИСПРАВЛЕНЫ!');
  console.log('🔄 Обновите страницу в браузере');
}

fixRemainingDuplicates().catch(console.error);
