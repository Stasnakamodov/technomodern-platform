import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

const supabase = createClient(supabaseUrl, serviceKey);

function extractPhotoId(url: string): string | null {
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

async function checkDuplicates() {
  console.log('🔍 Проверка дубликатов изображений в категории Мебель...\n');

  // Получаем ID категории "Мебель"
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('name', 'Мебель')
    .single();

  if (categoryError || !category) {
    console.error('❌ Ошибка получения категории:', categoryError);
    return;
  }

  console.log(`📁 Категория: ${category.name} (ID: ${category.id})\n`);

  // Получаем все товары категории Мебель
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('category_id', category.id);

  if (productsError) {
    console.error('❌ Ошибка получения товаров:', productsError);
    return;
  }

  console.log(`📦 Всего товаров в категории: ${products.length}\n`);

  // Создаем Map для отслеживания использования изображений
  const imageUsage = new Map<string, Array<{ id: string; name: string; url: string }>>();

  // Проходим по всем товарам
  products.forEach(product => {
    if (!product.images || product.images.length === 0) return;

    product.images.forEach((imageUrl: string) => {
      const photoId = extractPhotoId(imageUrl);

      if (!photoId) {
        console.log(`⚠️  Не удалось извлечь photo ID из: ${imageUrl}`);
        return;
      }

      if (!imageUsage.has(photoId)) {
        imageUsage.set(photoId, []);
      }

      imageUsage.get(photoId)!.push({
        id: product.id,
        name: product.name,
        url: imageUrl,
      });
    });
  });

  // Ищем дубликаты
  const duplicates = Array.from(imageUsage.entries()).filter(([_, usage]) => usage.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ Дубликатов не найдено! Все изображения уникальны.');
    return;
  }

  console.log(`⚠️  Найдено дубликатов: ${duplicates.length}\n`);

  duplicates.forEach(([photoId, usage]) => {
    console.log(`🔄 Photo ID: ${photoId}`);
    console.log(`   Используется в ${usage.length} товарах:`);
    usage.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
      console.log(`      URL: ${item.url}`);
    });
    console.log();
  });

  // Специальная проверка нового изображения
  const newPhotoId = 'ZOWxCWfltzU';
  console.log(`\n🔍 Проверка нового изображения gaming кресла (photo-${newPhotoId}):`);

  if (imageUsage.has(newPhotoId)) {
    const usage = imageUsage.get(newPhotoId)!;
    if (usage.length === 1) {
      console.log(`✅ Используется только в одном товаре: ${usage[0].name}`);
      console.log(`   ID товара: ${usage[0].id}`);
    } else {
      console.log(`⚠️  Используется в ${usage.length} товарах - это дубликат!`);
    }
  } else {
    console.log(`❌ Изображение не найдено в базе данных`);
  }
}

checkDuplicates();
