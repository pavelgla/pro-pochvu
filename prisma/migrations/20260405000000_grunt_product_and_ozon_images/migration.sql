-- Add Грунт ЭКО Конь 20л product
INSERT INTO products (
  id, slug, name, price, "oldPrice", rating, "reviewsCount", badge,
  images, "shortDesc", "weightGrams", stock,
  "productLineId", "categoryId",
  "createdAt", "updatedAt"
)
VALUES (
  'c1000000-0000-0000-0000-000000000014',
  'grunt-ecokon-20l',
  'Грунт ЭКО Конь универсальный 20л',
  699,
  NULL,
  4.8,
  0,
  'new',
  '[]'::jsonb,
  'Универсальный питательный грунт для комнатных и садовых растений. Объём 20 литров.',
  10000,
  100,
  'a1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000008',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Add Ozon images to existing products (append to existing images array)
UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/bio-chay-yantar-fosfor_1.jpg',
      '/images/ozon/bio-chay-yantar-fosfor_2.jpg',
      '/images/ozon/bio-chay-yantar-fosfor_3.jpg',
      '/images/ozon/bio-chay-yantar-fosfor_4.jpg',
      '/images/ozon/bio-chay-yantar-fosfor_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/bio-chay-yantar-fosfor%'
    )
  ) t
) WHERE slug = 'bio-chay-yantar-fosfor';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/bio-chay-dekorativno-listvennye_1.jpg',
      '/images/ozon/bio-chay-dekorativno-listvennye_2.jpg',
      '/images/ozon/bio-chay-dekorativno-listvennye_3.jpg',
      '/images/ozon/bio-chay-dekorativno-listvennye_4.jpg',
      '/images/ozon/bio-chay-dekorativno-listvennye_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/bio-chay-dekorativno-listvennye%'
    )
  ) t
) WHERE slug = 'bio-chay-dekorativno-listvennye';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/udobrenie-ovoshchi_1.jpg',
      '/images/ozon/udobrenie-ovoshchi_2.jpg',
      '/images/ozon/udobrenie-ovoshchi_3.jpg',
      '/images/ozon/udobrenie-ovoshchi_4.jpg',
      '/images/ozon/udobrenie-ovoshchi_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/udobrenie-ovoshchi%'
    )
  ) t
) WHERE slug = 'udobrenie-ovoshchi';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/udobrenie-kornevaya_1.jpg',
      '/images/ozon/udobrenie-kornevaya_2.jpg',
      '/images/ozon/udobrenie-kornevaya_3.jpg',
      '/images/ozon/udobrenie-kornevaya_4.jpg',
      '/images/ozon/udobrenie-kornevaya_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/udobrenie-kornevaya%'
    )
  ) t
) WHERE slug = 'udobrenie-kornevaya';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/bio-chay-orhidei_1.jpg',
      '/images/ozon/bio-chay-orhidei_2.jpg',
      '/images/ozon/bio-chay-orhidei_3.jpg',
      '/images/ozon/bio-chay-orhidei_4.jpg',
      '/images/ozon/bio-chay-orhidei_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/bio-chay-orhidei%'
    )
  ) t
) WHERE slug = 'bio-chay-orhidei';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/udobrenie-tsitrusovye_1.jpg',
      '/images/ozon/udobrenie-tsitrusovye_2.jpg',
      '/images/ozon/udobrenie-tsitrusovye_3.jpg',
      '/images/ozon/udobrenie-tsitrusovye_4.jpg',
      '/images/ozon/udobrenie-tsitrusovye_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/udobrenie-tsitrusovye%'
    )
  ) t
) WHERE slug = 'udobrenie-tsitrusovye';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/udobrenie-rassada_1.jpg',
      '/images/ozon/udobrenie-rassada_2.jpg',
      '/images/ozon/udobrenie-rassada_3.jpg',
      '/images/ozon/udobrenie-rassada_4.jpg',
      '/images/ozon/udobrenie-rassada_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/udobrenie-rassada%'
    )
  ) t
) WHERE slug = 'udobrenie-rassada';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/udobrenie-tsvetushchie_1.jpg',
      '/images/ozon/udobrenie-tsvetushchie_2.jpg',
      '/images/ozon/udobrenie-tsvetushchie_3.jpg',
      '/images/ozon/udobrenie-tsvetushchie_4.jpg',
      '/images/ozon/udobrenie-tsvetushchie_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS existing
      WHERE existing LIKE '/images/ozon/udobrenie-tsvetushchie%'
    )
  ) t
) WHERE slug = 'udobrenie-tsvetushchie';
