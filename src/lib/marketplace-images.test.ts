import { describe, it, expect } from "vitest";
import { mergeProductImages, MANUAL_IMAGE_SLUGS } from "./marketplace-images";

const WB = "https://basket-16.wbbasket.ru/vol2621/part262136/262136598/images/big/1.webp";
const WB2 = "https://basket-16.wbbasket.ru/vol2621/part262136/262136598/images/big/2.webp";
const OWN = "/images/ozon/udobrenie-tsitrusovye_1.jpg";

describe("mergeProductImages", () => {
  it("не трогает галерею товаров с ручными фото", () => {
    // WB-карточка этого товара показывает снятую с производства упаковку,
    // сайт должен остаться на фотографиях, которые прислал бренд.
    expect(mergeProductImages("udobrenie-tsitrusovye", [OWN], [WB, WB2])).toBeNull();
  });

  it("ставит фото маркетплейса первыми, свои оставляет следом", () => {
    expect(mergeProductImages("bio-chay-orhidei", [OWN], [WB])).toEqual([WB, OWN]);
  });

  it("выбрасывает прежние ссылки маркетплейса, чтобы не копились дубли", () => {
    expect(mergeProductImages("bio-chay-orhidei", [WB, OWN, "/images/wb/old_1.jpg"], [WB2])).toEqual([
      WB2,
      OWN,
    ]);
  });

  it("держит список ручных слагов непустым", () => {
    expect(MANUAL_IMAGE_SLUGS.size).toBeGreaterThan(0);
  });
});
