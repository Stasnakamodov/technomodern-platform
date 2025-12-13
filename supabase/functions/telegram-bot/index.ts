import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: PhotoSize[];
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

// Environment variables
const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SECRET_TOKEN = Deno.env.get("TELEGRAM_SECRET_TOKEN") || "cba2693f7de3458e9177baf20ba9680c";

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Telegram API helper with retry handling
async function sendMessage(
  chatId: number,
  text: string,
  options: {
    parse_mode?: string;
    reply_markup?: object;
  } = {},
  retryCount = 0
): Promise<any> {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parse_mode || "HTML",
        reply_markup: options.reply_markup,
      }),
    }
  );
  const result = await response.json();

  if (!result.ok) {
    console.error("Telegram API error (sendMessage):", result);

    // Handle flood limits
    if (result.parameters?.retry_after && retryCount < 3) {
      const delay = result.parameters.retry_after * 1000;
      console.log(`Rate limited. Retrying after ${result.parameters.retry_after}s...`);
      await new Promise(r => setTimeout(r, delay));
      return sendMessage(chatId, text, options, retryCount + 1);
    }
  }

  return result;
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    }
  );
  return response.json();
}

async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  options: { parse_mode?: string; reply_markup?: object } = {}
) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: options.parse_mode || "HTML",
        reply_markup: options.reply_markup,
      }),
    }
  );
  return response.json();
}

// Настройка Menu Button для Mini App
async function setChatMenuButton(chatId?: number) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, // если не указан - устанавливает дефолт для всех
        menu_button: {
          type: "web_app",
          text: "🛒 Каталог",
          web_app: {
            url: "https://techno-modern.ru/telegram-app"
          }
        }
      }),
    }
  );
  return response.json();
}

// Установить Menu Button по умолчанию для бота (вызывается один раз)
async function setDefaultMenuButton() {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "🛒 Каталог",
          web_app: {
            url: "https://techno-modern.ru/telegram-app"
          }
        }
      }),
    }
  );
  const result = await response.json();
  console.log("setDefaultMenuButton result:", result);
  return result;
}

// Check if user is admin
async function isAdmin(telegramId: number): Promise<boolean> {
  const { data } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("telegram_id", telegramId)
    .eq("is_active", true)
    .single();
  return !!data;
}

// Get or create bot state
async function getState(telegramId: number) {
  const { data } = await supabase
    .from("bot_states")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();
  return data;
}

async function setState(
  telegramId: number,
  state: string,
  step?: string,
  data?: object
) {
  const existing = await getState(telegramId);
  if (existing) {
    await supabase
      .from("bot_states")
      .update({
        state,
        step,
        data,
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      })
      .eq("telegram_id", telegramId);
  } else {
    await supabase.from("bot_states").insert({
      telegram_id: telegramId,
      state,
      step,
      data,
    });
  }
}

async function clearState(telegramId: number) {
  await supabase.from("bot_states").delete().eq("telegram_id", telegramId);
}

