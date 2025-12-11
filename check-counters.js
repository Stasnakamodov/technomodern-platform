const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function getCategories() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,name,product_count&parent_id=not.is.null&order=name`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.json();
}

async function getRealCount(categoryId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?category_id=eq.${categoryId}&select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
      'Range': '0-0'
    }
  });
  const range = res.headers.get('content-range');
  if (range) {
    const match = range.match(/\/(\d+)/);
    if (match) return parseInt(match[1]);
  }
  return 0;
}

async function main() {
  console.log('=== ПРОВЕРКА СЧЁТЧИКОВ vs РЕАЛЬНОЕ КОЛИЧЕСТВО ===\n');

  const cats = await getCategories();

  console.log('| Категория                  | Счётчик | Реально | Статус |');
  console.log('|----------------------------|---------|---------|--------|');

  let mismatches = [];
  let totalCounter = 0;
  let totalReal = 0;

  for (const cat of cats) {
    const counter = cat.product_count || 0;
    const real = await getRealCount(cat.id);

    totalCounter += counter;
    totalReal += real;

    const status = counter === real ? '✅' : '❌';
    if (counter !== real) {
      mismatches.push({ name: cat.name, id: cat.id, counter, real });
    }

    const name = cat.name.substring(0, 26).padEnd(26);
    console.log(`| ${name} | ${String(counter).padStart(7)} | ${String(real).padStart(7)} | ${status}     |`);
  }

  console.log('');
  console.log(`ИТОГО в счётчиках: ${totalCounter}`);
  console.log(`ИТОГО реально: ${totalReal}`);
  console.log('');

  if (mismatches.length > 0) {
    console.log(`❌ НЕСОВПАДЕНИЙ: ${mismatches.length}`);
    for (const m of mismatches) {
      const diff = m.real - m.counter;
      const sign = diff > 0 ? '+' : '';
      console.log(`   - ${m.name}: ${m.counter} → ${m.real} (${sign}${diff})`);
    }
  } else {
    console.log('✅ Все счётчики корректны!');
  }
}

main().catch(console.error);
