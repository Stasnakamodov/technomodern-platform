import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function checkPositions() {
  const supabase = createClient(url, anonKey);

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
    images: p.images || []
  })) || [];

  const furnitureProducts = transformedProducts.filter(product =>
    product.category === 'Мебель'
  );

  // Позиции для замены изображений: 5,19,28,34,46,55,56
  const imagesToReplace = [5, 19, 28, 34, 46, 55, 56];

  // Позиции для переименования
  const toRename = [12, 14, 15, 17, 22, 23, 31, 38, 44, 47, 49, 50, 52, 53];

  console.log('ПОЗИЦИИ ДЛЯ ЗАМЕНЫ ИЗОБРАЖЕНИЙ:\n');
  imagesToReplace.forEach(pos => {
    const product = furnitureProducts[pos - 1];
    console.log(`${pos}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Изображение: ${product.images[0]?.substring(0, 80)}...\n`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\nПОЗИЦИИ ДЛЯ ПЕРЕИМЕНОВАНИЯ:\n');
  toRename.forEach(pos => {
    const product = furnitureProducts[pos - 1];
    console.log(`${pos}. ${product.name}`);
    console.log(`   ID: ${product.id}\n`);
  });
}

checkPositions().catch(console.error);
