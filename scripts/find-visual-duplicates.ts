import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const TEMP_DIR = '/tmp/catalog-images';

interface Product {
  id: string;
  name: string;
  category_id: string;
  images: string[];
}

// Создаём временную директорию для изображений
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

// Скачивание изображения
async function downloadImage(imageUrl: string, productId: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Ошибка загрузки ${imageUrl}: ${response.status}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const filePath = path.join(TEMP_DIR, `${productId}.jpg`);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return filePath;
  } catch (error) {
    console.error(`Ошибка загрузки ${imageUrl}:`, error);
    return null;
  }
}

// Вычисление MD5 хеша файла
function calculateFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

async function findVisualDuplicates() {
  const supabase = createClient(url, anonKey);

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

  console.log(`✅ Загружено товаров: ${productsData?.length}\n`);

  // Загружаем категории
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');

  const categoriesMap = new Map(categoriesData?.map(c => [c.id, c.name]) || []);

  // Подготавливаем временную директорию
  ensureTempDir();

  console.log('📥 Скачиваю изображения для анализа...');
  console.log('⏳ Это займёт ~2-3 минуты для 379 товаров...\n');

  const products: Product[] = [];
  const imageHashes = new Map<string, Product[]>();
  let downloaded = 0;
  let errors = 0;

  // Скачиваем и анализируем изображения
  for (const product of productsData || []) {
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    if (!imageUrl) {
      continue;
    }

    const productObj: Product = {
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      images: product.images
    };

    products.push(productObj);

    // Скачиваем изображение
    const filePath = await downloadImage(imageUrl, product.id);

    if (!filePath) {
      errors++;
      continue;
    }

    // Вычисляем хеш
    const hash = calculateFileHash(filePath);

    if (!imageHashes.has(hash)) {
      imageHashes.set(hash, []);
    }
    imageHashes.get(hash)!.push(productObj);

    downloaded++;

    // Показываем прогресс
    if (downloaded % 50 === 0) {
      console.log(`   📦 Обработано: ${downloaded}/${productsData.length} (${Math.round(downloaded / productsData.length * 100)}%)`);
    }
  }

  console.log(`\n✅ Скачано и проанализировано: ${downloaded} изображений`);
  console.log(`❌ Ошибок: ${errors}\n`);

  // Фильтруем визуальные дубли
  const visualDuplicates = Array.from(imageHashes.entries())
    .filter(([_, products]) => products.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log('📊 СТАТИСТИКА ВИЗУАЛЬНЫХ ДУБЛЕЙ:\n');
  console.log(`Всего уникальных изображений (по содержимому): ${imageHashes.size}`);
  console.log(`Найдено визуальных дублей: ${visualDuplicates.length}`);
  console.log(`Товаров с визуальными дублями: ${visualDuplicates.reduce((sum, [_, products]) => sum + products.length, 0)}\n`);

  if (visualDuplicates.length === 0) {
    console.log('✅ Визуальных дублей не найдено!');
    console.log('\nВсе изображения уникальны по содержимому.');
    return;
  }

  console.log('🔴 НАЙДЕННЫЕ ВИЗУАЛЬНЫЕ ДУБЛИ:\n');
  console.log('=' .repeat(80));

  visualDuplicates.forEach(([hash, products], index) => {
    console.log(`\n${index + 1}. Изображение повторяется ${products.length} раз (Hash: ${hash.substring(0, 16)}...):`);

    products.forEach((product, i) => {
      const categoryName = categoriesMap.get(product.category_id) || 'Без категории';
      console.log(`   ${i + 1}) ${product.name} (${categoryName})`);
      console.log(`      ID: ${product.id}`);
      console.log(`      URL: ${product.images[0].substring(0, 60)}...`);
    });

    if (index < visualDuplicates.length - 1) {
      console.log('\n' + '-'.repeat(80));
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 РЕЗУЛЬТАТ:\n');
  console.log(`Найдено ${visualDuplicates.length} визуальных дублей`);
  console.log(`Затронуто товаров: ${visualDuplicates.reduce((sum, [_, products]) => sum + products.length, 0)}`);

  if (visualDuplicates.length > 0) {
    console.log('\n⚠️  Обнаружены изображения с разными URL, но одинаковым содержимым!');
    console.log('Для замены визуальных дублей запустите:');
    console.log('npx tsx scripts/replace-visual-duplicates.ts');
  }

  // Сохраняем результаты для следующего скрипта
  const resultsPath = path.join(TEMP_DIR, 'visual-duplicates.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    duplicates: visualDuplicates.map(([hash, products]) => ({
      hash,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        imageUrl: p.images[0]
      }))
    }))
  }, null, 2));

  console.log(`\n💾 Результаты сохранены в: ${resultsPath}`);
}

findVisualDuplicates().catch(console.error);