// Command handlers
async function handleStart(message: TelegramMessage) {
  const userId = message.from.id;
  const firstName = message.from.first_name;
  const isUserAdmin = await isAdmin(userId);

  let text = `<b>Добро пожаловать, ${firstName}!</b>\n\n`;
  text += `🚀 <b>ТехноМодерн</b> — ваш надёжный партнёр по закупкам из Китая\n\n`;
  text += `Что мы делаем:\n`;
  text += `• Находим поставщиков любых товаров\n`;
  text += `• Проверяем качество и надёжность\n`;
  text += `• Организуем доставку в Россию\n\n`;
  text += `👇 <b>Выберите действие:</b>`;

  const keyboard: { text: string; callback_data?: string; url?: string; web_app?: { url: string } }[][] = [];

  // Админские кнопки
  if (isUserAdmin) {
    keyboard.push([
      { text: "📋 Заявки", callback_data: "admin_orders" },
      { text: "📊 Статистика", callback_data: "admin_stats" },
    ]);
  }

  // Основные кнопки для клиентов
  keyboard.push([
    { text: "🔍 Найти поставщика", callback_data: "find_supplier" },
  ]);
  keyboard.push([
    { text: "💬 Связаться с нами", callback_data: "contact_form" },
  ]);
  keyboard.push([
    { text: "🌐 Перейти на сайт", url: "https://techno-modern.ru" },
  ]);

  await sendMessage(message.chat.id, text, {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleHelp(message: TelegramMessage) {
  const userId = message.from.id;
  const isUserAdmin = await isAdmin(userId);

  let text = `<b>📖 Как пользоваться ботом:</b>\n\n`;
  text += `<b>🔍 Найти поставщика</b>\n`;
  text += `Опишите товар, который ищете. Можно:\n`;
  text += `• Написать название товара\n`;
  text += `• Отправить ссылку с маркетплейса\n`;
  text += `• Прикрепить фото товара\n\n`;
  text += `<b>💬 Связаться с нами</b>\n`;
  text += `Напишите любой вопрос — мы ответим!\n\n`;
  text += `<b>Команды:</b>\n`;
  text += `/start - Главное меню\n`;
  text += `/help - Эта справка\n`;

  if (isUserAdmin) {
    text += `\n<b>Админ-команды:</b>\n`;
    text += `/orders - Список заявок\n`;
    text += `/stats - Статистика\n`;
    text += `/setmenu - Настроить Menu Button\n`;
  }

  await sendMessage(message.chat.id, text);
}

async function handleOrders(message: TelegramMessage) {
  const userId = message.from.id;
  await handleOrdersForUser(message, userId);
}

// Версия для callback-кнопок (с явным userId)
async function handleOrdersForUser(message: TelegramMessage, userId: number) {
  const isUserAdmin = await isAdmin(userId);

  if (!isUserAdmin) {
    await sendMessage(message.chat.id, "У вас нет доступа к этой команде.");
    return;
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(10);

  if (!orders || orders.length === 0) {
    await sendMessage(message.chat.id, "Нет новых заявок.");
    return;
  }

  let text = `<b>📋 Новые заявки (${orders.length})</b>\n\n`;

  for (const order of orders) {
    text += `<b>#${order.id.slice(0, 8)}</b> - ${order.customer_name}\n`;
    text += `📞 ${order.customer_phone}\n`;
    if (order.product_name) {
      text += `📦 ${order.product_name}\n`;
    }
    text += `\n`;
  }

  const keyboard = orders.slice(0, 5).map((order) => [
    {
      text: `📋 ${order.id.slice(0, 8)}`,
      callback_data: `order_${order.id}`,
    },
  ]);

  await sendMessage(message.chat.id, text, {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleStats(message: TelegramMessage) {
  const userId = message.from.id;
  await handleStatsForUser(message, userId);
}

// Версия для callback-кнопок (с явным userId)
async function handleStatsForUser(message: TelegramMessage, userId: number) {
  const isUserAdmin = await isAdmin(userId);

  if (!isUserAdmin) {
    await sendMessage(message.chat.id, "У вас нет доступа к этой команде.");
    return;
  }

  // Get stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: newOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: todayOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  let text = `<b>📊 Статистика</b>\n\n`;
  text += `📦 Всего заявок: ${totalOrders || 0}\n`;
  text += `🆕 Новых: ${newOrders || 0}\n`;
  text += `📅 Сегодня: ${todayOrders || 0}\n`;

  await sendMessage(message.chat.id, text);
}

// Админская команда для настройки Menu Button
async function handleSetMenu(message: TelegramMessage) {
  const userId = message.from.id;
  const isUserAdmin = await isAdmin(userId);

  if (!isUserAdmin) {
    await sendMessage(message.chat.id, "У вас нет доступа к этой команде.");
    return;
  }

  const result = await setDefaultMenuButton();

  if (result.ok) {
    await sendMessage(message.chat.id,
      "✅ <b>Menu Button установлен!</b>\n\n" +
      "Теперь у всех пользователей бота слева внизу появится кнопка «🛒 Каталог» для входа в Mini App.\n\n" +
      "URL: https://techno-modern.ru/telegram-app"
    );
  } else {
    await sendMessage(message.chat.id,
      `❌ Ошибка установки Menu Button:\n\n<code>${JSON.stringify(result, null, 2)}</code>`
    );
  }
}

// ===============================================
// ПОИСК ПОСТАВЩИКА - УЛУЧШЕННЫЙ ПОШАГОВЫЙ ДИАЛОГ
// ===============================================

// Типы для данных заявки
interface SupplierRequestData {
  description?: string;
  photoFileId?: string;
  hasPhoto?: boolean;
  requestType?: string; // 'text' | 'link' | 'photo'
  quantity?: string;
  budget?: string;
  urgency?: string;
}

// Варианты количества
const QUANTITY_OPTIONS = [
  { text: "1-10 шт", value: "1-10" },
  { text: "10-100 шт", value: "10-100" },
  { text: "100-1000 шт", value: "100-1000" },
  { text: "1000+ шт", value: "1000+" },
];

// Варианты бюджета
const BUDGET_OPTIONS = [
  { text: "до 1 000 ₽", value: "до 1000" },
  { text: "1-5 тыс ₽", value: "1000-5000" },
  { text: "5-20 тыс ₽", value: "5000-20000" },
  { text: "20+ тыс ₽", value: "20000+" },
];

// Варианты срочности
const URGENCY_OPTIONS = [
  { text: "🔥 Срочно (1-3 дня)", value: "urgent" },
  { text: "📅 Неделя", value: "week" },
  { text: "📆 Месяц", value: "month" },
  { text: "🕐 Не важно", value: "any" },
];

// Обработчик "Найти поставщика" - главная функция бота
async function handleFindSupplier(message: TelegramMessage) {
  await setState(message.from.id, "find_supplier", "description", {});

  const text = `<b>🔍 Поиск поставщика</b>\n\n` +
    `Опишите товар, который хотите найти:\n\n` +
    `📝 <i>Например: "iPhone 15 Pro Max 256GB" или "Кроссовки Nike Air Max 90"</i>\n\n` +
    `💡 <b>Совет:</b> Чем подробнее опишете — тем точнее найдём!\n\n` +
    `Также можете:\n` +
    `• 📎 Прикрепить фото товара\n` +
    `• 🔗 Отправить ссылку с маркетплейса`;

  await sendMessage(message.chat.id, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ Отмена", callback_data: "cancel_request" }],
        [{ text: "« Главное меню", callback_data: "main_menu" }]
      ],
    },
  });
}

// ШАГ 2: Спрашиваем количество
async function askQuantity(chatId: number) {
  const text = `<b>📦 Какое количество вам нужно?</b>\n\n` +
    `Выберите примерный объём или введите точное число:`;

  const keyboard = [
    QUANTITY_OPTIONS.slice(0, 2).map(opt => ({ text: opt.text, callback_data: `qty_${opt.value}` })),
    QUANTITY_OPTIONS.slice(2, 4).map(opt => ({ text: opt.text, callback_data: `qty_${opt.value}` })),
    [{ text: "▶️ Пропустить", callback_data: "qty_skip" }],
    [{ text: "❌ Отмена", callback_data: "cancel_request" }]
  ];

  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// ШАГ 3: Спрашиваем бюджет
async function askBudget(chatId: number) {
  const text = `<b>💰 Какой у вас бюджет за единицу товара?</b>\n\n` +
    `Выберите диапазон или введите сумму:`;

  const keyboard = [
    BUDGET_OPTIONS.slice(0, 2).map(opt => ({ text: opt.text, callback_data: `budget_${opt.value}` })),
    BUDGET_OPTIONS.slice(2, 4).map(opt => ({ text: opt.text, callback_data: `budget_${opt.value}` })),
    [{ text: "▶️ Пропустить", callback_data: "budget_skip" }],
    [{ text: "❌ Отмена", callback_data: "cancel_request" }]
  ];

  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// ШАГ 4: Спрашиваем срочность
async function askUrgency(chatId: number) {
  const text = `<b>⏰ Насколько срочно нужен товар?</b>`;

  const keyboard = [
    URGENCY_OPTIONS.slice(0, 2).map(opt => ({ text: opt.text, callback_data: `urgency_${opt.value}` })),
    URGENCY_OPTIONS.slice(2, 4).map(opt => ({ text: opt.text, callback_data: `urgency_${opt.value}` })),
    [{ text: "❌ Отмена", callback_data: "cancel_request" }]
  ];

  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// ШАГ 5: Показываем подтверждение
async function showConfirmation(chatId: number, data: SupplierRequestData) {
  const urgencyLabels: Record<string, string> = {
    urgent: "🔥 Срочно (1-3 дня)",
    week: "📅 В течение недели",
    month: "📆 В течение месяца",
    any: "🕐 Не важно",
    skip: "Не указано"
  };

  let text = `<b>📋 Проверьте вашу заявку:</b>\n\n`;
  text += `<b>📦 Товар:</b>\n${data.description}\n\n`;

  if (data.hasPhoto) {
    text += `📷 <i>+ фото товара</i>\n\n`;
  }

  text += `<b>📊 Количество:</b> ${data.quantity || 'Не указано'}\n`;
  text += `<b>💰 Бюджет:</b> ${data.budget ? data.budget + ' ₽' : 'Не указан'}\n`;
  text += `<b>⏰ Срочность:</b> ${urgencyLabels[data.urgency || 'skip'] || data.urgency}\n\n`;
  text += `Всё верно? Отправляем заявку?`;

  const keyboard = [
    [
      { text: "✅ Отправить", callback_data: "confirm_supplier_request" },
      { text: "✏️ Изменить", callback_data: "find_supplier" }
    ],
    [{ text: "❌ Отмена", callback_data: "cancel_request" }]
  ];

  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// Сохранение заявки и уведомление админов
async function saveAndNotifySupplierRequest(
  userId: number,
  userName: string,
  username: string,
  chatId: number,
  data: SupplierRequestData
) {
  const urgencyLabels: Record<string, string> = {
    urgent: "🔥 Срочно",
    week: "📅 Неделя",
    month: "📆 Месяц",
    any: "🕐 Не важно"
  };

  // Формируем дополнительные данные для поля message
  const additionalInfo: string[] = [];
  if (data.quantity && data.quantity !== 'skip') additionalInfo.push(`Количество: ${data.quantity}`);
  if (data.budget && data.budget !== 'skip') additionalInfo.push(`Бюджет: ${data.budget} ₽`);
  if (data.urgency && data.urgency !== 'skip') additionalInfo.push(`Срочность: ${urgencyLabels[data.urgency] || data.urgency}`);

  const messageField = data.hasPhoto
    ? `[ФОТО] ${data.description}${additionalInfo.length ? '\n\n' + additionalInfo.join('\n') : ''}`
    : `${data.description}${additionalInfo.length ? '\n\n' + additionalInfo.join('\n') : ''}`;

  // Сохраняем заявку в БД
  const { data: newRequest, error } = await supabase
    .from("orders")
    .insert({
      customer_name: userName,
      customer_phone: username,
      product_name: data.description?.slice(0, 200) || 'Запрос на поиск',
      telegram_id: userId,
      status: "new",
      source: "telegram_supplier_search",
      message: messageField,
      quantity: data.quantity && data.quantity !== 'skip' ? parseInt(data.quantity.split('-')[0]) || 1 : null,
      target_price: data.budget && data.budget !== 'skip' ? parseInt(data.budget.replace(/\D/g, '')) || null : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating supplier request:", error);
    await sendMessage(chatId,
      "❌ Произошла ошибка. Попробуйте позже или напишите нам напрямую @technomodern_support");
    return null;
  }

  // Подтверждение пользователю
  await sendMessage(chatId,
    `✅ <b>Заявка принята!</b>\n\n` +
    `📋 Номер: #${newRequest.id.slice(0, 8)}\n\n` +
    `Мы найдём поставщика и свяжемся с вами в Telegram!\n\n` +
    `⏱ Обычно отвечаем в течение 2-4 часов.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 Новый поиск", callback_data: "find_supplier" }],
          [{ text: "« Главное меню", callback_data: "main_menu" }]
        ]
      }
    }
  );

  // Уведомление админам
  let adminText = `🔔 <b>Новый запрос на поиск!</b>\n\n`;
  adminText += `👤 ${userName} (${username})\n`;
  adminText += `🆔 Telegram ID: ${userId}\n`;
  adminText += `📝 Тип: ${data.requestType || 'текст'}\n\n`;
  adminText += `<b>📦 Товар:</b>\n${data.description}\n\n`;

  if (data.quantity && data.quantity !== 'skip') {
    adminText += `<b>📊 Количество:</b> ${data.quantity}\n`;
  }
  if (data.budget && data.budget !== 'skip') {
    adminText += `<b>💰 Бюджет:</b> ${data.budget} ₽\n`;
  }
  if (data.urgency && data.urgency !== 'skip') {
    adminText += `<b>⏰ Срочность:</b> ${urgencyLabels[data.urgency] || data.urgency}\n`;
  }

  adminText += `\n#${newRequest.id.slice(0, 8)}`;

  if (data.hasPhoto && data.photoFileId) {
    await forwardPhotoToAdmins(data.photoFileId, adminText);
  } else {
    const { data: admins } = await supabase
      .from("admin_users")
      .select("telegram_id")
      .eq("is_active", true);

    if (admins) {
      for (const admin of admins) {
        await sendMessage(admin.telegram_id, adminText);
      }
    }
  }

  return newRequest;
}

// Обработчик "Связаться с нами" - простая форма обратной связи
async function handleContactForm(message: TelegramMessage) {
  await setState(message.from.id, "contact_form", "message", {});

  const text = `<b>💬 Связаться с нами</b>\n\n`;
  const fullText = text +
    `Напишите ваш вопрос или сообщение.\n\n` +
    `Можете прикрепить фото, если нужно что-то показать.\n\n` +
    `Мы ответим в ближайшее время! ⚡`;

  await sendMessage(message.chat.id, fullText, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ Отмена", callback_data: "cancel_request" }],
        [{ text: "« Главное меню", callback_data: "main_menu" }]
      ],
    },
  });
}

// Устаревший обработчик - перенаправляем на новый
async function handleNewOrder(message: TelegramMessage) {
  await handleFindSupplier(message);
}

// Callback query handler
async function handleCallbackQuery(callbackQuery: CallbackQuery) {
  const { id, from, message, data } = callbackQuery;

  if (!data || !message) {
    await answerCallbackQuery(id);
    return;
  }

  await answerCallbackQuery(id);

  // === ОСНОВНЫЕ КНОПКИ ===
  if (data === "find_supplier") {
    await handleFindSupplier(message);
  } else if (data === "contact_form") {
    await handleContactForm(message);
  } else if (data === "main_menu") {
    await clearState(from.id);
    await handleStart(message);
  } else if (data === "cancel_request") {
    await clearState(from.id);
    await sendMessage(message.chat.id, "✅ Запрос отменён.\n\nНажмите /start чтобы вернуться в главное меню.");

  // === ПОШАГОВЫЙ ДИАЛОГ: КОЛИЧЕСТВО ===
  } else if (data.startsWith("qty_")) {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier") {
      const stateData = state.data || {};
      const quantity = data.replace("qty_", "");
      stateData.quantity = quantity === "skip" ? undefined : quantity;
      await setState(from.id, "find_supplier", "budget", stateData);
      await askBudget(message.chat.id);
    }

  // === ПОШАГОВЫЙ ДИАЛОГ: БЮДЖЕТ ===
  } else if (data.startsWith("budget_")) {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier") {
      const stateData = state.data || {};
      const budget = data.replace("budget_", "");
      stateData.budget = budget === "skip" ? undefined : budget;
      await setState(from.id, "find_supplier", "urgency", stateData);
      await askUrgency(message.chat.id);
    }

  // === ПОШАГОВЫЙ ДИАЛОГ: СРОЧНОСТЬ ===
  } else if (data.startsWith("urgency_")) {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier") {
      const stateData = state.data || {};
      const urgency = data.replace("urgency_", "");
      stateData.urgency = urgency;
      await setState(from.id, "find_supplier", "confirm", stateData);
      await showConfirmation(message.chat.id, stateData as SupplierRequestData);
    }

  // === БЫСТРАЯ ОТПРАВКА ФОТО ===
  } else if (data === "quick_send") {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier" && state.data) {
      const stateData = state.data as SupplierRequestData;
      const userName = from.first_name + (from.last_name ? ` ${from.last_name}` : '');
      const username = from.username ? `@${from.username}` : 'нет username';
      await saveAndNotifySupplierRequest(from.id, userName, username, message.chat.id, stateData);
      await clearState(from.id);
    }

  // === РЕЖИМ УТОЧНЕНИЯ ДЕТАЛЕЙ ===
  } else if (data === "details_mode") {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier") {
      await setState(from.id, "find_supplier", "quantity", state.data || {});
      await askQuantity(message.chat.id);
    }

  // === ПОДТВЕРЖДЕНИЕ ЗАЯВКИ ===
  } else if (data === "confirm_supplier_request") {
    const state = await getState(from.id);
    if (state && state.state === "find_supplier" && state.data) {
      const stateData = state.data as SupplierRequestData;
      const userName = from.first_name + (from.last_name ? ` ${from.last_name}` : '');
      const username = from.username ? `@${from.username}` : 'нет username';
      await saveAndNotifySupplierRequest(from.id, userName, username, message.chat.id, stateData);
      await clearState(from.id);
    }

  // === АДМИНСКИЕ КНОПКИ ===
  } else if (data === "admin_orders") {
    await handleOrdersForUser(message, from.id);
  } else if (data === "admin_stats") {
    await handleStatsForUser(message, from.id);

  // === УСТАРЕВШИЕ (для совместимости) ===
  } else if (data === "new_order") {
    await handleFindSupplier(message);
  } else if (data === "cancel_order") {
    await clearState(from.id);
    await sendMessage(message.chat.id, "Заявка отменена.");
  } else if (data === "contact") {
    await handleContactForm(message);

  // === ОБРАБОТКА ЗАЯВОК ===
  } else if (data.startsWith("order_")) {
    const orderId = data.replace("order_", "");
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (order) {
      let text = `<b>📋 Заявка #${order.id.slice(0, 8)}</b>\n\n`;
      text += `👤 ${order.customer_name}\n`;
      text += `📞 ${order.customer_phone}\n`;
      if (order.customer_email) text += `📧 ${order.customer_email}\n`;
      if (order.product_name) text += `📦 ${order.product_name}\n`;
      if (order.message) text += `💬 ${order.message}\n`;
      text += `\n📅 ${new Date(order.created_at).toLocaleString("ru-RU")}`;

      const keyboard = [
        [
          { text: "✅ Принять", callback_data: `accept_${orderId}` },
          { text: "❌ Отклонить", callback_data: `reject_${orderId}` },
        ],
        [{ text: "« Назад", callback_data: "admin_orders" }],
      ];

      await editMessageText(message.chat.id, message.message_id, text, {
        reply_markup: { inline_keyboard: keyboard },
      });
    }
  } else if (data.startsWith("accept_")) {
    const orderId = data.replace("accept_", "");
    await supabase
      .from("orders")
      .update({ status: "processing" })
      .eq("id", orderId);
    await sendMessage(message.chat.id, `✅ Заявка #${orderId.slice(0, 8)} принята в работу.`);
  } else if (data.startsWith("reject_")) {
    const orderId = data.replace("reject_", "");
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);
    await sendMessage(message.chat.id, `❌ Заявка #${orderId.slice(0, 8)} отклонена.`);
  } else if (data === "submit_order" || data === "submit_supplier_request") {
    // CRITICAL: Сохранение заявки в базу данных
    const state = await getState(from.id);
    if (state && state.data) {
      const orderData = state.data;

      // Валидация
      if (!orderData.name || !orderData.phone || !orderData.product) {
        await sendMessage(message.chat.id, "Ошибка: данные заявки неполные. Попробуйте снова /order");
        await clearState(from.id);
        return;
      }

      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({
          customer_name: orderData.name,
          customer_phone: orderData.phone,
          product_name: orderData.product,
          telegram_id: from.id,
          status: "new",
          source: "telegram_bot"
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating order:", error);
        await sendMessage(message.chat.id,
          "Произошла ошибка при создании заявки. Попробуйте позже или свяжитесь с нами напрямую.");
      } else {
        await sendMessage(message.chat.id,
          `✅ <b>Заявка создана!</b>\n\n` +
          `Номер: #${newOrder.id.slice(0, 8)}\n\n` +
          `Мы свяжемся с вами в ближайшее время по телефону ${orderData.phone}`);

        // Уведомление админам о новой заявке
        const { data: admins } = await supabase
          .from("admin_users")
          .select("telegram_id")
          .eq("is_active", true);

        if (admins) {
          const adminText = `🔔 <b>Новая заявка!</b>\n\n` +
            `👤 ${orderData.name}\n` +
            `📞 ${orderData.phone}\n` +
            `📦 ${orderData.product}\n\n` +
            `ID: #${newOrder.id.slice(0, 8)}`;

          for (const admin of admins) {
            if (admin.telegram_id !== from.id) {
              await sendMessage(admin.telegram_id, adminText);
            }
          }
        }
      }

      await clearState(from.id);
    } else {
      await sendMessage(message.chat.id, "Ошибка состояния. Попробуйте создать заявку снова: /order");
    }
  } else if (data === "admin_add_product") {
    // Заглушка для добавления товара
    await sendMessage(message.chat.id,
      "Функция добавления товара пока недоступна.\n\n" +
      "Используйте админ-панель на сайте для управления каталогом.");
  }
}

// Функция пересылки фото админам
async function forwardPhotoToAdmins(
  fileId: string,
  caption: string,
  excludeTelegramId?: number
) {
  const { data: admins } = await supabase
    .from("admin_users")
    .select("telegram_id")
    .eq("is_active", true);

  if (!admins) return;

  for (const admin of admins) {
    if (admin.telegram_id !== excludeTelegramId) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: admin.telegram_id,
          photo: fileId,
          caption,
          parse_mode: "HTML",
        }),
      });
    }
  }
}

