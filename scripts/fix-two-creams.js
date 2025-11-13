const { createClient } = require('@supabase/supabase-js');
const { createClient: createPexelsClient } = require('pexels');

const supabase = createClient(
  'https://rbngpxwamfkunktxjtqh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
);

const pexels = createPexelsClient('5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getImageForCream(creamType, page = 4) {
  try {
    // Разные запросы для разных типов крема
    const queries = {
      'natural': 'natural face cream jar organic',
      'antiage': 'anti aging cream luxury skincare jar'
    };

    const query = queries[creamType] || 'face cream jar skincare';
    console.log(`   🔍 Поиск: "${query}" (страница ${page})`);

    const result = await pexels.photos.search({
      query: query,
      per_page: 5,
      page: page,
      size: 'large',
      orientation: 'square'
    });

    if (result.photos && result.photos.length > 0) {
      return result.photos.map(photo =>
        `${photo.src.large}?auto=compress&cs=tinysrgb&h=1080&w=1080`
      );
    }
  } catch (error) {
    console.error('   ❌ Ошибка Pexels:', error.message);
  }
  return [];
}

(async () => {
  console.log('🎨 Исправление изображений для двух кремов\n');

  // Получаем все уже использованные изображения
  const { data: allProducts } = await supabase
    .from('products')
    .select('images');

  const usedImages = new Set();
  allProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
      usedImages.add(p.images[0]);
    }
  });

  console.log(`📊 Всего используется изображений: ${usedImages.size}\n`);

  // 1. BeautyLux Натуральный
  console.log('1️⃣ Крем для лица BeautyLux Натуральный');

  const { data: beautyLux } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('name', 'Крем для лица BeautyLux Натуральный')
    .single();

  if (beautyLux) {
    console.log(`   📦 Найден товар: ${beautyLux.name}`);
    console.log(`   🖼️  Старое фото: ${beautyLux.images[0].substring(0, 60)}...`);

    const images1 = await getImageForCream('natural', 4);
    await sleep(1000);

    const availableImages1 = images1.filter(img => !usedImages.has(img));

    if (availableImages1.length > 0) {
      const newImage = availableImages1[0];
      console.log(`   ✨ Новое фото: ${newImage.substring(0, 60)}...`);

      const { error } = await supabase
        .from('products')
        .update({ images: [newImage] })
        .eq('id', beautyLux.id);

      if (!error) {
        console.log('   ✅ ОБНОВЛЕНО!\n');
        usedImages.add(newImage);
      } else {
        console.log('   ❌ Ошибка обновления\n');
      }
    } else {
      console.log('   ⚠️  Нет доступных изображений\n');
    }
  } else {
    console.log('   ❌ Товар не найден\n');
  }

  await sleep(1500);

  // 2. DermaLine Антивозрастной
  console.log('2️⃣ Крем для лица DermaLine Антивозрастной');

  const { data: dermaLine } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('name', 'Крем для лица DermaLine Антивозрастной')
    .single();

  if (dermaLine) {
    console.log(`   📦 Найден товар: ${dermaLine.name}`);
    console.log(`   🖼️  Старое фото: ${dermaLine.images[0].substring(0, 60)}...`);

    const images2 = await getImageForCream('antiage', 5);
    await sleep(1000);

    const availableImages2 = images2.filter(img => !usedImages.has(img));

    if (availableImages2.length > 0) {
      const newImage = availableImages2[0];
      console.log(`   ✨ Новое фото: ${newImage.substring(0, 60)}...`);

      const { error } = await supabase
        .from('products')
        .update({ images: [newImage] })
        .eq('id', dermaLine.id);

      if (!error) {
        console.log('   ✅ ОБНОВЛЕНО!\n');
      } else {
        console.log('   ❌ Ошибка обновления\n');
      }
    } else {
      console.log('   ⚠️  Нет доступных изображений\n');
    }
  } else {
    console.log('   ❌ Товар не найден\n');
  }

  console.log('🎉 Готово!');
})();
