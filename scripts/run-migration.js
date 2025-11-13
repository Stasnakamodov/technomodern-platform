#!/usr/bin/env node

/**
 * Выполнение SQL миграции в Supabase
 * Использует Management API напрямую
 */

const fs = require('fs');
const path = require('path');

// Конфигурация
const PROJECT_REF = 'rbngpxwamfkunktxjtqh';
const ACCESS_TOKEN = 'sbp_b63e1b185382740c571003890d70a0ae2b86e75d';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// Читаем SQL файл
const sqlFilePath = path.join(__dirname, '../supabase/migrations/001_create_catalog_tables.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

console.log('🚀 Выполнение миграции в Supabase...');
console.log(`📁 Файл: ${sqlFilePath}`);
console.log(`🔗 Project: ${PROJECT_REF}`);
console.log('');

// Выполняем SQL через REST API
async function runMigration() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ACCESS_TOKEN,
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    console.log('✅ Миграция выполнена успешно!');
    console.log('📊 Результат:', result);

  } catch (error) {
    console.error('❌ Ошибка выполнения миграции:');
    console.error(error.message);
    process.exit(1);
  }
}

runMigration();
