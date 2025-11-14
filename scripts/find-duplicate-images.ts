import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

interface Product {
  id: string;
  name: string;
  category_id: string;
  images: string[];
}

async function findDuplicateImages() {
  const supabase = createClient(url, anonKey);

  console.log('🔍 Загружаю товары из каталога...\n');

  // Загружаем все товары
  const { data: productsData, error } = await supabase
    .from('products')
    .select('id, name, category_id, images')
    .eq('in_stock', true);

  if (error) {
    console.error('❌ Ошибка загрузки:', error);
    return;
  }

  if (!productsData || productsData.length === 0) {
    console.log('❌ Товары не найдены');
    return;
  }

  console.log(`✅ Загружено товаров: ${productsData.length}\n`);

  // Загружаем категории для отображения названий
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Создаём мапу: URL изображения -> массив товаров с этим изображением
  const imageUrlMap = new Map<string, Product[]>();

  productsData.forEach((product: any) => {
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    if (imageUrl) {
      if (!imageUrlMap.has(imageUrl)) {
        imageUrlMap.set(imageUrl, []);
      }
      imageUrlMap.get(imageUrl)!.push({
        id: product.id,
        name: product.name,
        category_id: product.category_id,
        images: product.images
      });
    }
  });

  // Фильтруем только дубли (где больше 1 товара с одним URL)
  const duplicates = Array.from(imageUrlMap.entries())
    .filter(([_, products]) => products.length > 1)
    .sort((a, b) => b[1].length - a[1].length); // Сортируем по количеству дублей

  console.log('📊 СТАТИСТИКА:\n');
  console.log(`Всего уникальных изображений: ${imageUrlMap.size}`);
  console.log(`Повторяющихся изображений: ${duplicates.length}`);
  console.log(`Товаров с дублями: ${duplicates.reduce((sum, [_, products]) => sum + products.length, 0)}\n`);

  if (duplicates.length === 0) {
    console.log('✅ Дублей не найдено! Все изображения уникальные.');
    return;
  }

  console.log('🔴 НАЙДЕННЫЕ ДУБЛИ:\n');
  console.log('=' .repeat(80));

  duplicates.forEach(([imageUrl, products], index) => {
    console.log(`\n${index + 1}. Изображение повторяется ${products.length} раз:`);
    console.log(`   URL: ${imageUrl.substring(0, 80)}...`);
    console.log(`   Товары:`);

    products.forEach((product, i) => {
      const categoryName = categoriesMap.get(product.category_id) || 'Без категории';
      console.log(`   ${i + 1}) ${product.name} (${categoryName})`);
      console.log(`      ID: ${product.id}`);
    });

    if (index < duplicates.length - 1) {
      console.log('\n' + '-'.repeat(80));
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 РЕКОМЕНДАЦИИ:\n');
  console.log(`Найдено ${duplicates.length} повторяющихся изображений`);
  console.log(`Затронуто товаров: ${duplicates.reduce((sum, [_, products]) => sum + products.length, 0)}`);
  console.log('\nДля замены дублей на уникальные изображения запустите:');
  console.log('npx tsx scripts/replace-duplicate-images.ts');
}

findDuplicateImages().catch(console.error);
