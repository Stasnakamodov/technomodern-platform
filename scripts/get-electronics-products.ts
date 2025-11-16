import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function getElectronicsProducts() {
  const supabase = createClient(url, serviceKey);

  console.log('💻 Загружаю товары категории "Электроника"...\n');

  // Загружаем товары как на фронтенде
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Преобразуем как на фронтенде
  const transformedProducts = productsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: categoriesMap.get(p.category_id) || 'Без категории',
    category_id: p.category_id,
    images: p.images || []
  })) || [];

  // Фильтруем по "Электроника"
  const electronicsProducts = transformedProducts.filter(product =>
    product.category === 'Электроника'
  );

  console.log(`✅ Найдено товаров в "Электроника": ${electronicsProducts.length}\n`);

  electronicsProducts.forEach((product, index) => {
    const position = index + 1;
    console.log(`[${position}] ${product.name}`);
    console.log(`    SKU: ${product.sku}`);
    console.log(`    ID: ${product.id}`);
    console.log(`    Изображение: ${product.images[0]?.substring(0, 70)}...`);
    console.log('');
  });

  console.log(`\n📊 Всего: ${electronicsProducts.length} товаров`);
}

getElectronicsProducts().catch(console.error);
