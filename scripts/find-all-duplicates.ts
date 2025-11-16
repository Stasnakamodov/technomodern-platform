import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  images: string[];
}

async function findAllDuplicates() {
  const supabase = createClient(url, serviceKey);

  console.log('🔍 Поиск дублирующихся изображений во всех категориях...\n');

  // Загружаем все товары
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Преобразуем товары
  const products: Product[] = productsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: categoriesMap.get(p.category_id) || 'Без категории',
    images: p.images || []
  })) || [];

  console.log(`✅ Загружено товаров: ${products.length}\n`);

  // Группируем по категориям
  const categoriesSet = new Set(products.map(p => p.category));
  const categories = Array.from(categoriesSet).sort();

  console.log(`📂 Категории: ${categories.join(', ')}\n`);
  console.log('='.repeat(100));

  let totalDuplicates = 0;
  const duplicatesByCategory: Record<string, any[]> = {};

  // Проверяем каждую категорию
  for (const categoryName of categories) {
    const categoryProducts = products.filter(p => p.category === categoryName);

    // Создаем мапу: imageUrl -> массив товаров
    const imageMap = new Map<string, Product[]>();

    categoryProducts.forEach(product => {
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0];
        if (!imageMap.has(imageUrl)) {
          imageMap.set(imageUrl, []);
        }
        imageMap.get(imageUrl)!.push(product);
      }
    });

    // Находим дубли (где больше 1 товара на одно изображение)
    const duplicates = Array.from(imageMap.entries())
      .filter(([_, prods]) => prods.length > 1)
      .map(([imageUrl, prods]) => ({
        imageUrl,
        products: prods,
        count: prods.length
      }));

    if (duplicates.length > 0) {
      duplicatesByCategory[categoryName] = duplicates;
      totalDuplicates += duplicates.length;

      console.log(`\n📁 Категория: ${categoryName}`);
      console.log(`   Всего товаров: ${categoryProducts.length}`);
      console.log(`   Найдено групп дублей: ${duplicates.length}\n`);

      duplicates.forEach((dup, idx) => {
        console.log(`   Дубль #${idx + 1}: ${dup.count} товаров используют одно изображение`);
        console.log(`   Изображение: ${dup.imageUrl.substring(0, 80)}...`);
        dup.products.forEach((prod, prodIdx) => {
          console.log(`      ${prodIdx + 1}. ${prod.name} (SKU: ${prod.sku})`);
        });
        console.log('');
      });

      console.log('   ' + '-'.repeat(96));
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`Всего товаров проверено: ${products.length}`);
  console.log(`Категорий с дублями: ${Object.keys(duplicatesByCategory).length}`);
  console.log(`Групп дублирующихся изображений: ${totalDuplicates}`);

  if (totalDuplicates === 0) {
    console.log('\n✅ Дубликатов не найдено! Все товары имеют уникальные изображения.');
  } else {
    console.log('\n⚠️  Обнаружены дублирующиеся изображения в следующих категориях:');
    Object.keys(duplicatesByCategory).forEach(cat => {
      const dupCount = duplicatesByCategory[cat].length;
      console.log(`   - ${cat}: ${dupCount} групп дублей`);
    });

    // Подсчитываем общее количество товаров с дублями
    let productsWithDuplicates = 0;
    Object.values(duplicatesByCategory).forEach(dups => {
      dups.forEach(dup => {
        productsWithDuplicates += dup.count;
      });
    });
    console.log(`\n   Всего товаров с дублирующимися изображениями: ${productsWithDuplicates}`);
  }

  console.log('\n' + '='.repeat(100));
}

findAllDuplicates().catch(console.error);
