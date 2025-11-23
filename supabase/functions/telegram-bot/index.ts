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

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Telegram API helper
async function sendMessage(
  chatId: number,
  text: string,
  options: {
    parse_mode?: string;
    reply_markup?: object;
  } = {}
) {
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
  text += `Я бот ТехноМодерн - помогу вам с закупками товаров из Китая.\n\n`;

  const keyboard: { text: string; callback_data: string }[][] = [];

  if (isUserAdmin) {
    text += `<i>У вас есть права администратора</i>\n\n`;
    keyboard.push([
      { text: "📋 Заявки", callback_data: "admin_orders" },
      { text: "📊 Статистика", callback_data: "admin_stats" },
    ]);
    keyboard.push([
      { text: "➕ Добавить товар", callback_data: "admin_add_product" },
    ]);
  }

  keyboard.push([
    { text: "📦 Каталог", callback_data: "catalog" },
    { text: "📝 Оставить заявку", callback_data: "new_order" },
  ]);
  keyboard.push([{ text: "📞 Связаться с нами", callback_data: "contact" }]);

  await sendMessage(message.chat.id, text, {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleHelp(message: TelegramMessage) {
  const userId = message.from.id;
  const isUserAdmin = await isAdmin(userId);

  let text = `<b>Доступные команды:</b>\n\n`;
  text += `/start - Начать работу\n`;
  text += `/help - Помощь\n`;
  text += `/catalog - Каталог товаров\n`;
  text += `/order - Оставить заявку\n`;

  if (isUserAdmin) {
    text += `\n<b>Админские команды:</b>\n`;
    text += `/orders - Список заявок\n`;
    text += `/stats - Статистика\n`;
  }

  await sendMessage(message.chat.id, text);
}

async function handleOrders(message: TelegramMessage) {
  const userId = message.from.id;
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

async function handleCatalog(message: TelegramMessage) {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (!categories || categories.length === 0) {
    await sendMessage(message.chat.id, "Каталог пока пуст.");
    return;
  }

  const text = `<b>📦 Каталог товаров</b>\n\nВыберите категорию:`;

  const keyboard = categories.map((cat) => [
    { text: cat.name, callback_data: `cat_${cat.slug}` },
  ]);

  await sendMessage(message.chat.id, text, {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleNewOrder(message: TelegramMessage) {
  await setState(message.from.id, "creating_order", "name", {});

  const text = `<b>📝 Новая заявка</b>\n\nКак вас зовут?`;
  await sendMessage(message.chat.id, text, {
    reply_markup: {
      inline_keyboard: [[{ text: "❌ Отмена", callback_data: "cancel_order" }]],
    },
  });
}

// Callback query handler
async function handleCallbackQuery(callbackQuery: CallbackQuery) {
  const { id, from, message, data } = callbackQuery;

  if (!data || !message) {
    await answerCallbackQuery(id);
    return;
  }

  await answerCallbackQuery(id);

  if (data === "catalog") {
    await handleCatalog(message);
  } else if (data === "new_order") {
    await handleNewOrder(message);
  } else if (data === "admin_orders") {
    await handleOrders(message);
  } else if (data === "admin_stats") {
    await handleStats(message);
  } else if (data === "cancel_order") {
    await clearState(from.id);
    await sendMessage(message.chat.id, "Заявка отменена.");
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
  } else if (data.startsWith("cat_")) {
    const slug = data.replace("cat_", "");
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("category_slug", slug)
      .limit(10);

    if (!products || products.length === 0) {
      await sendMessage(message.chat.id, "В этой категории пока нет товаров.");
      return;
    }

    let text = `<b>Товары в категории:</b>\n\n`;
    for (const product of products) {
      text += `• ${product.name}\n`;
      if (product.price) text += `  💰 ${product.price} ₽\n`;
    }

    await sendMessage(message.chat.id, text);
  } else if (data === "contact") {
    const text = `<b>📞 Контакты</b>\n\n`;
    const contactText =
      text +
      `Telegram: @technomodern_support\n` +
      `Сайт: techno-modern.ru`;
    await sendMessage(message.chat.id, contactText);
  } else if (data === "submit_order") {
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

// Message handler for multi-step dialogs
async function handleMessage(message: TelegramMessage) {
  const state = await getState(message.from.id);

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
      // Валидация телефона
      const phone = message.text?.replace(/\D/g, '') || '';
      if (phone.length < 10 || phone.length > 12) {
        await sendMessage(message.chat.id,
          "Пожалуйста, введите корректный номер телефона (10-12 цифр):");
        return;
      }
      data.phone = message.text;
      await setState(message.from.id, "creating_order", "product", data);
      await sendMessage(
        message.chat.id,
        "Что хотите заказать? (название или ссылка)"
      );
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

  // Unknown message
  await sendMessage(
    message.chat.id,
    "Используйте команды или кнопки меню. Введите /help для справки."
  );
}

// Main handler
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("OK", { status: 200 });
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
      } else if (text.startsWith("/catalog")) {
        await handleCatalog(message);
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
