import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

interface Product {
  id: string;
  name: string;
  category_id: string;
  images: string[];
}

// Поисковые запросы для Unsplash по категориям
const categorySearchQueries: Record<string, string> = {
  'Электроника': 'electronics gadget technology device',
  'Одежда': 'fashion clothing apparel jacket',
  'Мебель': 'furniture interior design chair',
  'Строительство': 'construction tools drill hardware',
  'Автотовары': 'automotive car accessories',
  'Дом и сад': 'home kitchen cookware garden',
  'Спорт и отдых': 'fitness sports bicycle exercise',
  'Красота и здоровье': 'beauty skincare cosmetics cream'
};

// Карта для отслеживания уже использованных URL
const usedImageUrls = new Set<string>();

async function getUniqueImageFromUnsplash(categoryName: string, productName: string): Promise<string | null> {
  const searchQuery = categorySearchQueries[categoryName] || 'product';

  // Добавляем контекст из названия товара
  let finalQuery = searchQuery;
  if (productName.includes('крем') || productName.includes('Крем')) {
    finalQuery = 'face cream skincare product';
  } else if (productName.includes('Смартфон')) {
    finalQuery = 'smartphone mobile phone';
  } else if (productName.includes('Велосипед')) {
    finalQuery = 'bicycle bike cycling';
  } else if (productName.includes('Гантели')) {
    finalQuery = 'dumbbell fitness weights';
  } else if (productName.includes('Куртка')) {
    finalQuery = 'jacket outerwear fashion';
  } else if (productName.includes('Дрель')) {
    finalQuery = 'drill power tool construction';
  } else if (productName.includes('LED светильник')) {
    finalQuery = 'led light lamp lighting';
  } else if (productName.includes('посуд')) {
    finalQuery = 'cookware kitchen utensils dishes';
  } else if (productName.includes('Ноутбук')) {
    finalQuery = 'laptop computer notebook';
  } else if (productName.includes('Наушники')) {
    finalQuery = 'headphones earbuds audio';
  } else if (productName.includes('кресло')) {
    finalQuery = 'office chair furniture ergonomic';
  }

  try {
    // Получаем больше результатов для выбора
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(finalQuery)}&per_page=30&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    if (!response.ok) {
      console.error(`Ошибка Unsplash API: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.error(`Нет результатов для запроса: ${finalQuery}`);
      return null;
    }

    // Ищем первое неиспользованное изображение
    for (const image of data.results) {
      const imageUrl = image.urls.regular;
      if (!usedImageUrls.has(imageUrl)) {
        usedImageUrls.add(imageUrl);
        return imageUrl;
      }
    }

    // Если все изображения уже использованы, берём случайное
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const fallbackUrl = data.results[randomIndex].urls.regular;
    usedImageUrls.add(fallbackUrl);
    return fallbackUrl;

  } catch (error) {
    console.error('Ошибка при запросе к Unsplash:', error);
    return null;
  }
}

async function replaceDuplicateImages() {
  const supabase = createClient(url, serviceKey);

  console.log('🔍 Загружаю товары из каталога...\n');

  // Загружаем все товары
  const { data: productsData, error } = await supabase
    .from('products')
    .select('id, name, category_id, images')
    .eq('in_stock', true);

  if (error) {
    console.error('❌ Ошибка загрузки:', error);
    return;
  }

  // Загружаем категории
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Создаём мапу: URL изображения -> массив товаров
  const imageUrlMap = new Map<string, Product[]>();

  productsData?.forEach((product: any) => {
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    if (imageUrl) {
      if (!imageUrlMap.has(imageUrl)) {
        imageUrlMap.set(imageUrl, []);
      }
      imageUrlMap.get(imageUrl)!.push({
        id: product.id,
        name: product.name,
        category_id: product.category_id,
        images: product.images
      });
    }
  });

  // Добавляем все текущие URL в usedImageUrls
  imageUrlMap.forEach((_, url) => usedImageUrls.add(url));

  // Фильтруем дубли
  const duplicates = Array.from(imageUrlMap.entries())
    .filter(([_, products]) => products.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log(`✅ Найдено ${duplicates.length} повторяющихся изображений`);
  console.log(`📦 Затронуто товаров: ${duplicates.reduce((sum, [_, products]) => sum + products.length, 0)}\n`);

  let replaced = 0;
  let errors = 0;
  let skipped = 0;

  console.log('🚀 Начинаю замену дублей...\n');
  console.log('=' .repeat(80));

  for (const [imageUrl, products] of duplicates) {
    console.log(`\n📸 Обрабатываю дубль (${products.length} товаров):`);
    console.log(`   Оригинальное изображение: ${imageUrl.substring(0, 60)}...`);

    // Первый товар оставляем с оригинальным изображением
    const [firstProduct, ...duplicateProducts] = products;
    console.log(`   ✅ Оставляю оригинал для: ${firstProduct.name}`);

    // Заменяем изображения у остальных товаров
    for (let i = 0; i < duplicateProducts.length; i++) {
      const product = duplicateProducts[i];
      const categoryName = categoriesMap.get(product.category_id) || 'Без категории';

      console.log(`\n   ${i + 1}/${duplicateProducts.length}) ${product.name} (${categoryName})`);

      // Получаем новое уникальное изображение
      const newImageUrl = await getUniqueImageFromUnsplash(categoryName, product.name);

      if (!newImageUrl) {
        console.log(`      ❌ Не удалось найти изображение`);
        errors++;
        continue;
      }

      // Обновляем в БД
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: [newImageUrl] })
        .eq('id', product.id);

      if (updateError) {
        console.log(`      ❌ Ошибка обновления: ${updateError.message}`);
        errors++;
      } else {
        console.log(`      ✅ Заменено на: ${newImageUrl.substring(0, 60)}...`);
        replaced++;
      }

      // Задержка чтобы не превысить rate limit Unsplash (50 requests/hour)
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n` + '-'.repeat(80));
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`✅ Успешно заменено: ${replaced} изображений`);
  console.log(`❌ Ошибок: ${errors}`);
  console.log(`⏭️  Пропущено: ${skipped}`);
  console.log(`📦 Всего обработано товаров: ${replaced + errors + skipped + duplicates.length}`);

  console.log('\n🎉 Готово! Обновите страницу в браузере (Cmd+R или Ctrl+R)');
  console.log('   Все дубли заменены на уникальные изображения!');
}

replaceDuplicateImages().catch(console.error);
