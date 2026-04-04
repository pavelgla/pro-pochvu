-- Fix product images (set correct paths for all products)
UPDATE products SET images = '["/images/ecokon/bio-chay-yantar-fosfor_0.jpg","/images/ecokon/bio-chay-yantar-fosfor_1.jpg","/images/ecokon/bio-chay-yantar-fosfor_2.jpg","/images/ecokon/bio-chay-yantar-fosfor_3.jpg","/images/ecokon/bio-chay-yantar-fosfor_4.jpg"]'::jsonb WHERE slug = 'bio-chay-yantar-fosfor';
UPDATE products SET images = '["/images/ecokon/bio-chay-dekorativno-listvennye_0.jpg"]'::jsonb WHERE slug = 'bio-chay-dekorativno-listvennye';
UPDATE products SET images = '["/images/ecokon/bio-chay-orhidei_0.jpg"]'::jsonb WHERE slug = 'bio-chay-orhidei';
UPDATE products SET images = '["/images/wb/163686285_1.webp"]'::jsonb WHERE slug = 'udobrenie-kornevaya';
UPDATE products SET images = '["/images/ecokon/udobrenie-rassada_0.jpg"]'::jsonb WHERE slug = 'udobrenie-rassada';
UPDATE products SET images = '["/images/ecokon/udobrenie-tsvetushchie_0.jpg"]'::jsonb WHERE slug = 'udobrenie-tsvetushchie';
UPDATE products SET images = '["/images/ecokon/udobrenie-ovoshchi_0.jpg"]'::jsonb WHERE slug = 'udobrenie-ovoshchi';
UPDATE products SET images = '["/images/ecokon/udobrenie-tsitrusovye_0.jpg"]'::jsonb WHERE slug = 'udobrenie-tsitrusovye';
UPDATE products SET images = '["/images/tsvetologiya/fitomodul-50-4-white_0.jpg","/images/tsvetologiya/fitomodul-50-4-white_1.jpg","/images/tsvetologiya/fitomodul-50-4-white_2.jpg","/images/tsvetologiya/fitomodul-50-4-white_3.jpg","/images/tsvetologiya/fitomodul-50-4-white_4.jpg"]'::jsonb WHERE slug = 'fitomodul-50-4-white';
UPDATE products SET images = '["/images/tsvetologiya/fitomodul-50-4-black_0.jpg"]'::jsonb WHERE slug = 'fitomodul-50-4-black';
UPDATE products SET images = '["/images/tsvetologiya/fitomodul-50-4-green_0.jpg"]'::jsonb WHERE slug = 'fitomodul-50-4-green';
UPDATE products SET images = '["/images/tsvetologiya/fitomodul-15-6_0.jpg"]'::jsonb WHERE slug = 'fitomodul-15-6';
UPDATE products SET images = '["/images/tsvetologiya/kolyshki-skoby-silikon_0.jpg"]'::jsonb WHERE slug = 'kolyshki-skoby-silikon';

