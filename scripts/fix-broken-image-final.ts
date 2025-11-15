import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

const supabase = createClient(supabaseUrl, serviceKey);

async function findValidGamingChairImage() {
  console.log('🔍 Ищем ВАЛИДНОЕ изображение gaming кресла...\n');

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=gaming+chair&per_page=30&orientation=landscape`,
    {
      headers: {
        'Authorization': `Client-ID ${unsplashKey}`,
      },
    }
  );

  if (!response.ok) {
    console.error('❌ Ошибка Unsplash API');
    return null;
  }

  const data = await response.json() as any;

  if (!data.results || data.results.length === 0) {
    console.error('❌ Нет результатов');
    return null;
  }

  // Берем первые 5 изображений и проверяем их валидность
  console.log('📸 Проверяем валидность изображений:\n');

  for (let i = 0; i < Math.min(5, data.results.length); i++) {
    const img = data.results[i];
    const testUrl = `${img.urls.regular}`;

    console.log(`${i + 1}. Тестируем: ${testUrl.substring(0, 80)}...`);

    try {
      const testResponse = await fetch(testUrl, { method: 'HEAD' });
      if (testResponse.ok) {
        console.log(`   ✅ ВАЛИДНО! Status: ${testResponse.status}`);
        console.log(`   Описание: ${img.alt_description || 'нет'}`);
        console.log(`   Автор: ${img.user.name}`);

        // Формируем правильный URL с параметрами
        const finalUrl = `${img.urls.raw}&w=800&h=800&fit=crop&q=80`;

        return {
          url: finalUrl,
          description: img.alt_description,
          author: img.user.name,
        };
      } else {
        console.log(`   ❌ Недоступно. Status: ${testResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Ошибка загрузки`);
    }
  }

  return null;
}

async function fixBrokenImage() {
  const productId = '000004a5-0000-0000-0000-000004a50000';

  console.log('🚨 ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ изображения gaming кресла\n');

  // Находим валидное изображение
  const validImage = await findValidGamingChairImage();

  if (!validImage) {
    console.error('\n❌ Не удалось найти валидное изображение!');
    return;
  }

  console.log('\n✅ Найдено валидное изображение:');
  console.log(`URL: ${validImage.url}`);
  console.log(`Описание: ${validImage.description}`);
  console.log(`Автор: ${validImage.author}`);

  // Обновляем в базе данных
  console.log('\n📝 Обновляем в базе данных...');

  const { data, error } = await supabase
    .from('products')
    .update({ images: [validImage.url] })
    .eq('id', productId)
    .select();

  if (error) {
    console.error('❌ Ошибка обновления:', error);
    return;
  }

  console.log('✅ База данных обновлена!');

  // Проверяем
  const { data: checkData } = await supabase
    .from('products')
    .select('name, images, updated_at')
    .eq('id', productId)
    .single();

  console.log('\n📦 Финальное состояние:');
  console.log(`   Название: ${checkData.name}`);
  console.log(`   Обновлено: ${checkData.updated_at}`);
  console.log(`   URL: ${checkData.images[0]}`);

  // Проверяем доступность изображения
  console.log('\n🔍 Проверяем доступность изображения...');
  try {
    const testResponse = await fetch(checkData.images[0], { method: 'HEAD' });
    if (testResponse.ok) {
      console.log(`✅✅✅ ИЗОБРАЖЕНИЕ ДОСТУПНО! Status: ${testResponse.status}`);
      console.log('\n🎉 ГОТОВО! Обновите страницу в браузере.');
    } else {
      console.log(`❌ Изображение недоступно. Status: ${testResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Ошибка проверки доступности');
  }
}

fixBrokenImage();
