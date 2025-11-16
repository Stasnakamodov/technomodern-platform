import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function checkElectronicsDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔍 Проверка дубликатов изображений в категории "Электроника"...\n');

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  const electronics = productsData?.filter((p: any) =>
    categoriesMap.get(p.category_id) === 'Электроника'
  ) || [];

  console.log(`📦 Всего товаров: ${electronics.length}\n`);

  // Проверяем дубликаты
  const imageMap = new Map<string, string[]>();

  electronics.forEach((product: any) => {
    const imageUrl = product.images?.[0] || '';
    if (imageUrl) {
      if (!imageMap.has(imageUrl)) {
        imageMap.set(imageUrl, []);
      }
      imageMap.get(imageUrl)!.push(product.name);
    }
  });

  // Находим дубликаты
  const duplicates = Array.from(imageMap.entries()).filter(([url, products]) => products.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ Дубликатов не найдено! Все изображения уникальные.');
    console.log(`\n📊 Статистика:`);
    console.log(`   Всего товаров: ${electronics.length}`);
    console.log(`   Уникальных изображений: ${imageMap.size}`);
  } else {
    console.log(`⚠️  Найдено дубликатов: ${duplicates.length}\n`);
    duplicates.forEach(([url, products], index) => {
      console.log(`[${index + 1}] ${url.substring(0, 70)}...`);
      console.log(`   Используется в ${products.length} товарах:`);
      products.forEach(name => console.log(`   - ${name}`));
      console.log('');
    });
  }
}

checkElectronicsDuplicates().catch(console.error);