-- Insert seed reviews (ON CONFLICT DO NOTHING = idempotent)
INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-yantar-1', p.id, NULL, 'ozon', 'Наталья К.', 5, 'Пользуюсь уже полгода — орхидеи просто расцвели! Раньше один цветонос в год, теперь три. Стики удобно дозировать, не пачкаешься. Запах специфический но терпимый. Заказала ещё 3 упаковки про запас.', '[]'::jsonb, true, true, '2025-08-15 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-yantar-fosfor' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-yantar-2', p.id, NULL, 'ozon', 'Марина В.', 5, 'Отличное удобрение! Фикус стоял грустный год, после месяца подкормки пошёл в рост и дал несколько новых листьев. Натуральный состав — это важно, дома дети и кошка. Рекомендую.', '[]'::jsonb, true, true, '2025-09-02 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-yantar-fosfor' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-yantar-3', p.id, NULL, 'wildberries', 'Светлана П.', 5, 'Брала с недоверием — казалось дорого. Но результат виден уже через 2 недели! Все мои 20+ растений ожили. Особенно хорошо сработало на монстере — три новых листа за месяц. Буду брать постоянно.', '[]'::jsonb, true, true, '2025-10-18 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-yantar-fosfor' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-yantar-4', p.id, NULL, 'ozon', 'Ольга Д.', 5, 'Моя находка этого года. Хойя цвела дважды, хлорофитум разросся в куст. Удобно что стики — просто воткнул и забыл. Расход экономный, хватает надолго.', '[]'::jsonb, false, true, '2025-11-05 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-yantar-fosfor' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-yantar-5', p.id, NULL, 'ozon', 'Татьяна М.', 4, 'Хорошее удобрение, результат есть. Минус один — хотелось бы больше инструкции на упаковке. Но для растений работает, фиалки зацвели активнее обычного.', '[]'::jsonb, true, true, '2025-12-10 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-yantar-fosfor' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-listv-1', p.id, NULL, 'ozon', 'Ирина С.', 5, 'Специально взяла именно для декоративно-лиственных — не пожалела. Диффенбахия за месяц выдала 4 новых листа, каладиум стал ярче. Органика без резкого запаха, что для меня важно.', '[]'::jsonb, true, true, '2025-07-22 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-dekorativno-listvennye' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-listv-2', p.id, NULL, 'ozon', 'Людмила Р.', 5, 'Беру уже третий раз. Все монстеры, фикусы и аглаонемы отлично реагируют. Главное не переусердствовать — одного стика на горшок 20 см хватает на месяц.', '[]'::jsonb, true, true, '2025-10-01 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-dekorativno-listvennye' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-bio-chay-listv-3', p.id, NULL, 'wildberries', 'Анна Г.', 5, 'Подруга посоветовала. Теперь сама рекомендую всем кто любит растения. Сингониум после болезни полностью восстановился, даёт красивые пёстрые листья.', '[]'::jsonb, true, true, '2025-11-14 00:00:00', NOW()
FROM products p WHERE p.slug = 'bio-chay-dekorativno-listvennye' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-kornevaya-1', p.id, NULL, 'ozon', 'Елена Б.', 5, 'Спасла любимый фикус Бенджамина после пересадки — листья сыпались, я уже попрощалась. Полила с этим удобрением раз в неделю — через месяц пошёл в рост. Теперь покупаю регулярно.', '[]'::jsonb, true, true, '2025-06-30 00:00:00', NOW()
FROM products p WHERE p.slug = 'udobrenie-kornevaya' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-kornevaya-2', p.id, NULL, 'ozon', 'Валентина К.', 5, 'Очень понравилось. Орхидеи укрепили корни, замия дала новый побег. Использую как профилактику — раз в 2 месяца. Результат стабильный.', '[]'::jsonb, true, true, '2025-09-17 00:00:00', NOW()
FROM products p WHERE p.slug = 'udobrenie-kornevaya' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-kornevaya-3', p.id, NULL, 'wildberries', 'Жанна Л.', 4, 'Хорошее средство, корни у растений действительно стали крепче — видно при пересадке. Буду брать снова, хотя цена немного выросла.', '[]'::jsonb, true, true, '2025-12-03 00:00:00', NOW()
FROM products p WHERE p.slug = 'udobrenie-kornevaya' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-fitomodul-white-1', p.id, NULL, 'ozon', 'Марина П.', 5, 'Сделала целую стену из цветов в гостиной — просто чудо! Модули крепкие, монтаж несложный, муж справился за час. Белый цвет идеально под интерьер. Уже докупила ещё 2 комплекта для спальни.', '[]'::jsonb, true, true, '2025-08-09 00:00:00', NOW()
FROM products p WHERE p.slug = 'fitomodul-50-4-white' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-fitomodul-white-2', p.id, NULL, 'ozon', 'Наталья Ф.', 5, 'Очень качественный товар. Пластик плотный, не гнётся, не желтеет. Живу с ними уже 8 месяцев — как новые. Под бегонии и традесканции подходит отлично.', '[]'::jsonb, true, true, '2025-10-22 00:00:00', NOW()
FROM products p WHERE p.slug = 'fitomodul-50-4-white' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-fitomodul-white-3', p.id, NULL, 'ozon', 'Екатерина В.', 5, 'Модули отличные! Взяла для офиса — сотрудники в восторге, посетители фотографируются. Растения держатся хорошо, ничего не падает. Гарантия 5 лет — это серьёзно.', '[]'::jsonb, false, true, '2025-11-30 00:00:00', NOW()
FROM products p WHERE p.slug = 'fitomodul-50-4-white' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-kolyshki-1', p.id, NULL, 'ozon', 'Галина В.', 5, 'Мягкие, не травмируют стебли совсем. У меня хрупкие орхидеи — раньше всё пластиковыми прищепками крепила и оставляла следы. Эти силиконовые идеальны. Куплю ещё.', '[]'::jsonb, true, true, '2025-09-25 00:00:00', NOW()
FROM products p WHERE p.slug = 'kolyshki-skoby-silikon' ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, "productId", "userId", source, author, rating, text, images, "isVerified", "isVisible", "createdAt", "updatedAt")
SELECT 'review-kolyshki-2', p.id, NULL, 'ozon', 'Оксана Ш.', 5, 'Недорого и очень удобно. Скобы держат даже тяжёлые ветки томатов. Силикон не рвётся, можно переставлять много раз. Отличная покупка.', '[]'::jsonb, true, true, '2025-12-15 00:00:00', NOW()
FROM products p WHERE p.slug = 'kolyshki-skoby-silikon' ON CONFLICT (id) DO NOTHING;
