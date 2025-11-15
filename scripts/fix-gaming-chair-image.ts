import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

const supabase = createClient(supabaseUrl, serviceKey);

// Изображения которые УЖЕ пробовали и не работают
const TRIED_IMAGES = [
  'photo-1633406389921', // клавиатура
  'photo-1598550487031', // попытка 1
  'photo-1580480055273', // попытка 2
  'photo-1616486338812', // попытка 3
];

async function findNewGamingChairImage() {
  console.log('🔍 Ищем НОВОЕ изображение gaming кресла через Unsplash API...\n');

  // Пробуем разные поисковые запросы
  const queries = [
    'gaming chair black',
    'ergonomic gaming chair',
    'office gaming chair',
    'racing gaming chair',
    'gamer chair',
  ];

  for (const query of queries) {
    console.log(`\n🔎 Запрос: "${query}"`);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`,
        },
      }
    );

    if (!response.ok) {
      console.log(`❌ Ошибка API: ${response.status}`);
      continue;
    }

    const data = await response.json() as any;

    if (!data.results || data.results.length === 0) {
      console.log('❌ Нет результатов');
      continue;
    }

    console.log(`✅ Найдено ${data.results.length} изображений`);

    // Фильтруем изображения которые уже пробовали
    const newImages = data.results.filter((img: any) => {
      const photoId = img.id;
      return !TRIED_IMAGES.some(tried => img.urls.raw.includes(tried)) &&
             !TRIED_IMAGES.includes(`photo-${photoId}`);
    });

    console.log(`🆕 Новых (не пробованных): ${newImages.length}`);

    if (newImages.length > 0) {
      // Берем первые 5 подходящих изображений
      console.log('\n📸 Лучшие варианты:');
      newImages.slice(0, 5).forEach((img: any, index: number) => {
        const photoId = img.id;
        const imageUrl = `${img.urls.raw}&w=800&h=800&fit=crop&q=80`;
        console.log(`\n  ${index + 1}. Photo ID: photo-${photoId}`);
        console.log(`     URL: ${imageUrl}`);
        console.log(`     Описание: ${img.alt_description || 'нет описания'}`);
        console.log(`     Автор: ${img.user.name}`);
      });

      // Возвращаем первое изображение
      const bestImage = newImages[0];
      const photoId = bestImage.id;
      const imageUrl = `${bestImage.urls.raw}&w=800&h=800&fit=crop&q=80`;

      return {
        photoId: `photo-${photoId}`,
        url: imageUrl,
        description: bestImage.alt_description,
        author: bestImage.user.name,
      };
    }
  }

  return null;
}

async function updateProductImage() {
  const productId = '000004a5-0000-0000-0000-000004a50000';

  console.log('🎯 Начинаем исправление изображения для Gaming кресла...\n');

  // Находим новое изображение
  const newImage = await findNewGamingChairImage();

  if (!newImage) {
    console.log('\n❌ Не удалось найти подходящее изображение');
    return;
  }

  console.log('\n\n✅ Выбрано изображение:');
  console.log(`Photo ID: ${newImage.photoId}`);
  console.log(`URL: ${newImage.url}`);
  console.log(`Описание: ${newImage.description}`);
  console.log(`Автор: ${newImage.author}`);

  // Добавляем cache-busting параметр для гарантированного обновления
  const timestamp = Date.now();
  const finalUrl = `${newImage.url}&cb=${timestamp}`;

  console.log(`\n🔧 URL с cache-busting: ${finalUrl}`);

  // Обновляем в базе данных
  console.log('\n📝 Обновляем изображение в базе данных...');

  const { data, error } = await supabase
    .from('products')
    .update({ images: [finalUrl] })
    .eq('id', productId)
    .select();

  if (error) {
    console.error('❌ Ошибка обновления:', error);
    return;
  }

  console.log('✅ Изображение успешно обновлено!');
  console.log('\n📦 Обновленные данные:');
  console.log(JSON.stringify(data, null, 2));

  // Проверяем что обновление сработало
  console.log('\n🔍 Проверка обновления...');

  const { data: checkData, error: checkError } = await supabase
    .from('products')
    .select('name, images')
    .eq('id', productId)
    .single();

  if (checkError) {
    console.error('❌ Ошибка проверки:', checkError);
    return;
  }

  console.log('✅ Текущее состояние в БД:');
  console.log(`Название: ${checkData.name}`);
  console.log(`Изображение: ${checkData.images[0]}`);

  if (checkData.images[0] === finalUrl) {
    console.log('\n✅✅✅ УСПЕХ! Изображение обновлено в базе данных!');
    console.log('\n💡 Если на фронтенде все еще показывается клавиатура:');
    console.log('   1. Очистите кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)');
    console.log('   2. Проверьте что фронтенд читает данные из правильной базы');
    console.log('   3. Проверьте cache headers на CDN/фронтенде');
  } else {
    console.log('\n❌ Изображение в БД отличается от ожидаемого!');
  }
}

updateProductImage();
