import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

const TEMP_DIR = '/tmp/catalog-images';
const RESULTS_FILE = path.join(TEMP_DIR, 'visual-duplicates.json');

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

const usedImageUrls = new Set<string>();

async function getUniqueImageFromUnsplash(categoryName: string, productName: string): Promise<string | null> {
  const searchQuery = categorySearchQueries[categoryName] || 'product';

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
  } else if (productName.includes('Кроссовки')) {
    finalQuery = 'sneakers running shoes sport';
  }

  try {
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

    // Ищем неиспользованное изображение
    for (const image of data.results) {
      const imageUrl = image.urls.regular;
      if (!usedImageUrls.has(imageUrl)) {
        usedImageUrls.add(imageUrl);
        return imageUrl;
      }
    }

    // Fallback
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const fallbackUrl = data.results[randomIndex].urls.regular;
    usedImageUrls.add(fallbackUrl);
    return fallbackUrl;

  } catch (error) {
    console.error('Ошибка при запросе к Unsplash:', error);
    return null;
  }
}

async function replaceVisualDuplicates() {
  const supabase = createClient(url, serviceKey);

  // Загружаем результаты предыдущего анализа
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error('❌ Файл с результатами не найден!');
    console.log('Сначала запустите: npx tsx scripts/find-visual-duplicates.ts');
    return;
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  const duplicates = results.duplicates;

  console.log(`✅ Загружено ${duplicates.length} групп визуальных дублей\n`);

  // Загружаем категории
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Добавляем все текущие URL в usedImageUrls
  duplicates.forEach((group: any) => {
    group.products.forEach((product: any) => {
      usedImageUrls.add(product.imageUrl);
    });
  });

  let replaced = 0;
  let errors = 0;

  console.log('🚀 Начинаю замену визуальных дублей...\n');
  console.log('=' .repeat(80));

  for (const group of duplicates) {
    const products = group.products;

    console.log(`\n📸 Обрабатываю группу (${products.length} товаров с одинаковым изображением):`);
    console.log(`   Hash: ${group.hash.substring(0, 16)}...`);

    // Первый товар оставляем
    const [firstProduct, ...duplicateProducts] = products;
    console.log(`   ✅ Оставляю оригинал для: ${firstProduct.name}`);

    // Заменяем у остальных
    for (let i = 0; i < duplicateProducts.length; i++) {
      const product = duplicateProducts[i];
      const categoryName = categoriesMap.get(product.category_id) || 'Без категории';

      console.log(`\n   ${i + 1}/${duplicateProducts.length}) ${product.name} (${categoryName})`);

      // Получаем новое изображение
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

      // Задержка для rate limit
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n` + '-'.repeat(80));
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`✅ Успешно заменено: ${replaced} изображений`);
  console.log(`❌ Ошибок: ${errors}`);

  console.log('\n🎉 Готово! Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

replaceVisualDuplicates().catch(console.error);
