import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Используем ANON KEY как на фронтенде!
const supabase = createClient(supabaseUrl, anonKey);

async function checkAPIResponse() {
  const productId = '000004a5-0000-0000-0000-000004a50000';

  console.log('🔍 Проверяем что ВИДИТ ФРОНТЕНД через ANON KEY\n');
  console.log(`Using ANON KEY: ${anonKey.substring(0, 50)}...\n`);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('❌ Ошибка:', error);
    return;
  }

  console.log('📦 Данные которые ВИДИТ ФРОНТЕНД:');
  console.log(`   Название: ${data.name}`);
  console.log(`   ID: ${data.id}`);
  console.log(`   Обновлено: ${data.updated_at}`);
  console.log(`\n🖼️  Изображения (${data.images?.length || 0}):`);

  if (data.images && data.images.length > 0) {
    data.images.forEach((img: string, index: number) => {
      console.log(`   ${index + 1}. ${img}`);

      // Проверяем на клавиатуру
      if (img.includes('1633406389921')) {
        console.log('      ⚠️⚠️⚠️  ЭТО КЛАВИАТУРА! ANON KEY ВИДИТ СТАРЫЕ ДАННЫЕ!');
      }
      if (img.includes('ZOWxCWfltzU')) {
        console.log('      ✅ Это НОВОЕ изображение gaming кресла');
      }
    });
  } else {
    console.log('   ❌ Нет изображений');
  }

  console.log('\n📄 Полный JSON ответ:');
  console.log(JSON.stringify(data, null, 2));
}

checkAPIResponse();
