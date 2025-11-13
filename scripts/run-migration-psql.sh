#!/bin/bash

# Выполнение SQL миграции через psql
# Требует установленного psql

echo "🚀 Выполнение миграции в Supabase через psql..."
echo ""

# Проверка наличия psql
if ! command -v psql &> /dev/null; then
    echo "❌ psql не установлен. Установите PostgreSQL client:"
    echo "   brew install postgresql"
    exit 1
fi

# Database connection string (нужно получить из Supabase Dashboard)
echo "⚠️  Для выполнения миграции нужна Database Connection String"
echo ""
echo "Получите её здесь:"
echo "https://supabase.com/dashboard/project/rbngpxwamfkunktxjtqh/settings/database"
echo ""
echo "Скопируйте 'Connection string' и выполните:"
echo ""
echo "psql 'YOUR_CONNECTION_STRING' -f supabase/migrations/001_create_catalog_tables.sql"
echo ""
