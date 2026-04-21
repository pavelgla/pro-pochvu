-- Обновление videoUrl для товаров с видеоинструкциями
-- Выполнить на dev и prod БД

UPDATE products SET "videoUrl" = '/videos/udobrenie-kornevaya-instruction.mp4' WHERE slug = 'udobrenie-kornevaya';
UPDATE products SET "videoUrl" = '/videos/udobrenie-rassada-instruction.mp4' WHERE slug = 'udobrenie-rassada';
UPDATE products SET "videoUrl" = '/videos/udobrenie-ovoshchi-instruction.mp4' WHERE slug = 'udobrenie-ovoshchi';
UPDATE products SET "videoUrl" = '/videos/bio-chay-orhidei-instruction.mp4' WHERE slug = 'bio-chay-orhidei';
UPDATE products SET "videoUrl" = '/videos/bio-chay-dekorativno-listvennye-instruction.mp4' WHERE slug = 'bio-chay-dekorativno-listvennye';
UPDATE products SET "videoUrl" = '/videos/bio-chay-yantar-fosfor-instruction.mp4' WHERE slug = 'bio-chay-yantar-fosfor';
