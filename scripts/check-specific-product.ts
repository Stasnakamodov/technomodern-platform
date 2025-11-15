import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkSpecificProduct() {
  const productId = '000004a5-0000-0000-0000-000004a50000';

  console.log(`🔍 Проверка товара ID: ${productId}\n`);

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('❌ Ошибка:', error);
    return;
  }

  if (!product) {
    console.log('❌ Товар не найден');
    return;
  }

  console.log('📦 Название:', product.name);
  console.log('🆔 ID:', product.id);
  console.log('📁 Категория ID:', product.category_id);
  console.log('📅 Обновлено:', product.updated_at);
  console.log('\n🖼️  Изображения:');

  if (product.images && product.images.length > 0) {
    product.images.forEach((img: string, index: number) => {
      console.log(`  ${index + 1}. ${img}`);

      // Проверяем на клавиатуру
      if (img.includes('photo-1633406389921')) {
        console.log('     ⚠️  ЭТО КЛАВИАТУРА!');
      }

      // Проверяем на уже пробованные изображения
      if (img.includes('photo-1598550487031')) {
        console.log('     ℹ️  Попытка 1');
      }
      if (img.includes('photo-1580480055273')) {
        console.log('     ℹ️  Попытка 2');
      }
      if (img.includes('photo-1616486338812')) {
        console.log('     ℹ️  Попытка 3');
      }
    });
  } else {
    console.log('  ❌ Нет изображений');
  }

  console.log('\n📄 Полные данные:');
  console.log(JSON.stringify(product, null, 2));
}

checkSpecificProduct();
