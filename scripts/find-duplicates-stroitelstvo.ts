import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function findDuplicates() {
  const supabase = createClient(url, anonKey);

  console.log('🔨 Ищу дубликаты в категории "Строительство"...\n');

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  const transformedProducts = productsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: categoriesMap.get(p.category_id) || 'Без категории',
    category_id: p.category_id,
    images: p.images || []
  })) || [];

  const constructionProducts = transformedProducts.filter(product =>
    product.category === 'Строительство'
  );

  console.log(`✅ Найдено товаров: ${constructionProducts.length}\n`);

  const imageUrlMap = new Map<string, Array<{position: number, name: string, id: string}>>();

  constructionProducts.forEach((product, index) => {
    const imageUrl = product.images[0] || '';
    if (imageUrl) {
      if (!imageUrlMap.has(imageUrl)) {
        imageUrlMap.set(imageUrl, []);
      }
      imageUrlMap.get(imageUrl)!.push({
        position: index + 1,
        name: product.name,
        id: product.id
      });
    }
  });

  const duplicates = Array.from(imageUrlMap.entries())
    .filter(([_, products]) => products.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ Дубликатов не найдено! Все изображения уникальны.');
    return;
  }

  console.log(`❌ Найдено ${duplicates.length} дублирующихся изображений:\n`);
  console.log('='.repeat(100));

  duplicates.forEach(([imageUrl, products], index) => {
    console.log(`\n${index + 1}. Дубликат (${products.length} товаров):`);
    console.log(`   Изображение: ${imageUrl.substring(0, 70)}...`);
    console.log(`   Товары:`);
    products.forEach(p => {
      console.log(`      - Позиция ${p.position}: ${p.name}`);
      console.log(`        ID: ${p.id}`);
    });
  });

  console.log('\n' + '='.repeat(100));
  console.log(`\n📊 ИТОГО: ${duplicates.length} дублирующихся изображений`);
  console.log(`Затронуто товаров: ${duplicates.reduce((sum, [_, prods]) => sum + prods.length, 0)}`);
}

findDuplicates().catch(console.error);
