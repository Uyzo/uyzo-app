import Link from "next/link";
import Mascot from "../components/Mascot";

export const metadata = { title: "Как пользоваться Uyzo" };

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
  return (
    <main className="mx-auto max-w-2xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-base">Как пользоваться Uyzo</b>
      </div>

      <div className="space-y-5 p-4">
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-brand to-violet-600 p-5 text-white">
          <div className="rounded-2xl bg-white/15 p-2"><Mascot size={56} /></div>
          <div>
            <h1 className="text-lg font-extrabold">Добро пожаловать!</h1>
            <p className="text-sm text-white/85">Короткий гид — за 1 минуту разберётесь, что где находится.</p>
          </div>
        </div>

        {/* Флагманская фишка — первой */}
        <div className="rounded-2xl border-2 border-brand bg-brand-light/40 p-4">
          <div className="mb-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">✨ Фишка Uyzo</div>
          <h2 className="text-lg font-bold text-slate-900">«Сфоткай и продай» — объявление за 10 секунд</h2>
          <p className="mt-1 text-sm text-slate-700">
            Не любите заполнять формы? И не надо. Нажмите <b>«Разместить»</b>, загрузите фото и нажмите
            <b> «✨ Заполнить автоматически»</b> — Uyzo AI сам придумает <b>заголовок</b>, напишет <b>описание</b> и
            подскажет <b>справедливую цену</b> по вашему району. Останется только проверить и опубликовать.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            А ещё AI показывает <b>индекс цены</b>: 🟢 ниже рынка · 🟡 в рынке · 🔴 дороже рынка — чтобы вы выставили
            цену правильно, а покупатель сразу видел выгоду.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-base font-bold">Как всё устроено</h2>
          <div className="space-y-4">
            <Step n="1" title="Разделы сверху">
              <b>Купить</b> и <b>Снять</b> — недвижимость; <b>Объявления</b> — товары (как на Авито);
              <b> Мастера</b> — услуги (ремонт, клининг, переезд).
            </Step>
            <Step n="2" title="Поиск и фильтры">
              Введите запрос в строку поиска. Ниже — фильтры: цена «от–до», переключатель <b>сум / $</b>, район, комнаты.
            </Step>
            <Step n="3" title="Собственник или агентство">
              Над лентой недвижимости есть переключатель <b>Все · Собственники · Агентства</b>. У каждого объявления —
              честная пометка, кто его разместил. Хотите напрямую от хозяина — жмите «Собственники».
            </Step>
            <Step n="4" title="Карточка объявления">
              Нажмите на объявление — увидите фото, характеристики, описание, <b>примерное расположение</b> на карте
              (точный адрес — после связи с продавцом) и кнопки связи.
            </Step>
            <Step n="5" title="Вход — через Telegram">
              Нажмите <b>«Войти»</b> → <b>«Открыть в Telegram»</b>. Вход в один тап, без SMS и паролей.
            </Step>
            <Step n="6" title="Разместить объявление">
              Кнопка <b>«Разместить»</b> вверху. Заполняете (или жмёте «✨ Заполнить автоматически»), добавляете фото —
              и отправляете. Объявление проходит <b>быструю проверку</b> и появляется в ленте.
            </Step>
            <Step n="7" title="Ваши объявления — в «Кабинете»">
              Там видно статусы (на модерации / активно), можно <b>изменить</b> или <b>удалить</b> объявление и
              привязать второй способ входа в разделе «Аккаунт».
            </Step>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <b>Безопасность.</b> Осматривайте товар и жильё лично, не вносите предоплату незнакомым людям, встречайтесь
          в людных местах. Модерация отсеивает мусор, но бдительность не помешает.
        </div>

        <div className="text-center">
          <Link href="/new" className="inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">
            Попробовать «Сфоткай и продай»
          </Link>
        </div>
      </div>
    </main>
  );
}
