import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function check3Products() {
  const supabase = createClient(url, anonKey);

  const products = [
    'Офисное кресло Comfort Кожа/Ткань',
    'Диван Modern 2-местный',
    'Диван Modern Прямой'
  ];

  for (const name of products) {
    const { data } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('name', name)
      .single();

    if (data) {
      console.log(`\n${data.name}`);
      console.log(`ID: ${data.id}`);
      console.log(`Изображение: ${data.images?.[0] || 'НЕТ'}`);
    }
  }
}

check3Products().catch(console.error);
