import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function findMebelDuplicates() {
  const supabase = createClient(url, anonKey);

  console.log('🛋️  Ищу дубликаты в категории "Мебель"...\n');

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

  console.log(`✅ Найдено товаров: ${furnitureProducts.length}\n`);

  // Извлекаем ID фотографий из URL
  const imageMap = new Map<string, Array<{position: number, name: string, id: string}>>();

  furnitureProducts.forEach((product, index) => {
    const imageUrl = product.images[0] || '';
    if (imageUrl) {
      // Извлекаем ID фотографии из URL (например photo-1581619897692)
      const match = imageUrl.match(/photo-([a-zA-Z0-9]+)/);
      if (match) {
        const photoId = match[1];
        if (!imageMap.has(photoId)) {
          imageMap.set(photoId, []);
        }
        const arr = imageMap.get(photoId);
        if (arr) {
          arr.push({
            position: index + 1,
            name: product.name,
            id: product.id
          });
        }
      }
    }
  });

  const duplicates = Array.from(imageMap.entries())
    .filter(([_, products]) => products.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ ДУБЛИКАТОВ НЕТ! Все изображения уникальны.');
  } else {
    console.log(`❌ НАЙДЕНО ${duplicates.length} ДУБЛИРУЮЩИХСЯ ИЗОБРАЖЕНИЙ:\n`);
    console.log('=' + '='.repeat(79));

    duplicates.forEach(([photoId, products], index) => {
      console.log(`\n${index + 1}. Photo ID: ${photoId} (используется ${products.length} раз)`);
      products.forEach(p => {
        console.log(`   - Позиция ${p.position}: ${p.name}`);
        console.log(`     ID: ${p.id}`);
      });
    });

    console.log('\n' + '=' + '='.repeat(79));
    console.log(`\nВСЕГО дублей: ${duplicates.length}`);
  }
}

findMebelDuplicates().catch(console.error);
