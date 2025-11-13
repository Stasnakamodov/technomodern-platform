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

(async () => {
  console.log('🎨 Исправление BeautyLux Натуральный\n');

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

  // Получаем оба товара BeautyLux
  const { data: beautyLuxProducts } = await supabase
    .from('products')
    .select('id, name, images')
    .ilike('name', '%BeautyLux%Натуральный%');

  console.log(`Найдено товаров: ${beautyLuxProducts.length}\n`);

  // Поиск изображений
  const result = await pexels.photos.search({
    query: 'natural face cream jar organic',
    per_page: 10,
    page: 4,
    size: 'large',
    orientation: 'square'
  });

  if (!result.photos || result.photos.length === 0) {
    console.log('❌ Не найдено изображений');
    return;
  }

  const availableImages = result.photos
    .map(photo => `${photo.src.large}?auto=compress&cs=tinysrgb&h=1080&w=1080`)
    .filter(img => !usedImages.has(img));

  console.log(`✅ Доступных изображений: ${availableImages.length}\n`);

  // Обновляем оба товара
  for (let i = 0; i < beautyLuxProducts.length && i < availableImages.length; i++) {
    const product = beautyLuxProducts[i];
    const newImage = availableImages[i];

    console.log(`${i + 1}. ${product.name}`);
    console.log(`   Старое: ${product.images[0].substring(0, 60)}...`);
    console.log(`   Новое: ${newImage.substring(0, 60)}...`);

    const { error } = await supabase
      .from('products')
      .update({ images: [newImage] })
      .eq('id', product.id);

    if (!error) {
      console.log(`   ✅ ОБНОВЛЕНО!\n`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }

    await sleep(500);
  }

  console.log('🎉 Готово!');
})();
