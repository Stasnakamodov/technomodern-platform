#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Конфигурация из .env.local
const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Создаем клиент Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 Выполнение миграции в Supabase...\n');

// Читаем SQL файл
const sqlPath = join(__dirname, '../supabase/migrations/001_create_catalog_tables.sql');
const sql = readFileSync(sqlPath, 'utf8');

// Разбиваем на отдельные команды (по точке с запятой)
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

console.log(`📝 Найдено ${commands.length} SQL команд\n`);

// Выполняем каждую команду через RPC
async function runMigration() {
  try {
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      console.log(`[${i + 1}/${commands.length}] Выполнение команды...`);

      // Показываем первые 80 символов команды
      const preview = cmd.substring(0, 80).replace(/\n/g, ' ');
      console.log(`   ${preview}${cmd.length > 80 ? '...' : ''}`);

      const { data, error } = await supabase.rpc('exec_sql', {
        sql: cmd + ';'
      });

      if (error) {
        console.error(`\n❌ Ошибка в команде ${i + 1}:`);
        console.error(error);
        console.error(`\nSQL:\n${cmd}\n`);
        process.exit(1);
      }

      console.log(`   ✅ Успешно\n`);
    }

    console.log('\n🎉 Все таблицы созданы успешно!');
    console.log('\n📊 Созданные таблицы:');
    console.log('   - suppliers (поставщики)');
    console.log('   - categories (3-уровневые категории)');
    console.log('   - products (товары)');
    console.log('   - project_carts (корзины)');

  } catch (error) {
    console.error('\n❌ Непредвиденная ошибка:');
    console.error(error);
    process.exit(1);
  }
}

runMigration();
