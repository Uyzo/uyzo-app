-- ============================================================
--  UYZO — демо-данные (запускать в Supabase → SQL Editor ПОСЛЕ bazr-schema.sql)
--  Создаёт демо-владельца и несколько активных объявлений, чтобы лента не была пустой.
-- ============================================================

-- 1) Демо-владелец (auth user + профиль создаётся триггером)
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
  'demo@uyzo.app', crypt('demo-password', gen_salt('bf')),
  now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
on conflict (id) do nothing;

update profiles set full_name = 'Азиз', is_verified = true, phone = '+998 90 123-45-67'
where id = '11111111-1111-1111-1111-111111111111';

-- 2) Объявления (district_id и category_id берём по названию/slug — надёжно)
insert into listings (owner_id, kind, deal_type, category_id, title, description,
  price, currency, price_market, rooms, area, floor, district_id, owner_type, status, is_vip)
values
('11111111-1111-1111-1111-111111111111','realty','sale',(select id from categories where slug='apartment'),
 '2-комн. новостройка, Юнусабад','Новый дом, чистовая отделка, автономное отопление, рядом метро. Документы готовы.',
 62000,'USD',63000,2,58,'5/9',(select id from districts where name_ru='Юнусабадский'),'owner','active',true),

('11111111-1111-1111-1111-111111111111','realty','rent',(select id from categories where slug='apartment'),
 '3-комн. долгосрок, Чиланзар','Просторная квартира с ремонтом, вся мебель и техника, парковка. Для семьи.',
 6500000,'UZS',6000000,3,78,'2/5',(select id from districts where name_ru='Чиланзарский'),'agent','active',false),

('11111111-1111-1111-1111-111111111111','realty','sale',(select id from categories where slug='house'),
 'Дом 5 комнат, 6 соток, Сергели','Кирпичный дом, свой двор, гараж, сад. Все коммуникации центральные. Торг уместен.',
 95000,'USD',90000,5,180,'1 эт.',(select id from districts where name_ru='Сергелийский'),'owner','active',false),

('11111111-1111-1111-1111-111111111111','goods','sale',(select id from categories where slug='transport'),
 'Chevrolet Cobalt 2022, идеал','Один хозяин, пробег 38 000 км, газ/бензин, не бита не крашена.',
 14500,'USD',15500,null,null,null,(select id from districts where name_ru='Мирзо-Улугбекский'),'owner','active',true),

('11111111-1111-1111-1111-111111111111','goods','sale',(select id from categories where slug='electronics'),
 'iPhone 15 Pro 256GB, как новый','На гарантии, полный комплект, чек есть. Торг при осмотре.',
 11000000,'UZS',11500000,null,null,null,(select id from districts where name_ru='Яккасарайский'),'owner','active',false),

('11111111-1111-1111-1111-111111111111','goods','sale',(select id from categories where slug='home'),
 'Диван угловой, раскладной','Состояние отличное, ткань антикоготь, доставка по городу.',
 3200000,'UZS',3000000,null,null,null,(select id from districts where name_ru='Чиланзарский'),'owner','active',false);
