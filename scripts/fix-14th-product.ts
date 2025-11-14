import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function fix14thProduct() {
  const supabase = createClient(url, serviceKey);

  // 14-й товар (по порядку на фронтенде)
  const productId = '000005a3-0000-0000-0000-000005a30000';

  console.log('🔍 Ищу релевантное изображение крема для лица...\n');

  // Поиск изображений крема с конкретными запросами
  const queries = [
    'moisturizer cream jar white background',
    'face cream bottle beauty product',
    'skincare product white cream jar',
    'cosmetic cream container studio shot'
  ];

  for (const query of queries) {
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
        // Берём случайное из первых 5
        const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
        const newImage = data.results[randomIndex];
        const newImageUrl = newImage.urls.regular;

        console.log(`✅ Найдено изображение: ${newImageUrl}`);
        console.log(`   Автор: ${newImage.user.name}`);
        console.log(`   Запрос: "${query}"`);
        console.log(`   Описание: ${newImage.description || newImage.alt_description || 'N/A'}\n`);

        // Обновляем в БД
        const { data: updatedData, error } = await supabase
          .from('products')
          .update({ images: [newImageUrl] })
          .eq('id', productId)
          .select();

        if (error) {
          console.error('❌ Ошибка обновления:', error);
          continue;
        }

        console.log('✅ Изображение успешно обновлено в БД!');
        console.log(`\nТовар: ${updatedData[0].name}`);
        console.log(`Новое изображение: ${updatedData[0].images[0]}`);
        console.log('\n🎉 Готово! Обновите страницу в браузере (Cmd+R или Ctrl+R)');
        console.log('   14-я позиция в "Красота и здоровье" теперь с релевантным изображением!');
        return;
      }
    } catch (error) {
      console.error(`Ошибка при запросе "${query}":`, error);
    }
  }

  console.error('❌ Не удалось найти подходящее изображение');
}

fix14thProduct().catch(console.error);
