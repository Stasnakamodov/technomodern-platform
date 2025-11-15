import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function findKeyboardImage() {
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

  // Ищем все товары с клавиатурой (photo-1633406389921)
  const keyboardImageId = '1633406389921';

  console.log('🔍 ИЩЕМ ВСЕ ТОВАРЫ С КЛАВИАТУРОЙ:\n');

  furnitureProducts.forEach((product, index) => {
    const imageUrl = product.images[0] || '';
    if (imageUrl.includes(keyboardImageId)) {
      console.log(`Позиция ${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Изображение: ${imageUrl}\n`);
    }
  });
}

findKeyboardImage().catch(console.error);
