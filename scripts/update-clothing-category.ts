import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRelevantImage(productName: string): Promise<string | null> {
  let query = '';

  // Определяем поисковый запрос на основе названия
  const nameLower = productName.toLowerCase();

  if (nameLower.includes('пальто')) {
    query = 'woman autumn coat fashion outdoor';
  } else if (nameLower.includes('футболка')) {
    if (nameLower.includes('белая') || nameLower.includes('белый')) {
      query = 'white t-shirt fashion woman';
    } else if (nameLower.includes('черная') || nameLower.includes('черный')) {
      query = 'black t-shirt fashion woman';
    } else if (nameLower.includes('пиратская')) {
      query = 'black skull t-shirt pirate fashion';
    } else if (nameLower.includes('принт')) {
      query = 'printed t-shirt fashion woman';
    } else {
      query = 't-shirt fashion woman clothing';
    }
  } else if (nameLower.includes('шорты')) {
    query = 'woman summer shorts fashion';
  } else if (nameLower.includes('коллекция')) {
    query = 'autumn fashion collection woman clothing';
  } else if (nameLower.includes('штаны')) {
    if (nameLower.includes('спортивные')) {
      query = 'woman sport pants athletic wear';
    } else {
      query = 'woman pants trousers fashion';
    }
  } else if (nameLower.includes('свитшот')) {
    query = 'white sweatshirt fashion woman hoodie';
  } else if (nameLower.includes('панамка')) {
    query = 'beige panama hat summer woman';
  } else if (nameLower.includes('набор') || nameLower.includes('кежуал')) {
    query = 'casual woman outfit set fashion';
  } else if (nameLower.includes('костюм')) {
    query = 'sport tracksuit woman athletic wear';
  } else if (nameLower.includes('пончо')) {
    query = 'light poncho woman fashion';
  } else if (nameLower.includes('куртка')) {
    query = 'woman jacket fashion outdoor';
  } else if (nameLower.includes('кроссовки')) {
    query = 'sneakers shoes sport fashion';
  } else {
    query = 'fashion clothing woman apparel';
  }

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
      // Берём случайное из первых 10
      const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
      return data.results[randomIndex].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска для "${productName}":`, error);
  }

  return null;
}

async function updateClothingCategory() {
  const supabase = createClient(url, serviceKey);

  console.log('👕 Обновляем категорию "Одежда"...\n');

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

  // Фильтруем по "Одежда"
  const clothingProducts = transformedProducts.filter(product =>
    product.category === 'Одежда'
  );

  console.log(`✅ Найдено товаров: ${clothingProducts.length}\n`);

  // Изменения согласно списку пользователя
  const updates: Record<number, { name?: string, updateImage?: boolean }> = {
    1: { name: 'Осеннее пальто', updateImage: true },
    2: { name: 'Футболка Sport' }, // убрать "Оверсайз"
    4: { name: 'Шорты женские летние', updateImage: true },
    5: { name: 'Осенняя коллекция 2025г', updateImage: true },
    6: { name: 'Спортивные женские штаны', updateImage: true },
    8: { name: 'Белый свитшот', updateImage: true },
    9: { name: 'Панамка летняя бежевая', updateImage: true },
    10: { name: 'Белый свитшот HOTEL', updateImage: true },
    11: { name: 'Штаны женские', updateImage: true },
    12: { updateImage: true },
    13: { updateImage: true },
    14: { updateImage: true },
    16: { name: 'Женский набор кежуал', updateImage: true },
    17: { name: 'Пиратская черная футболка', updateImage: true },
    18: { name: 'Спортивный костюм', updateImage: true },
    19: { name: 'Свитшоты утепленные', updateImage: true },
    20: { updateImage: true },
    21: { name: 'Пончо легкое', updateImage: true },
    22: { name: 'Летняя белая футболка с принтом', updateImage: true },
    23: { name: 'Спортивный костюм', updateImage: true },
    24: { name: 'Черная футболка', updateImage: true },
    26: { updateImage: true },
    27: { updateImage: true },
    29: { updateImage: true },
    31: { updateImage: true },
    38: { updateImage: true }
  };

  let updatedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < clothingProducts.length; i++) {
    const position = i + 1;
    const product = clothingProducts[i];
    const change = updates[position];

    if (!change) {
      continue; // Пропускаем товары без изменений
    }

    console.log(`\n[${position}/${clothingProducts.length}] ${product.name}`);

    let newName = change.name || product.name;
    let newImageUrl = product.images[0];

    // Обновляем изображение если нужно
    if (change.updateImage) {
      console.log('   🔄 Получаю новое изображение...');
      const imageUrl = await getRelevantImage(newName);
      if (imageUrl) {
        newImageUrl = imageUrl;
        console.log(`   ✅ Новое изображение: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log('   ⚠️ Не удалось найти новое изображение, оставляю старое');
      }
      await sleep(1500); // Rate limiting для Unsplash API
    }

    // Подготавливаем данные для обновления
    const updateData: any = {};
    if (change.name) {
      updateData.name = newName;
      console.log(`   📝 Новое название: ${newName}`);
    }
    if (change.updateImage && newImageUrl !== product.images[0]) {
      updateData.images = [newImageUrl];
    }

    // Обновляем в БД
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) {
        console.log(`   ❌ Ошибка обновления: ${error.message}`);
        failedCount++;
      } else {
        console.log(`   ✅ Обновлено успешно`);
        updatedCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 РЕЗУЛЬТАТЫ:\n');
  console.log(`Всего товаров в категории: ${clothingProducts.length}`);
  console.log(`Запланировано изменений: ${Object.keys(updates).length}`);
  console.log(`Успешно обновлено: ${updatedCount}`);
  console.log(`Ошибок: ${failedCount}`);
  console.log('\n🎉 Готово! Обновите страницу каталога в браузере.');
}

updateClothingCategory().catch(console.error);
