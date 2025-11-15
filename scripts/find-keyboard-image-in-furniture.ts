import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

const supabase = createClient(supabaseUrl, serviceKey);

async function findKeyboardImage() {
  console.log('🔍 Поиск товаров с изображением клавиатуры в категории Мебель...\n');

  // Получаем ID категории "Мебель"
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('name', 'Мебель')
    .single();

  if (categoryError || !category) {
    console.error('❌ Ошибка получения категории:', categoryError);
    return;
  }

  console.log(`📁 Категория: ${category.name} (ID: ${category.id})\n`);

  // Получаем все товары категории Мебель
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('category_id', category.id);

  if (productsError) {
    console.error('❌ Ошибка получения товаров:', productsError);
    return;
  }

  console.log(`📦 Всего товаров в категории: ${products.length}\n`);

  // Ищем товары с изображением клавиатуры
  const keyboardImageId = 'photo-1633406389921';
  const productsWithKeyboard = products.filter(product => {
    if (!product.images || product.images.length === 0) return false;
    return product.images.some((img: string) => img.includes(keyboardImageId));
  });

  console.log(`🎹 Найдено товаров с изображением клавиатуры: ${productsWithKeyboard.length}\n`);

  if (productsWithKeyboard.length === 0) {
    console.log('✅ Отлично! Нет товаров с изображением клавиатуры.');
    return;
  }

  // Выводим детали каждого товара
  productsWithKeyboard.forEach((product, index) => {
    console.log(`${index + 1}. 🪑 ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Изображения:`);
    product.images.forEach((img: string, imgIndex: number) => {
      const isKeyboard = img.includes(keyboardImageId);
      console.log(`     ${imgIndex + 1}. ${img} ${isKeyboard ? '🎹 ← КЛАВИАТУРА!' : ''}`);
    });
    console.log();
  });

  // Также проверим все изображения на наличие клавиатуры
  console.log('\n🔍 Детальная проверка всех изображений в категории:\n');

  const allImages = new Map<string, string[]>();
  products.forEach(product => {
    if (product.images && product.images.length > 0) {
      product.images.forEach((img: string) => {
        if (img.includes(keyboardImageId)) {
          if (!allImages.has(img)) {
            allImages.set(img, []);
          }
          allImages.get(img)!.push(product.name);
        }
      });
    }
  });

  if (allImages.size > 0) {
    console.log('🎹 Все варианты URL клавиатуры:');
    allImages.forEach((productNames, imageUrl) => {
      console.log(`\nURL: ${imageUrl}`);
      console.log('Используется в товарах:');
      productNames.forEach(name => console.log(`  - ${name}`));
    });
  }
}

findKeyboardImage();
