export type Lang = "ru" | "uz" | "en";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "ru", label: "Рус" },
  { code: "uz", label: "Uz" },
  { code: "en", label: "Eng" },
];
export const COOKIE_LANG = "lang";

type Entry = { ru: string; uz: string; en: string };

export const dict: Record<string, Entry> = {
  // nav / header
  "nav.post": { ru: "Разместить", uz: "Joylash", en: "Post" },
  "nav.cabinet": { ru: "Кабинет", uz: "Kabinet", en: "Account" },
  "nav.login": { ru: "Войти", uz: "Kirish", en: "Log in" },
  "nav.howto": { ru: "Как пользоваться", uz: "Qanday ishlaydi", en: "How it works" },
  "city.tashkent": { ru: "Ташкент", uz: "Toshkent", en: "Tashkent" },

  // tabs
  "tab.sale": { ru: "Купить", uz: "Sotib olish", en: "Buy" },
  "tab.rent": { ru: "Снять", uz: "Ijara", en: "Rent" },
  "tab.goods": { ru: "Объявления", uz: "E'lonlar", en: "Listings" },
  "tab.service": { ru: "Мастера", uz: "Ustalar", en: "Pros" },

  // hero
  "hero.welcome": { ru: "Добро пожаловать в Uyzo!", uz: "Uyzo'ga xush kelibsiz!", en: "Welcome to Uyzo!" },
  "hero.title": {
    ru: "Найдём жильё, вещи и мастеров — рядом с вами",
    uz: "Uy-joy, buyum va ustalarni yoningizdan topamiz",
    en: "Find homes, goods and pros — near you",
  },
  "hero.sub": {
    ru: "Собственники и проверенные агентства — с честной пометкой. Фильтр «только собственники» — в один тап.",
    uz: "Mulkdorlar va ishonchli agentliklar — halol belgi bilan. «Faqat mulkdorlar» filtri — bir tap.",
    en: "Owners and verified agencies — clearly labeled. “Owners only” filter in one tap.",
  },
  "hero.postFree": { ru: "＋ Разместить бесплатно", uz: "＋ Bepul joylash", en: "＋ Post for free" },
  "hero.openTg": { ru: "✈️ Открыть в Telegram", uz: "✈️ Telegram'da ochish", en: "✈️ Open in Telegram" },
  "hero.howto": { ru: "❓ Как пользоваться Uyzo", uz: "❓ Uyzo qanday ishlaydi", en: "❓ How to use Uyzo" },

  // section / feed
  "sect.services": { ru: "Мастера и услуги", uz: "Ustalar va xizmatlar", en: "Pros & services" },
  "empty.feed": {
    ru: "Ничего не найдено. Измените фильтры или поиск.",
    uz: "Hech narsa topilmadi. Filtr yoki qidiruvni o'zgartiring.",
    en: "Nothing found. Try changing filters or search.",
  },
  "empty.service": {
    ru: "Раздел мастеров скоро наполнится.",
    uz: "Ustalar bo'limi tez orada to'ladi.",
    en: "Pros section is coming soon.",
  },
  "error.load": {
    ru: "Не удалось загрузить объявления. Проверьте переменные Supabase на Vercel.",
    uz: "E'lonlarni yuklab bo'lmadi. Vercel'dagi Supabase sozlamalarini tekshiring.",
    en: "Couldn't load listings. Check Supabase env vars on Vercel.",
  },

  // filters
  "f.search": { ru: "Поиск по объявлениям…", uz: "E'lonlardan qidirish…", en: "Search listings…" },
  "f.find": { ru: "Найти", uz: "Qidirish", en: "Search" },
  "f.from": { ru: "от", uz: "dan", en: "from" },
  "f.to": { ru: "до", uz: "gacha", en: "to" },
  "f.allDistricts": { ru: "Все районы", uz: "Barcha tumanlar", en: "All districts" },
  "f.rooms": { ru: "Комнаты", uz: "Xonalar", en: "Rooms" },
  "f.apply": { ru: "Применить", uz: "Qo'llash", en: "Apply" },
  "f.reset": { ru: "Сбросить", uz: "Tozalash", en: "Reset" },
  "f.all": { ru: "Все", uz: "Barchasi", en: "All" },
  "f.owners": { ru: "Собственники", uz: "Mulkdorlar", en: "Owners" },
  "f.agencies": { ru: "Агентства", uz: "Agentliklar", en: "Agencies" },

  // card / common
  "c.owner": { ru: "Собственник", uz: "Mulkdor", en: "Owner" },
  "c.agency": { ru: "Агентство", uz: "Agentlik", en: "Agency" },
  "u.rooms": { ru: "комн.", uz: "xona", en: "rooms" },
  "u.sum": { ru: "сум", uz: "so'm", en: "sum" },
  "price.negotiable": { ru: "Цена договорная", uz: "Kelishilgan narx", en: "Negotiable" },
  "idx.low": { ru: "Ниже рынка", uz: "Bozordan past", en: "Below market" },
  "idx.fair": { ru: "В рынке", uz: "Bozor narxida", en: "At market" },
  "idx.high": { ru: "Выше рынка", uz: "Bozordan yuqori", en: "Above market" },

  // subscribe
  "sub.btn": { ru: "🔔 Уведомлять о новых", uz: "🔔 Yangilardan xabar", en: "🔔 Notify me" },
  "sub.done": { ru: "🔔 Подписка оформлена", uz: "🔔 Obuna qilindi", en: "🔔 Subscribed" },

  // detail
  "d.title": { ru: "Объявление", uz: "E'lon", en: "Listing" },
  "d.deal": { ru: "Тип сделки", uz: "Bitim turi", en: "Deal" },
  "d.sale": { ru: "Продажа", uz: "Sotuv", en: "Sale" },
  "d.rent": { ru: "Аренда", uz: "Ijara", en: "Rent" },
  "d.rooms": { ru: "Комнаты", uz: "Xonalar", en: "Rooms" },
  "d.area": { ru: "Площадь", uz: "Maydon", en: "Area" },
  "d.floor": { ru: "Этаж", uz: "Qavat", en: "Floor" },
  "d.desc": { ru: "Описание", uz: "Tavsif", en: "Description" },
  "d.loc": { ru: "Примерное расположение", uz: "Taxminiy joylashuv", en: "Approximate location" },
  "d.locNote": {
    ru: "район · примерная зона. Точный адрес — после связи с продавцом.",
    uz: "tumani · taxminiy hudud. Aniq manzil — sotuvchi bilan bog'langach.",
    en: "district · approximate area. Exact address — after contacting the seller.",
  },
  "d.safe": {
    ru: "⚠️ Совет Uyzo: осматривайте товар/жильё лично, не вносите предоплату незнакомцам.",
    uz: "⚠️ Uyzo maslahati: mol/uyni shaxsan ko'ring, notanishlarga oldindan to'lov qilmang.",
    en: "⚠️ Uyzo tip: inspect the item/home in person, don't prepay strangers.",
  },
  "d.aiEst": { ru: "оценка Uyzo AI ≈", uz: "Uyzo AI bahosi ≈", en: "Uyzo AI estimate ≈" },
  "st.pending": {
    ru: "На модерации — видно только вам, пока админ не одобрит.",
    uz: "Moderatsiyada — admin tasdiqlaguncha faqat sizga ko'rinadi.",
    en: "In review — visible only to you until an admin approves.",
  },
  "st.rejected": { ru: "Объявление отклонено модератором.", uz: "E'lon moderator tomonidan rad etildi.", en: "Rejected by moderator." },

  // login
  "login.title": { ru: "Вход", uz: "Kirish", en: "Log in" },
  "login.sub": {
    ru: "Быстрый вход через Telegram — без SMS и паролей.",
    uz: "Telegram orqali tez kirish — SMS va parolsiz.",
    en: "Fast login via Telegram — no SMS or passwords.",
  },
  "login.tg": { ru: "✈️ Войти через Telegram", uz: "✈️ Telegram orqali kirish", en: "✈️ Log in with Telegram" },
  "login.openApp": {
    ru: "или открыть приложение в Telegram →",
    uz: "yoki Telegram'da ilovani ochish →",
    en: "or open the app in Telegram →",
  },
  "login.wait": {
    ru: "Открылся бот — нажмите «Запустить». Вход подтвердится автоматически…",
    uz: "Bot ochildi — «Запустить» bosing. Kirish avtomatik tasdiqlanadi…",
    en: "Bot opened — tap “Start”. Login will confirm automatically…",
  },
  "login.note": {
    ru: "Тот же аккаунт, что и в приложении. Без SMS и паролей.",
    uz: "Ilovadagi kabi bir xil akkaunt. SMS va parolsiz.",
    en: "Same account as in the app. No SMS or passwords.",
  },

  // form
  "form.newTitle": { ru: "Новое объявление", uz: "Yangi e'lon", en: "New listing" },
  "form.editTitle": { ru: "Редактирование объявления", uz: "E'lonni tahrirlash", en: "Edit listing" },
  "form.aiTitle": { ru: "✨ Сфоткай и продай", uz: "✨ Suratga ol va sot", en: "✨ Snap & sell" },
  "form.aiSub": {
    ru: "Загрузите фото — AI напишет заголовок, описание и подскажет цену.",
    uz: "Surat yuklang — AI sarlavha, tavsif yozadi va narx taklif qiladi.",
    en: "Upload photos — AI writes the title, description and suggests a price.",
  },
  "form.aiBtn": { ru: "✨ Заполнить автоматически (демо)", uz: "✨ Avtomatik to'ldirish (demo)", en: "✨ Autofill (demo)" },
  "form.section": { ru: "Раздел", uz: "Bo'lim", en: "Section" },
  "form.realty": { ru: "Недвижимость", uz: "Ko'chmas mulk", en: "Real estate" },
  "form.goods": { ru: "Товар / услуга", uz: "Mahsulot / xizmat", en: "Goods / service" },
  "form.dealType": { ru: "Тип сделки", uz: "Bitim turi", en: "Deal type" },
  "form.sale": { ru: "Продажа", uz: "Sotuv", en: "Sale" },
  "form.rent": { ru: "Аренда", uz: "Ijara", en: "Rent" },
  "form.category": { ru: "Категория", uz: "Turkum", en: "Category" },
  "form.title": { ru: "Заголовок", uz: "Sarlavha", en: "Title" },
  "form.titlePh": { ru: "Напр. 2-комн. квартира, Юнусабад", uz: "Masalan: 2 xonali kvartira, Yunusobod", en: "e.g. 2-room apartment, Yunusabad" },
  "form.price": { ru: "Цена", uz: "Narx", en: "Price" },
  "form.priceSum": { ru: "Сумма", uz: "Summa", en: "Amount" },
  "form.rooms": { ru: "Комнат", uz: "Xonalar", en: "Rooms" },
  "form.area": { ru: "Площадь, м²", uz: "Maydon, m²", en: "Area, m²" },
  "form.floor": { ru: "Этаж", uz: "Qavat", en: "Floor" },
  "form.district": { ru: "Район", uz: "Tuman", en: "District" },
  "form.who": { ru: "Кто размещает", uz: "Kim joylayapti", en: "Posted by" },
  "form.owner": { ru: "Собственник", uz: "Mulkdor", en: "Owner" },
  "form.agent": { ru: "Агентство", uz: "Agentlik", en: "Agency" },
  "form.desc": { ru: "Описание", uz: "Tavsif", en: "Description" },
  "form.descPh": { ru: "Опишите объект/товар подробно…", uz: "Obyekt/mahsulotni batafsil yozing…", en: "Describe the item in detail…" },
  "form.phone": { ru: "Телефон", uz: "Telefon", en: "Phone" },
  "form.photos": { ru: "Фотографии (до 8)", uz: "Suratlar (8 tagacha)", en: "Photos (up to 8)" },
  "form.publish": { ru: "Опубликовать", uz: "E'lon berish", en: "Publish" },
  "form.save": { ru: "Сохранить изменения", uz: "O'zgarishlarni saqlash", en: "Save changes" },
  "form.saving": { ru: "Сохраняем…", uz: "Saqlanmoqda…", en: "Saving…" },
  "form.moderNote": {
    ru: "Объявление публикуется после проверки модератором.",
    uz: "E'lon moderator tekshiruvidan so'ng chop etiladi.",
    en: "The listing is published after moderator review.",
  },
  "form.doneNew": { ru: "Отправлено на модерацию", uz: "Moderatsiyaga yuborildi", en: "Sent for review" },
  "form.doneEdit": { ru: "Изменения сохранены", uz: "O'zgarishlar saqlandi", en: "Changes saved" },
  "form.doneNewSub": {
    ru: "Мы проверим объявление и опубликуем его. Статус — в «Кабинете».",
    uz: "E'lonni tekshirib chop etamiz. Holati — «Kabinet»da.",
    en: "We'll review and publish it. Status is in “Account”.",
  },
  "form.doneEditSub": { ru: "Объявление обновлено.", uz: "E'lon yangilandi.", en: "Listing updated." },
  "form.toMy": { ru: "Мои объявления", uz: "Mening e'lonlarim", en: "My listings" },
  "form.toHome": { ru: "На главную", uz: "Bosh sahifa", en: "Home" },
  "loading": { ru: "Загрузка…", uz: "Yuklanmoqda…", en: "Loading…" },
};

export function t(lang: Lang, key: string): string {
  const e = dict[key];
  if (!e) return key;
  return e[lang] ?? e.ru;
}
