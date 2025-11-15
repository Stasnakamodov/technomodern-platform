import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedImageIds = new Set<string>();

async function getRelevantImage(query: string): Promise<string | null> {
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
        if (!usedImageIds.has(image.id)) {
          usedImageIds.add(image.id);
          return image.urls.regular;
        }
      }
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска:`, error);
  }

  return null;
}

async function fixRemaining3() {
  const supabase = createClient(url, serviceKey);

  console.log('🛋️  ИСПРАВЛЯЮ 3 ОСТАВШИХСЯ ТОВАРА МЕБЕЛИ...\n');

  // Товар 1: Офисное кресло Comfort Кожа/Ткань
  const product1Query = 'office chair comfortable leather fabric white background';
  console.log('1. Офисное кресло Comfort Кожа/Ткань');
  console.log(`   🔍 Запрос: "${product1Query}"`);

  const image1 = await getRelevantImage(product1Query);
  if (image1) {
    const { error } = await supabase
      .from('products')
      .update({ images: [image1] })
      .eq('name', 'Офисное кресло Comfort Кожа/Ткань');

    if (!error) {
      console.log(`   ✅ ОБНОВЛЕНО`);
      console.log(`   🖼️  ${image1.substring(0, 70)}...\n`);
    }
  }

  await sleep(2000);

  // Товар 2: Диван Modern 2-местный
  const product2Query = 'modern loveseat two seater sofa grey white background';
  console.log('2. Диван Modern 2-местный');
  console.log(`   🔍 Запрос: "${product2Query}"`);

  const image2 = await getRelevantImage(product2Query);
  if (image2) {
    const { error } = await supabase
      .from('products')
      .update({ images: [image2] })
      .eq('name', 'Диван Modern 2-местный');

    if (!error) {
      console.log(`   ✅ ОБНОВЛЕНО`);
      console.log(`   🖼️  ${image2.substring(0, 70)}...\n`);
    }
  }

  await sleep(2000);

  // Товар 3: Диван Modern Прямой
  const product3Query = 'modern straight sofa gray minimalist white background';
  console.log('3. Диван Modern Прямой');
  console.log(`   🔍 Запрос: "${product3Query}"`);

  const image3 = await getRelevantImage(product3Query);
  if (image3) {
    const { error } = await supabase
      .from('products')
      .update({ images: [image3] })
      .eq('name', 'Диван Modern Прямой');

    if (!error) {
      console.log(`   ✅ ОБНОВЛЕНО`);
      console.log(`   🖼️  ${image3.substring(0, 70)}...\n`);
    }
  }

  console.log('✅ ЗАВЕРШЕНО! Все 3 товара обновлены.');
}

fixRemaining3().catch(console.error);
