-- Fix grunt product: correct name and add images from Ozon account 2
UPDATE products SET
  name = 'Грунт ЭКО Конь универсальный 20л',
  images = '["/images/ozon/grunt-ecokon-20l_1.jpg","/images/ozon/grunt-ecokon-20l_2.jpg","/images/ozon/grunt-ecokon-20l_3.jpg"]'::jsonb
WHERE slug = 'grunt-ecokon-20l';

-- Add Ozon images for Tsvetologiya products (account 2)
UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/fitomodul-50-4-white_1.jpg',
      '/images/ozon/fitomodul-50-4-white_2.jpg',
      '/images/ozon/fitomodul-50-4-white_3.jpg',
      '/images/ozon/fitomodul-50-4-white_4.jpg',
      '/images/ozon/fitomodul-50-4-white_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS e
      WHERE e LIKE '/images/ozon/fitomodul-50-4-white%'
    )
  ) t
) WHERE slug = 'fitomodul-50-4-white';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/fitomodul-50-4-black_1.jpg',
      '/images/ozon/fitomodul-50-4-black_2.jpg',
      '/images/ozon/fitomodul-50-4-black_3.jpg',
      '/images/ozon/fitomodul-50-4-black_4.jpg',
      '/images/ozon/fitomodul-50-4-black_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS e
      WHERE e LIKE '/images/ozon/fitomodul-50-4-black%'
    )
  ) t
) WHERE slug = 'fitomodul-50-4-black';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/fitomodul-50-4-green_1.jpg',
      '/images/ozon/fitomodul-50-4-green_2.jpg',
      '/images/ozon/fitomodul-50-4-green_3.jpg',
      '/images/ozon/fitomodul-50-4-green_4.jpg',
      '/images/ozon/fitomodul-50-4-green_5.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS e
      WHERE e LIKE '/images/ozon/fitomodul-50-4-green%'
    )
  ) t
) WHERE slug = 'fitomodul-50-4-green';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/fitomodul-15-6_1.jpg',
      '/images/ozon/fitomodul-15-6_2.jpg',
      '/images/ozon/fitomodul-15-6_3.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS e
      WHERE e LIKE '/images/ozon/fitomodul-15-6%'
    )
  ) t
) WHERE slug = 'fitomodul-15-6';

UPDATE products SET images = (
  SELECT jsonb_agg(img) FROM (
    SELECT jsonb_array_elements_text(images) AS img
    UNION ALL
    SELECT unnest(ARRAY[
      '/images/ozon/kolyshki-skoby-silikon_1.jpg',
      '/images/ozon/kolyshki-skoby-silikon_2.jpg'
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(images) AS e
      WHERE e LIKE '/images/ozon/kolyshki-skoby-silikon%'
    )
  ) t
) WHERE slug = 'kolyshki-skoby-silikon';
