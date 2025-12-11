#!/usr/bin/env python3
"""
Применение миграции orders через Supabase REST API
"""
import urllib.request
import json

# Читаем SQL файл
with open('supabase/migrations/004_create_orders_table.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Supabase credentials
PROJECT_URL = "https://rbngpxwamfkunktxjtqh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek"

print("🚀 Применение миграции orders...")
print(f"📄 SQL длина: {len(sql_content)} символов")

# Используем Management API для выполнения SQL
url = f"{PROJECT_URL}/rest/v1/rpc/exec_sql"

# Подготовка запроса
headers = {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': f'Bearer {SERVICE_ROLE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

data = json.dumps({
    'query': sql_content
}).encode('utf-8')

try:
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as response:
        result = response.read().decode('utf-8')
        print("✅ Миграция успешно применена!")
        print(f"📊 Ответ: {result}")
except urllib.error.HTTPError as e:
    error_body = e.read().decode('utf-8')
    print(f"❌ HTTP ошибка {e.code}: {error_body}")

    # Попробуем альтернативный метод - прямой SQL через PostgREST
    print("\n🔄 Пробуем альтернативный метод...")

    # Разделяем SQL на отдельные команды и выполняем через API
    # Для простоты используем curl
    import subprocess

    # Сохраняем SQL во временный файл
    with open('/tmp/migration.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)

    print("Используем curl для SQL запроса...")
    exit(1)
except Exception as e:
    print(f"❌ Ошибка: {e}")
    exit(1)

# Проверяем что таблица создана
print("\n🔍 Проверяем таблицу orders...")
check_url = f"{PROJECT_URL}/rest/v1/orders?select=count"
req = urllib.request.Request(check_url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        result = response.read().decode('utf-8')
        print(f"✅ Таблица orders существует!")
        print(f"📊 Результат: {result}")
except Exception as e:
    print(f"⚠️ Не удалось проверить таблицу: {e}")

print("\n✨ Готово!")
