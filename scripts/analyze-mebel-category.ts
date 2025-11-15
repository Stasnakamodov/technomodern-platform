import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function analyzeMebelCategory() {
  const supabase = createClient(url, anonKey);

  console.log('🛋️  Анализирую категорию "Мебель"...\n');

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

  const furnitureProducts = transformedProducts.filter(product =>
    product.category === 'Мебель'
  );

  console.log(`✅ Найдено товаров в "Мебель": ${furnitureProducts.length}\n`);

  if (furnitureProducts.length === 0) {
    console.log('❌ Товары не найдены в этой категории.');
    console.log('\nДоступные категории:');
    const uniqueCategories = new Set(transformedProducts.map(p => p.category));
    uniqueCategories.forEach(cat => console.log(`  - ${cat}`));
    return;
  }

  console.log('📋 ВСЕ ТОВАРЫ В КАТЕГОРИИ:\n');
  console.log('='.repeat(100));

  furnitureProducts.forEach((product, index) => {
    const imageUrl = product.images[0] || 'НЕТ ИЗОБРАЖЕНИЯ';
    const position = index + 1;

    console.log(`\n${position}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Изображение: ${imageUrl.substring(0, 80)}...`);
  });

  console.log('\n' + '='.repeat(100));
  console.log(`\n📊 ВСЕГО: ${furnitureProducts.length} товаров`);
}

analyzeMebelCategory().catch(console.error);
