/**
 * Полный аудит релевантности товаров в подкатегориях
 */

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

async function fetchProducts(categoryId, limit = 50) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=name&category_id=eq.${categoryId}&limit=${limit}`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?select=id,name,level,parent_id,product_count&order=level,name`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  return response.json();
}

async function audit() {
  const categories = await fetchCategories();

  // Только подкатегории (level=2)
  const subcategories = categories.filter(c => c.level === 2);

  console.log('=== ПОЛНЫЙ АУДИТ РЕЛЕВАНТНОСТИ ТОВАРОВ ===\n');

  for (const cat of subcategories) {
    if (cat.product_count === 0) continue;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 ${cat.name} (${cat.product_count} товаров)`);
    console.log('='.repeat(60));

    const products = await fetchProducts(cat.id, 30);

    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
    });

    if (cat.product_count > 30) {
      console.log(`... и ещё ${cat.product_count - 30} товаров`);
    }
  }
}

audit().catch(console.error);
