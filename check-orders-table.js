#!/usr/bin/env node
const https = require('https');

const SUPABASE_URL = 'rbngpxwamfkunktxjtqh.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const options = {
  hostname: SUPABASE_URL,
  path: '/rest/v1/orders?select=*&limit=1',
  method: 'GET',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
  }
};

console.log('🔍 Проверяю существование таблицы orders...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      const rows = JSON.parse(data);
      console.log('✅ Таблица orders уже существует!');
      console.log(`📊 Записей в таблице: ${rows.length > 0 ? 'есть' : 'пусто'}`);
      if (rows.length > 0) {
        console.log('📝 Первая запись:', JSON.stringify(rows[0], null, 2));
      }
    } else if (res.statusCode === 404 || data.includes('does not exist')) {
      console.log('❌ Таблица orders НЕ существует');
      console.log('Нужно применить миграцию.\n');
      applyMigrationWithServiceRole();
    } else {
      console.log(`⚠️  Статус ${res.statusCode}:`, data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Ошибка:', error.message);
});

req.end();

function applyMigrationWithServiceRole() {
  console.log('🚀 Пробую создать таблицу через service role key...\n');

  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

  // SQL для создания таблицы (упрощенная версия для RPC)
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      customer_email VARCHAR(255),
      product_name VARCHAR(500),
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const rpcOptions = {
    hostname: SUPABASE_URL,
    path: '/rest/v1/rpc/exec',
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    }
  };

  const rpcReq = https.request(rpcOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`Статус: ${res.statusCode}`);
      console.log('Ответ:', data);
    });
  });

  rpcReq.write(JSON.stringify({ sql: createTableSQL }));
  rpcReq.end();
}