// Message handler for multi-step dialogs
async function handleMessage(message: TelegramMessage) {
  const state = await getState(message.from.id);
  const userId = message.from.id;
  const userName = message.from.first_name + (message.from.last_name ? ` ${message.from.last_name}` : '');
  const username = message.from.username ? `@${message.from.username}` : 'нет username';

  // === СОСТОЯНИЕ: Поиск поставщика (УЛУЧШЕННЫЙ ПОШАГОВЫЙ ДИАЛОГ) ===
  if (state && state.state === "find_supplier") {
    const stateData = (state.data || {}) as SupplierRequestData;

    // ШАГ 1: Получили описание товара (текст, ссылка или фото)
    if (state.step === "description") {
      let productDescription = message.text || '';
      let hasPhoto = false;
      let photoFileId = '';

      // Проверяем наличие фото
      if (message.photo && message.photo.length > 0) {
        hasPhoto = true;
        photoFileId = message.photo[message.photo.length - 1].file_id;
        productDescription = message.text || '(фото без описания)';
      }

      if (!productDescription && !hasPhoto) {
        await sendMessage(message.chat.id, "Пожалуйста, опишите товар или отправьте фото:");
        return;
      }

      // Определяем тип запроса
      let requestType = 'текст';
      if (hasPhoto) requestType = 'фото';
      else if (productDescription.includes('http')) requestType = 'ссылка';

      // Сохраняем данные в состояние
      stateData.description = productDescription;
      stateData.hasPhoto = hasPhoto;
      stateData.photoFileId = photoFileId;
      stateData.requestType = requestType;

      // Если фото - предлагаем выбор: быстрая отправка или уточнение деталей
      if (hasPhoto) {
        await setState(userId, "find_supplier", "photo_choice", stateData);

        const text = `📷 <b>Фото получено!</b>\n\n` +
          `${productDescription !== '(фото без описания)' ? `📝 ${productDescription}\n\n` : ''}` +
          `Как хотите продолжить?`;

        await sendMessage(message.chat.id, text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⚡ Отправить сразу", callback_data: "quick_send" }],
              [{ text: "📝 Уточнить детали", callback_data: "details_mode" }],
              [{ text: "❌ Отмена", callback_data: "cancel_request" }]
            ]
          }
        });
      } else {
        // Для текста/ссылки - переходим к вопросам
        await setState(userId, "find_supplier", "quantity", stateData);
        await askQuantity(message.chat.id);
      }
      return;
    }

    // ШАГ 2: Ввод своего количества (если не нажали кнопку)
    if (state.step === "quantity") {
      const inputText = message.text?.trim();
      if (inputText) {
        // Проверяем, что это число
        const num = parseInt(inputText.replace(/\D/g, ''));
        if (num > 0) {
          stateData.quantity = num.toString();
        } else {
          stateData.quantity = inputText; // Сохраняем как есть
        }
        await setState(userId, "find_supplier", "budget", stateData);
        await askBudget(message.chat.id);
      }
      return;
    }

    // ШАГ 3: Ввод своего бюджета (если не нажали кнопку)
    if (state.step === "budget") {
      const inputText = message.text?.trim();
      if (inputText) {
        const num = parseInt(inputText.replace(/\D/g, ''));
        if (num > 0) {
          stateData.budget = num.toString();
        } else {
          stateData.budget = inputText;
        }
        await setState(userId, "find_supplier", "urgency", stateData);
        await askUrgency(message.chat.id);
      }
      return;
    }

    // Остальные шаги обрабатываются через callback-кнопки
  }

  // === СОСТОЯНИЕ: Связаться с нами ===
  if (state && state.state === "contact_form") {
    let userMessage = message.text || '';
    let hasPhoto = false;
    let photoFileId = '';

    // Проверяем наличие фото
    if (message.photo && message.photo.length > 0) {
      hasPhoto = true;
      photoFileId = message.photo[message.photo.length - 1].file_id;
      userMessage = message.text || '(фото без сообщения)';
    }

    if (!userMessage && !hasPhoto) {
      await sendMessage(message.chat.id, "Пожалуйста, напишите сообщение или отправьте фото:");
      return;
    }

    // Сохраняем обращение
    const { data: newContact, error } = await supabase
      .from("orders")
      .insert({
        customer_name: userName,
        customer_phone: username,
        product_name: "Обращение в поддержку",
        telegram_id: userId,
        status: "new",
        source: "telegram_contact",
        message: hasPhoto ? `[ФОТО] ${userMessage}` : userMessage
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating contact:", error);
      await sendMessage(message.chat.id,
        "❌ Произошла ошибка. Напишите напрямую @technomodern_support");
    } else {
      await sendMessage(message.chat.id,
        `✅ <b>Сообщение отправлено!</b>\n\n` +
        `Мы ответим вам в ближайшее время.\n\n` +
        `📋 Номер обращения: #${newContact.id.slice(0, 8)}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "« Главное меню", callback_data: "main_menu" }]
            ]
          }
        }
      );

      // Уведомление админам
      const adminText = `💬 <b>Новое обращение!</b>\n\n` +
        `👤 ${userName} (${username})\n` +
        `🆔 Telegram ID: ${userId}\n\n` +
        `<b>Сообщение:</b>\n${userMessage}\n\n` +
        `#${newContact.id.slice(0, 8)}`;

      if (hasPhoto) {
        await forwardPhotoToAdmins(photoFileId, adminText);
      } else {
        const { data: admins } = await supabase
          .from("admin_users")
          .select("telegram_id")
          .eq("is_active", true);

        if (admins) {
          for (const admin of admins) {
            await sendMessage(admin.telegram_id, adminText);
          }
        }
      }
    }

    await clearState(userId);
    return;
  }

  // === СОСТОЯНИЕ: Старая форма заказа (для совместимости) ===
  if (state && state.state === "creating_order") {
    const data = state.data || {};

    if (state.step === "name") {
      if (!message.text || message.text.trim().length === 0) {
        await sendMessage(message.chat.id, "Пожалуйста, введите ваше имя:");
        return;
      }
      data.name = message.text.trim();
      await setState(message.from.id, "creating_order", "phone", data);
      await sendMessage(message.chat.id, "Введите номер телефона:");
    } else if (state.step === "phone") {
      const phone = message.text?.replace(/\D/g, '') || '';
      if (phone.length < 10 || phone.length > 12) {
        await sendMessage(message.chat.id,
          "Пожалуйста, введите корректный номер телефона (10-12 цифр):");
        return;
      }
      data.phone = message.text;
      await setState(message.from.id, "creating_order", "product", data);
      await sendMessage(message.chat.id, "Что хотите заказать? (название или ссылка)");
    } else if (state.step === "product") {
      data.product = message.text;
      await setState(message.from.id, "creating_order", "confirm", data);

      let text = `<b>Подтвердите заявку:</b>\n\n`;
      text += `👤 Имя: ${data.name}\n`;
      text += `📞 Телефон: ${data.phone}\n`;
      text += `📦 Товар: ${data.product}\n`;

      await sendMessage(message.chat.id, text, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Отправить", callback_data: "submit_order" },
              { text: "❌ Отмена", callback_data: "cancel_order" },
            ],
          ],
        },
      });
    }
    return;
  }

  // === Сообщение без состояния ===
  // Показываем подсказку
  await sendMessage(
    message.chat.id,
    "👋 Используйте кнопки меню или команду /start\n\n" +
    "Или просто опишите, какой товар ищете — мы поможем найти поставщика!",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 Найти поставщика", callback_data: "find_supplier" }],
          [{ text: "💬 Связаться с нами", callback_data: "contact_form" }],
          [{ text: "« Главное меню", callback_data: "main_menu" }]
        ]
      }
    }
  );
}

// Main handler
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("OK", { status: 200 });
  }

  // Verify Secret Token
  const secretHeader = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (secretHeader !== SECRET_TOKEN) {
    console.error("Invalid secret token:", secretHeader);
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const update: TelegramUpdate = await req.json();

    // Handle callback queries
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return new Response("OK", { status: 200 });
    }

    // Handle messages
    if (update.message) {
      const message = update.message;
      const text = message.text || "";

      // Handle commands
      if (text.startsWith("/start")) {
        await handleStart(message);
      } else if (text.startsWith("/help")) {
        await handleHelp(message);
      } else if (text.startsWith("/orders")) {
        await handleOrders(message);
      } else if (text.startsWith("/stats")) {
        await handleStats(message);
      } else if (text.startsWith("/setmenu")) {
        await handleSetMenu(message);
      } else if (text.startsWith("/order")) {
        await handleNewOrder(message);
      } else {
        // Handle regular messages (for multi-step dialogs)
        await handleMessage(message);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing update:", error);
    return new Response("Error", { status: 500 });
  }
});
