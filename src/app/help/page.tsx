import Link from "next/link";
import Mascot from "../components/Mascot";
import { getLang } from "@/lib/i18n-server";
import type { Lang } from "@/lib/i18n";

export const metadata = { title: "Как пользоваться Uyzo" };

type HelpContent = {
  headerTitle: string;
  back: string;
  heroTitle: string;
  heroSub: string;
  badge: string;
  featTitle: string;
  featP1: React.ReactNode;
  featP2: React.ReactNode;
  stepsLabel: string;
  featSteps: React.ReactNode[];
  howTitle: string;
  steps: { title: string; body: React.ReactNode }[];
  safety: React.ReactNode;
  cta: string;
};

const HELP: Record<Lang, HelpContent> = {
  ru: {
    headerTitle: "Как пользоваться Uyzo",
    back: "←",
    heroTitle: "Добро пожаловать!",
    heroSub: "Короткий гид — за 1 минуту разберётесь, что где находится.",
    badge: "✨ Фишка Uyzo",
    featTitle: "«Сфоткай и продай» — объявление за 10 секунд",
    featP1: (
      <>Не любите заполнять формы? И не надо. Нажмите <b>«Разместить»</b>, загрузите фото и нажмите
      <b> «✨ Заполнить автоматически»</b> — Uyzo AI сам придумает <b>заголовок</b>, напишет <b>описание</b> и
      подскажет <b>справедливую цену</b> по вашему району. Останется только проверить и опубликовать.</>
    ),
    featP2: (
      <>А ещё AI показывает <b>индекс цены</b>: 🟢 ниже рынка · 🟡 в рынке · 🔴 дороже рынка — чтобы вы выставили
      цену правильно, а покупатель сразу видел выгоду.</>
    ),
    stepsLabel: "По шагам:",
    featSteps: [
      <>Нажмите <b>«Разместить»</b> вверху.</>,
      <>Выберите раздел (недвижимость / товар) и тип сделки.</>,
      <>Внизу нажмите <b>«Фотографии»</b> и загрузите снимки объекта.</>,
      <>Нажмите фиолетовую кнопку <b>«✨ Заполнить автоматически»</b>.</>,
      <>AI подставит заголовок, описание и цену — проверьте и при желании поправьте.</>,
      <>Нажмите <b>«Опубликовать»</b>. Объявление уйдёт на быструю проверку и появится в ленте.</>,
    ],
    howTitle: "Как всё устроено",
    steps: [
      { title: "Разделы сверху", body: <><b>Купить</b> и <b>Снять</b> — недвижимость; <b>Объявления</b> — товары (как на Авито); <b> Мастера</b> — услуги (ремонт, клининг, переезд).</> },
      { title: "Поиск и фильтры", body: <>Введите запрос в строку поиска. Ниже — фильтры: цена «от–до», переключатель <b>сум / $</b>, район, комнаты.</> },
      { title: "Собственник или агентство", body: <>Над лентой недвижимости есть переключатель <b>Все · Собственники · Агентства</b>. У каждого объявления — честная пометка, кто его разместил. Хотите напрямую от хозяина — жмите «Собственники».</> },
      { title: "Карточка объявления", body: <>Нажмите на объявление — увидите фото, характеристики, описание, <b>примерное расположение</b> (точный адрес — после связи с продавцом) и кнопки связи.</> },
      { title: "Вход — через Telegram", body: <>Нажмите <b>«Войти»</b> → <b>«Открыть в Telegram»</b>. Вход в один тап, без SMS и паролей.</> },
      { title: "Разместить объявление", body: <>Кнопка <b>«Разместить»</b> вверху. Заполняете (или жмёте «✨ Заполнить автоматически»), добавляете фото — и отправляете. Объявление проходит <b>быструю проверку</b> и появляется в ленте.</> },
      { title: "Ваши объявления — в «Кабинете»", body: <>Там видно статусы (на модерации / активно), можно <b>изменить</b> или <b>удалить</b> объявление и привязать второй способ входа в разделе «Аккаунт».</> },
    ],
    safety: <><b>Безопасность.</b> Осматривайте товар и жильё лично, не вносите предоплату незнакомым людям, встречайтесь в людных местах. Модерация отсеивает мусор, но бдительность не помешает.</>,
    cta: "Попробовать «Сфоткай и продай»",
  },
  uz: {
    headerTitle: "Uyzo qanday ishlaydi",
    back: "←",
    heroTitle: "Xush kelibsiz!",
    heroSub: "Qisqa qo'llanma — 1 daqiqada nima qayerdaligini tushunasiz.",
    badge: "✨ Uyzo xususiyati",
    featTitle: "«Suratga ol va sot» — 10 soniyada e'lon",
    featP1: (
      <>Shakl to'ldirishni yoqtirmaysizmi? Shart emas. <b>«Joylash»</b> tugmasini bosing, surat yuklang va
      <b> «✨ Avtomatik to'ldirish»</b> tugmasini bosing — Uyzo AI o'zi <b>sarlavha</b> o'ylab topadi, <b>tavsif</b>
      yozadi va tumaningiz bo'yicha <b>adolatli narx</b> taklif qiladi. Sizga faqat tekshirib chop etish qoladi.</>
    ),
    featP2: (
      <>Bundan tashqari AI <b>narx indeksini</b> ko'rsatadi: 🟢 bozordan past · 🟡 bozor narxida · 🔴 bozordan qimmat —
      narxni to'g'ri qo'yishingiz, xaridor esa foydani darrov ko'rishi uchun.</>
    ),
    stepsLabel: "Bosqichma-bosqich:",
    featSteps: [
      <>Yuqoridagi <b>«Joylash»</b> tugmasini bosing.</>,
      <>Bo'lim (ko'chmas mulk / mahsulot) va bitim turini tanlang.</>,
      <>Pastda <b>«Suratlar»</b> ni bosib, obyekt suratlarini yuklang.</>,
      <>Binafsha <b>«✨ Avtomatik to'ldirish»</b> tugmasini bosing.</>,
      <>AI sarlavha, tavsif va narxni qo'yadi — tekshiring va xohlasangiz tuzating.</>,
      <><b>«E'lon berish»</b> ni bosing. E'lon tez tekshiruvdan o'tib, lentada paydo bo'ladi.</>,
    ],
    howTitle: "Hammasi qanday tuzilgan",
    steps: [
      { title: "Yuqoridagi bo'limlar", body: <><b>Sotib olish</b> va <b>Ijara</b> — ko'chmas mulk; <b>E'lonlar</b> — mahsulotlar (Avito kabi); <b> Ustalar</b> — xizmatlar (ta'mirlash, tozalash, ko'chish).</> },
      { title: "Qidiruv va filtrlar", body: <>Qidiruv qatoriga so'rov kiriting. Pastda — filtrlar: narx «dan–gacha», <b>so'm / $</b> almashtirgichi, tuman, xonalar.</> },
      { title: "Mulkdor yoki agentlik", body: <>Ko'chmas mulk lentasi ustida <b>Barchasi · Mulkdorlar · Agentliklar</b> almashtirgichi bor. Har bir e'londa uni kim joylagani halol belgilangan. To'g'ridan-to'g'ri egasidan xohlasangiz — «Mulkdorlar» ni bosing.</> },
      { title: "E'lon kartochkasi", body: <>E'lonni bosing — surat, xususiyatlar, tavsif, <b>taxminiy joylashuv</b> (aniq manzil — sotuvchi bilan bog'langach) va bog'lanish tugmalarini ko'rasiz.</> },
      { title: "Kirish — Telegram orqali", body: <><b>«Kirish»</b> → <b>«Telegram'da ochish»</b> ni bosing. Bir tapda kirish, SMS va parolsiz.</> },
      { title: "E'lon joylash", body: <>Yuqoridagi <b>«Joylash»</b> tugmasi. To'ldirasiz (yoki «✨ Avtomatik to'ldirish» ni bosasiz), surat qo'shasiz — va yuborasiz. E'lon <b>tez tekshiruvdan</b> o'tib lentada paydo bo'ladi.</> },
      { title: "E'lonlaringiz — «Kabinet»da", body: <>U yerda holatlar ko'rinadi (moderatsiyada / faol), e'lonni <b>tahrirlash</b> yoki <b>o'chirish</b>, «Akkaunt» bo'limida ikkinchi kirish usulini ulash mumkin.</> },
    ],
    safety: <><b>Xavfsizlik.</b> Mol va uyni shaxsan ko'ring, notanishlarga oldindan to'lov qilmang, gavjum joylarda uchrashing. Moderatsiya keraksizini saralaydi, ammo hushyorlik zarar qilmaydi.</>,
    cta: "«Suratga ol va sot» ni sinab ko'ring",
  },
  en: {
    headerTitle: "How to use Uyzo",
    back: "←",
    heroTitle: "Welcome!",
    heroSub: "A quick guide — you'll get your bearings in a minute.",
    badge: "✨ Uyzo feature",
    featTitle: "“Snap & sell” — a listing in 10 seconds",
    featP1: (
      <>Don't like filling out forms? You don't have to. Tap <b>“Post”</b>, upload photos and tap
      <b> “✨ Autofill”</b> — Uyzo AI writes the <b>title</b> and <b>description</b> and suggests a
      <b> fair price</b> for your district. All that's left is to review and publish.</>
    ),
    featP2: (
      <>The AI also shows a <b>price index</b>: 🟢 below market · 🟡 at market · 🔴 above market — so you price it
      right and the buyer sees the deal at a glance.</>
    ),
    stepsLabel: "Step by step:",
    featSteps: [
      <>Tap <b>“Post”</b> at the top.</>,
      <>Pick a section (real estate / goods) and the deal type.</>,
      <>Tap <b>“Photos”</b> below and upload pictures of the item.</>,
      <>Tap the purple <b>“✨ Autofill”</b> button.</>,
      <>The AI fills in title, description and price — review and tweak if you like.</>,
      <>Tap <b>“Publish”</b>. The listing goes through a quick review and appears in the feed.</>,
    ],
    howTitle: "How it all works",
    steps: [
      { title: "Sections at the top", body: <><b>Buy</b> and <b>Rent</b> — real estate; <b>Listings</b> — goods (like Avito); <b> Pros</b> — services (repair, cleaning, moving).</> },
      { title: "Search and filters", body: <>Type a query in the search bar. Below are filters: price “from–to”, a <b>sum / $</b> toggle, district, rooms.</> },
      { title: "Owner or agency", body: <>Above the real-estate feed there's an <b>All · Owners · Agencies</b> toggle. Every listing is honestly labeled with who posted it. Want it straight from the owner — tap “Owners”.</> },
      { title: "Listing card", body: <>Tap a listing — you'll see photos, specs, description, <b>approximate location</b> (exact address after contacting the seller) and contact buttons.</> },
      { title: "Login — via Telegram", body: <>Tap <b>“Log in”</b> → <b>“Open in Telegram”</b>. One-tap login, no SMS or passwords.</> },
      { title: "Post a listing", body: <>The <b>“Post”</b> button at the top. Fill it in (or tap “✨ Autofill”), add photos — and submit. The listing goes through a <b>quick review</b> and appears in the feed.</> },
      { title: "Your listings — in “Account”", body: <>There you can see statuses (in review / active), <b>edit</b> or <b>delete</b> a listing, and link a second login method under “Account”.</> },
    ],
    safety: <><b>Safety.</b> Inspect goods and homes in person, don't prepay strangers, meet in public places. Moderation filters out junk, but staying alert never hurts.</>,
    cta: "Try “Snap & sell”",
  },
};

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand-dark">
        {n}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <div className="mt-1 text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}

export default function Help() {
  const c = HELP[getLang()];
  return (
    <main className="mx-auto max-w-2xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-base">{c.headerTitle}</b>
      </div>

      <div className="space-y-5 p-4">
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-brand to-violet-600 p-5 text-white">
          <div className="rounded-2xl bg-white/15 p-2"><Mascot size={56} /></div>
          <div>
            <h1 className="text-lg font-extrabold">{c.heroTitle}</h1>
            <p className="text-sm text-white/85">{c.heroSub}</p>
          </div>
        </div>

        {/* Флагманская фишка — первой */}
        <div className="rounded-2xl border-2 border-brand bg-brand-light/40 p-4">
          <div className="mb-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">{c.badge}</div>
          <h2 className="text-lg font-bold text-slate-900">{c.featTitle}</h2>
          <p className="mt-1 text-sm text-slate-700">{c.featP1}</p>
          <p className="mt-2 text-sm text-slate-700">{c.featP2}</p>
          <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-700">
            <b>{c.stepsLabel}</b>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              {c.featSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-base font-bold">{c.howTitle}</h2>
          <div className="space-y-4">
            {c.steps.map((s, i) => (
              <Step key={i} n={String(i + 1)} title={s.title}>{s.body}</Step>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {c.safety}
        </div>

        <div className="text-center">
          <Link href="/new" className="inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">
            {c.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
