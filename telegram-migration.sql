-- ============================================================
--  UYZO — миграция под вход через Telegram Mini App
--  Запускать в Supabase → SQL Editor один раз.
-- ============================================================

alter table profiles add column if not exists telegram_id bigint unique;
