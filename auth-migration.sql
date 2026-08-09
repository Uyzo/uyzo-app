-- ============================================================
--  UYZO — миграция под вход по номеру телефона (OTP)
--  Запускать в Supabase → SQL Editor ОДИН раз.
-- ============================================================

-- Профили делаем самостоятельными (свой вход по OTP, без auth.users)
alter table profiles drop constraint if exists profiles_id_fkey;
alter table profiles alter column id set default gen_random_uuid();

-- Таблица одноразовых кодов (доступ только через серверный секретный ключ)
create table if not exists otp_codes (
  phone       text primary key,
  code        text not null,
  expires_at  timestamptz not null,
  attempts    int not null default 0,
  created_at  timestamptz not null default now()
);
alter table otp_codes enable row level security;
-- политик доступа нет: читает/пишет только сервер по секретному ключу (RLS обходится)
