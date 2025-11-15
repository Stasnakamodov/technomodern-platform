import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

const supabase = createClient(supabaseUrl, serviceKey);

async function forceUpdateImage() {
  const productId = '000004a5-0000-0000-0000-000004a50000';

  console.log('🚀 РАДИКАЛЬНОЕ ОБНОВЛЕНИЕ изображения gaming кресла\n');

  // Шаг 1: Полностью очищаем массив изображений
  console.log('1️⃣ Очищаем массив изображений...');

  const { error: clearError } = await supabase
    .from('products')
    .update({ images: [] })
    .eq('id', productId);

  if (clearError) {
    console.error('❌ Ошибка очистки:', clearError);
    return;
  }

  console.log('✅ Массив изображений очищен');

  // Ждем 1 секунду
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Шаг 2: Ищем ДРУГОЕ изображение gaming кресла
  console.log('\n2️⃣ Ищем НОВОЕ изображение gaming кресла...');

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=gaming+chair+office&per_page=30&orientation=squarish`,
    {
      headers: {
        'Authorization': `Client-ID ${unsplashKey}`,
      },
    }
  );

  if (!response.ok) {
    console.error('❌ Ошибка Unsplash API:', response.status);
    return;
  }

  const data = await response.json() as any;

  if (!data.results || data.results.length === 0) {
    console.error('❌ Нет результатов');
    return;
  }

  // Фильтруем изображения которые уже пробовали
  const excludePhotoIds = [
    '1633406389921', // клавиатура
    '1598550487031', // попытка 1
    '1580480055273', // попытка 2
    '1616486338812', // попытка 3
    '1691242459990-d05ef33d42a8', // попытка 4
  ];

  const newImages = data.results.filter((img: any) => {
    return !excludePhotoIds.some(excludeId => img.urls.raw.includes(excludeId));
  });

  console.log(`✅ Найдено ${newImages.length} новых изображений`);

  if (newImages.length === 0) {
    console.error('❌ Нет новых изображений');
    return;
  }

  // Берем первое подходящее
  const selectedImage = newImages[0];
  const photoId = selectedImage.id;

  // Формируем URL БЕЗ дополнительных параметров Unsplash (только базовый)
  const cleanUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=800&fit=crop&q=80`;

  console.log(`\n✅ Выбрано изображение:`);
  console.log(`   Photo ID: ${photoId}`);
  console.log(`   URL: ${cleanUrl}`);
  console.log(`   Описание: ${selectedImage.alt_description || 'нет'}`);
  console.log(`   Автор: ${selectedImage.user.name}`);

  // Шаг 3: Устанавливаем НОВОЕ изображение
  console.log('\n3️⃣ Устанавливаем новое изображение...');

  const { data: updateData, error: updateError } = await supabase
    .from('products')
    .update({ images: [cleanUrl] })
    .eq('id', productId)
    .select();

  if (updateError) {
    console.error('❌ Ошибка обновления:', updateError);
    return;
  }

  console.log('✅ Изображение установлено!');

  // Шаг 4: Проверяем
  console.log('\n4️⃣ Финальная проверка...');

  const { data: checkData, error: checkError } = await supabase
    .from('products')
    .select('name, images, updated_at')
    .eq('id', productId)
    .single();

  if (checkError) {
    console.error('❌ Ошибка проверки:', checkError);
    return;
  }

  console.log('\n📦 Текущее состояние товара:');
  console.log(`   Название: ${checkData.name}`);
  console.log(`   Обновлено: ${checkData.updated_at}`);
  console.log(`   Изображений: ${checkData.images.length}`);
  if (checkData.images.length > 0) {
    console.log(`   URL: ${checkData.images[0]}`);
  }

  if (checkData.images[0] === cleanUrl) {
    console.log('\n✅✅✅ УСПЕХ! Изображение полностью обновлено!');
    console.log('\n💡 Теперь обновите страницу на фронтенде (Ctrl+Shift+R)');
    console.log('   Если все еще показывается клавиатура - проблема в CDN кеше фронтенда');
  } else {
    console.log('\n⚠️  Изображение отличается от ожидаемого');
  }
}

forceUpdateImage();
