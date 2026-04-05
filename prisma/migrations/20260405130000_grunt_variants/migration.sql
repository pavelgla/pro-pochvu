-- Add Грунт для овощей (grunt-ecokon-ovoshchi)
INSERT INTO products (
  id, slug, name, price, "oldPrice", rating, "reviewsCount", badge,
  images, "shortDesc", "weightGrams", stock,
  "productLineId", "categoryId",
  "createdAt", "updatedAt"
)
VALUES (
  'c1000000-0000-0000-0000-000000000015',
  'grunt-ecokon-ovoshchi',
  'Грунт ЭКО КОНЬ, для овощей',
  1500,
  1680,
  4.8,
  0,
  NULL,
  '["/images/ozon/grunt-ecokon-20l_1.jpg","/images/ozon/grunt-ecokon-20l_2.jpg","/images/ozon/grunt-ecokon-20l_3.jpg"]'::jsonb,
  'Специализированный грунт для выращивания овощей. ЭКО Конь.',
  10000,
  100,
  'a1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000008',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Add Органический грунт для овощей (grunt-ecokon-organicheskiy)
INSERT INTO products (
  id, slug, name, price, "oldPrice", rating, "reviewsCount", badge,
  images, "shortDesc", "weightGrams", stock,
  "productLineId", "categoryId",
  "createdAt", "updatedAt"
)
VALUES (
  'c1000000-0000-0000-0000-000000000016',
  'grunt-ecokon-organicheskiy',
  'Органический грунт ЭКО Конь, для овощей',
  720,
  840,
  4.8,
  0,
  NULL,
  '["/images/ozon/grunt-ecokon-20l_1.jpg","/images/ozon/grunt-ecokon-20l_2.jpg"]'::jsonb,
  'Органический грунт для выращивания овощей на основе биогумуса. ЭКО Конь.',
  5000,
  100,
  'a1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000008',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;
