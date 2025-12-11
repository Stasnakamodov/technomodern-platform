#!/bin/bash

SUPABASE_URL="https://rbngpxwamfkunktxjtqh.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI"

echo "=== НАЧАЛО ИСПРАВЛЕНИЙ ==="
echo ""

# Счётчики
MOVED=0
DELETED=0

# 1. Перенос товаров
echo "Шаг 1: Перенос товаров в правильные категории..."
echo ""

while IFS= read -r line; do
  PRODUCT_ID=$(echo "$line" | jq -r '.id')
  PRODUCT_NAME=$(echo "$line" | jq -r '.name')
  NEW_CATEGORY=$(echo "$line" | jq -r '.to')
  REASON=$(echo "$line" | jq -r '.reason')

  if [ "$PRODUCT_ID" != "null" ]; then
    echo "→ Перенос: $PRODUCT_NAME"
    echo "  Причина: $REASON"

    curl -s -X PATCH "$SUPABASE_URL/rest/v1/products?id=eq.$PRODUCT_ID" \
      -H "apikey: $SUPABASE_KEY" \
      -H "Authorization: Bearer $SUPABASE_KEY" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=minimal" \
      -d "{\"category_id\": \"$NEW_CATEGORY\"}" > /dev/null

    if [ $? -eq 0 ]; then
      ((MOVED++))
      echo "  ✓ Успешно"
    else
      echo "  ✗ Ошибка"
    fi
    echo ""
  fi
done < <(jq -c '.[]' /tmp/auto_moves.json)

echo "Перенесено товаров: $MOVED"
echo ""

# 2. Удаление дубликатов
echo "Шаг 2: Удаление дубликатов..."
echo ""

while IFS= read -r line; do
  DUPLICATE_ID=$(echo "$line" | jq -r '.duplicate.id')
  PRODUCT_NAME=$(echo "$line" | jq -r '.duplicate.name')

  if [ "$DUPLICATE_ID" != "null" ]; then
    echo "→ Удаление дубликата: $PRODUCT_NAME"

    curl -s -X PATCH "$SUPABASE_URL/rest/v1/products?id=eq.$DUPLICATE_ID" \
      -H "apikey: $SUPABASE_KEY" \
      -H "Authorization: Bearer $SUPABASE_KEY" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=minimal" \
      -d '{"deleted_at": "2025-12-11T14:40:00Z", "in_stock": false}' > /dev/null

    if [ $? -eq 0 ]; then
      ((DELETED++))
      echo "  ✓ Успешно"
    else
      echo "  ✗ Ошибка"
    fi
    echo ""
  fi
done < <(jq -c '.[]' /tmp/auto_duplicates.json)

echo "Удалено дубликатов: $DELETED"
echo ""

# 3. Обновление счётчиков категорий
echo "Шаг 3: Обновление счётчиков категорий..."
echo ""

# Функция для обновления счётчика
update_counter() {
  local CATEGORY_ID=$1
  local CATEGORY_NAME=$2

  # Считаем товары
  local COUNT=$(curl -s -X GET "$SUPABASE_URL/rest/v1/products?select=id&category_id=eq.$CATEGORY_ID&deleted_at=is.null" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" | jq '. | length')

  echo "→ $CATEGORY_NAME: $COUNT товаров"

  # Обновляем счётчик
  curl -s -X PATCH "$SUPABASE_URL/rest/v1/categories?id=eq.$CATEGORY_ID" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{\"product_count\": $COUNT}" > /dev/null

  echo "  ✓ Обновлено"
  echo ""
}

# Обновляем все задействованные категории
update_counter "e18eb782-6fca-414a-b221-dadc694461b1" "Автотовары (root)"
update_counter "b045d61a-56a4-4c75-9e11-a2d600df97f1" "Автозапчасти"
update_counter "1f2645f7-6bc1-4df1-97df-959c3f23cacb" "Автохимия"
update_counter "6b178b91-cb95-4ec2-b76b-dab5861bf250" "Шины и диски"
update_counter "761a23b9-9a65-49ec-922d-8db58b9fcce9" "Инструменты"
update_counter "4e53a812-6edb-482f-8ea1-b9150215c169" "Хозяйственные товары"
update_counter "52b329e8-5fbf-4e77-83a2-62d55e5671d6" "Электроника общего назначения"

echo ""
echo "=== ИТОГОВЫЙ ОТЧЁТ ==="
echo ""
echo "Перенесено товаров: $MOVED"
echo "Удалено дубликатов: $DELETED"
echo ""
echo "Новые счётчики категорий обновлены!"
echo ""
echo "=== ГОТОВО ==="
