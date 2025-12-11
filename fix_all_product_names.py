#!/usr/bin/env python3
"""
Скрипт для анализа и исправления названий товаров
Анализирует все 1699 товаров и генерирует исправления
"""

import json
import re

# Загружаем товары
with open('/tmp/all_products_full.json', 'r') as f:
    products = json.load(f)

print(f"Загружено {len(products)} товаров для анализа\n")

# Список проблем и исправлений
fixes = []
good_names = []

def has_problem(name):
    """Проверяет название на проблемы"""
    problems = []

    # 1. Обрезанное название (заканчивается на неполное слово)
    if len(name) >= 55 and not name.endswith(('.', ')', '"', '!', '?')):
        # Проверяем последнее слово - если оно короткое или обрезано
        last_word = name.split()[-1] if name.split() else ""
        if len(last_word) <= 4 or last_word[-1].islower():
            problems.append("обрезано")

    # 2. Смесь русского и английского (кроме известных брендов)
    known_brands = ['PUBG', 'USB', 'LED', 'LCD', 'HD', 'WiFi', 'Bluetooth', 'Type-C', 'HDMI',
                    'DPI', 'MTB', 'BB', 'SPF', 'TPMS', 'CNC', 'RGB', 'SIM', 'GPS', 'DC', 'AC',
                    'MacBook', 'iPhone', 'Samsung', 'Xiaomi', 'Redmi', 'Neutrogena', 'Walgreens',
                    'Nature Made', 'Sports Research', 'Animal Flex', 'Hello Kitty', 'Sylvanian',
                    'Pure Encapsulations', 'Geritol', 'BBS', 'Lanka', 'Haval', 'Ultra', 'Energy',
                    'Bear Barrel', 'Prada', 'Gucci', 'Chanel', 'MAC', 'MK', 'Coach', 'LV']

    english_words = re.findall(r'\b[a-zA-Z]{3,}\b', name)
    unknown_english = [w for w in english_words if w not in known_brands and not w.isupper()]
    if unknown_english and any(ord(c) > 127 for c in name):  # есть и русский и английский
        problems.append(f"английские слова: {', '.join(unknown_english[:3])}")

    # 3. Грамматические ошибки (несогласование рода/числа)
    bad_patterns = [
        r'игровая контроллер',
        r'портативное смартфон',
        r'регулируемое набор',
        r'стальная регулируемое',
        r'порошковая румяна',
        r'мраморные макияж',
        r'USB-давление',
        r'давление в шинах датчика',
    ]
    for pattern in bad_patterns:
        if re.search(pattern, name, re.IGNORECASE):
            problems.append("грамматика")
            break

    # 4. Бессмысленный машинный перевод
    nonsense_patterns = [
        r'шлифования мяса',
        r'Фурида.*Коу',
        r'Чанхэ',
        r'баганизатор',
        r'фундамента.*румяна',
        r'красота порошковая',
        r'Мобильный\+ pus',
    ]
    for pattern in nonsense_patterns:
        if re.search(pattern, name, re.IGNORECASE):
            problems.append("бессмыслица")
            break

    # 5. Повторяющиеся слова
    words = name.lower().split()
    for i in range(len(words)-1):
        if words[i] == words[i+1] and len(words[i]) > 2:
            problems.append(f"повтор: {words[i]}")
            break

    # 6. Начинается с маленькой буквы
    if name and name[0].islower():
        problems.append("строчная буква")

    # 7. Транслитерация китайских слов
    chinese_translits = ['Xinjiang', 'Qingdao', 'Guangzhou', 'Shenzhen']
    for translit in chinese_translits:
        if translit.lower() in name.lower():
            problems.append(f"транслитерация: {translit}")
            break

    return problems

def suggest_fix(name, problems):
    """Предлагает исправленное название"""
    fixed = name

    # Исправляем строчную букву
    if "строчная буква" in str(problems):
        fixed = fixed[0].upper() + fixed[1:] if fixed else fixed

    # Для обрезанных - нужно восстановить
    if "обрезано" in str(problems):
        # Убираем обрезанную часть и добавляем многоточие или восстанавливаем
        pass  # Требует ручного исправления или контекста

    return fixed

# Анализируем каждый товар
print("=" * 80)
print("АНАЛИЗ ТОВАРОВ")
print("=" * 80)

for i, product in enumerate(products, 1):
    name = product['name']
    problems = has_problem(name)

    if problems:
        fixes.append({
            'id': product['id'],
            'old_name': name,
            'problems': problems,
            'new_name': None  # Будет заполнено вручную
        })
    else:
        good_names.append(product)

print(f"\nИТОГО:")
print(f"  Хороших названий: {len(good_names)} ({len(good_names)*100//len(products)}%)")
print(f"  Требуют исправления: {len(fixes)} ({len(fixes)*100//len(products)}%)")

# Группируем по типу проблем
problem_types = {}
for fix in fixes:
    for prob in fix['problems']:
        prob_type = prob.split(':')[0].strip()
        if prob_type not in problem_types:
            problem_types[prob_type] = []
        problem_types[prob_type].append(fix)

print(f"\nПО ТИПАМ ПРОБЛЕМ:")
for prob_type, items in sorted(problem_types.items(), key=lambda x: -len(x[1])):
    print(f"  {prob_type}: {len(items)} товаров")

# Выводим все проблемные товары
print("\n" + "=" * 80)
print("СПИСОК ТОВАРОВ ДЛЯ ИСПРАВЛЕНИЯ")
print("=" * 80)

for i, fix in enumerate(fixes, 1):
    print(f"\n{i}. ID: {fix['id']}")
    print(f"   Название: {fix['old_name']}")
    print(f"   Проблемы: {', '.join(fix['problems'])}")

# Сохраняем список для исправления
with open('/tmp/products_to_fix.json', 'w') as f:
    json.dump(fixes, f, ensure_ascii=False, indent=2)

print(f"\n\nСписок сохранён в /tmp/products_to_fix.json")
