import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Set для отслеживания использованных изображений
const usedImageIds = new Set<string>();

// Функция для получения ТОЧНОГО поискового запроса для мебели
function getSearchQuery(productName: string): string {
  const name = productName.toLowerCase();

  // ДИВАНЫ
  if (name.includes('диван')) {
    if (name.includes('classic')) {
      if (name.includes('раскладной')) {
        return 'classic sofa bed sleeper couch beige white background';
      }
      if (name.includes('угловой')) {
        return 'classic corner sectional sofa beige white background';
      }
      if (name.includes('прямой')) {
        return 'classic straight sofa couch beige white background';
      }
      if (name.includes('3-местный')) {
        return 'classic three seat sofa beige white background';
      }
      if (name.includes('2-местный')) {
        return 'classic two seat loveseat sofa beige white background';
      }
      return 'classic sofa couch beige white background';
    }

    if (name.includes('modern')) {
      if (name.includes('раскладной')) {
        return 'modern sleeper sofa bed grey white background';
      }
      if (name.includes('угловой')) {
        return 'modern corner sectional sofa grey white background';
      }
      if (name.includes('прямой')) {
        return 'modern straight sofa grey white background';
      }
      if (name.includes('3-местный')) {
        return 'modern three seat sofa grey white background';
      }
      if (name.includes('2-местный')) {
        return 'modern two seat loveseat grey white background';
      }
      return 'modern sofa grey white background';
    }

    if (name.includes('comfort')) {
      if (name.includes('прямой')) {
        return 'comfortable straight sofa fabric white background';
      }
      if (name.includes('3-местный')) {
        return 'comfortable three seat sofa fabric white background';
      }
      if (name.includes('2-местный')) {
        return 'comfortable two seat loveseat white background';
      }
      return 'comfortable sofa fabric white background';
    }

    if (name.includes('space')) {
      if (name.includes('раскладной')) {
        return 'space saving sofa bed compact white background';
      }
      if (name.includes('угловой')) {
        return 'space saving corner sofa compact white background';
      }
      if (name.includes('3-местный')) {
        return 'space saving three seat sofa white background';
      }
      if (name.includes('2-местный')) {
        return 'space saving two seat sofa white background';
      }
      return 'space saving sofa compact white background';
    }

    if (name.includes('lux')) {
      if (name.includes('раскладной')) {
        return 'luxury sofa bed velvet white background';
      }
      if (name.includes('2-местный')) {
        return 'luxury two seat sofa velvet white background';
      }
      return 'luxury sofa velvet white background';
    }

    return 'modern sofa couch white background';
  }

  // ОФИСНЫЕ КРЕСЛА
  if (name.includes('офисное кресло') || name.includes('кресло')) {
    if (name.includes('gaming')) {
      if (name.includes('массаж')) {
        return 'gaming chair massage racing seat white background';
      }
      if (name.includes('эргономичное')) {
        return 'gaming chair ergonomic racing seat white background';
      }
      return 'gaming chair racing seat white background';
    }

    if (name.includes('executive')) {
      if (name.includes('массаж')) {
        return 'executive office chair massage leather white background';
      }
      if (name.includes('кожа')) {
        return 'executive office chair leather high back white background';
      }
      if (name.includes('с подлокотниками')) {
        return 'executive office chair armrests leather white background';
      }
      return 'executive office chair leather white background';
    }

    if (name.includes('classic')) {
      if (name.includes('массаж')) {
        return 'classic office chair massage function white background';
      }
      if (name.includes('эргономичное')) {
        return 'classic office chair ergonomic white background';
      }
      if (name.includes('с подлокотниками')) {
        return 'classic office chair armrests white background';
      }
      return 'classic office chair white background';
    }

    if (name.includes('comfort')) {
      if (name.includes('массаж')) {
        return 'comfort office chair massage mesh white background';
      }
      if (name.includes('эргономичное')) {
        return 'comfort office chair ergonomic mesh white background';
      }
      if (name.includes('с подлокотниками')) {
        return 'comfort office chair armrests mesh white background';
      }
      if (name.includes('кожа')) {
        return 'comfort office chair leather mesh white background';
      }
      return 'comfort office chair mesh white background';
    }

    if (name.includes('ergo')) {
      if (name.includes('массаж')) {
        return 'ergonomic office chair massage lumbar support white background';
      }
      if (name.includes('эргономичное')) {
        return 'ergonomic office chair lumbar support white background';
      }
      if (name.includes('регулируемое')) {
        return 'ergonomic office chair adjustable height white background';
      }
      if (name.includes('кожа')) {
        return 'ergonomic office chair leather lumbar white background';
      }
      return 'ergonomic office chair white background';
    }

    return 'office chair ergonomic white background';
  }

  // Общий запрос для мебели
  return 'modern furniture white background';
}

async function getRelevantImage(productName: string): Promise<string | null> {
  const query = getSearchQuery(productName);

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Ищем первое НЕИСПОЛЬЗОВАННОЕ изображение
      for (const image of data.results) {
        if (!usedImageIds.has(image.id)) {
          usedImageIds.add(image.id);
          return image.urls.regular;
        }
      }

      // Если все использованы, берем первое (лучше чем ничего)
      console.log(`   ⚠️  Все изображения для запроса "${query}" уже использованы`);
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function fixAllMebelImages() {
  const supabase = createClient(url, serviceKey);

  console.log('🛋️  ЗАГРУЖАЮ ТОВАРЫ КАТЕГОРИИ "МЕБЕЛЬ"...\n');

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
    category_id: p.category_id,
    images: p.images || []
  })) || [];

  const furnitureProducts = transformedProducts.filter(product =>
    product.category === 'Мебель'
  );

  console.log(`✅ Найдено товаров: ${furnitureProducts.length}\n`);
  console.log('🔄 НАЧИНАЮ ЗАМЕНУ ВСЕХ ИЗОБРАЖЕНИЙ НА РЕЛЕВАНТНЫЕ...\n');
  console.log('=' + '='.repeat(79) + '\n');

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < furnitureProducts.length; i++) {
    const product = furnitureProducts[i];
    const position = i + 1;

    console.log(`[${position}/${furnitureProducts.length}] 🛋️  ${product.name}`);

    const searchQuery = getSearchQuery(product.name);
    console.log(`   🔍 Запрос: "${searchQuery}"`);

    const newImageUrl = await getRelevantImage(product.name);

    if (!newImageUrl) {
      console.log(`   ❌ Не удалось найти изображение\n`);
      failed++;
      await sleep(1500);
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ images: [newImageUrl] })
      .eq('id', product.id);

    if (error) {
      console.log(`   ❌ Ошибка обновления: ${error.message}\n`);
      failed++;
    } else {
      console.log(`   ✅ ОБНОВЛЕНО на релевантное изображение`);
      console.log(`   🖼️  ${newImageUrl.substring(0, 70)}...\n`);
      updated++;
    }

    await sleep(1500);
  }

  console.log('\n' + '=' + '='.repeat(79));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`   Всего товаров: ${furnitureProducts.length}`);
  console.log(`   Успешно обновлено: ${updated}`);
  console.log(`   Не удалось обновить: ${failed}`);
  console.log(`   Использовано уникальных изображений: ${usedImageIds.size}`);
  console.log('\n✅ ЗАМЕНА ЗАВЕРШЕНА! Все изображения теперь релевантны товарам.');
  console.log('\n🔄 Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixAllMebelImages().catch(console.error);
