import type {
  DeliveryOption,
  PickupPoint,
  City,
  DeliveryProvider,
  TrackingEvent,
} from "@/types/delivery";
import { PROVIDER_NAMES, PROVIDER_COLORS } from "@/types/delivery";

const BASE_URL = "https://api.apiship.ru/v1";
const API_KEY = process.env.APISHIP_API_KEY;
const FROM_CITY_ID = process.env.APISHIP_FROM_CITY_ID || "44";

function headers() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

function isMockMode() {
  return process.env.NODE_ENV === "development" && !API_KEY;
}

// =============================================
// Mock data
// =============================================

const mockCities: City[] = [
  { id: 44, name: "Москва", region: "Московская область" },
  { id: 137, name: "Санкт-Петербург", region: "Ленинградская область" },
  { id: 433, name: "Новосибирск", region: "Новосибирская область" },
  { id: 266, name: "Екатеринбург", region: "Свердловская область" },
  { id: 248, name: "Казань", region: "Республика Татарстан" },
  { id: 414, name: "Нижний Новгород", region: "Нижегородская область" },
  { id: 504, name: "Ростов-на-Дону", region: "Ростовская область" },
  { id: 652, name: "Краснодар", region: "Краснодарский край" },
  { id: 565, name: "Самара", region: "Самарская область" },
  { id: 468, name: "Пермь", region: "Пермский край" },
  { id: 109, name: "Воронеж", region: "Воронежская область" },
  { id: 619, name: "Тюмень", region: "Тюменская область" },
  { id: 321, name: "Красноярск", region: "Красноярский край" },
  { id: 638, name: "Уфа", region: "Республика Башкортостан" },
  { id: 99, name: "Волгоград", region: "Волгоградская область" },
];

function getMockTariffs(cityId: number): DeliveryOption[] {
  const isCapital = cityId === 44 || cityId === 137;
  const daysAdd = isCapital ? 0 : 2;

  return [
    {
      provider: "fivepost",
      provider_name: "5Post",
      tariff_id: "fp-pvz-1",
      tariff_name: "Постамат 5Post",
      delivery_type: "postamat",
      cost: 99,
      days_min: 3 + daysAdd,
      days_max: 5 + daysAdd,
    },
    {
      provider: "fivepost",
      provider_name: "5Post",
      tariff_id: "fp-pvz-2",
      tariff_name: "ПВЗ 5Post",
      delivery_type: "pvz",
      cost: 129,
      days_min: 3 + daysAdd,
      days_max: 5 + daysAdd,
    },
    {
      provider: "pochta",
      provider_name: "Почта России",
      tariff_id: "pochta-1",
      tariff_name: "Посылка 1 класс",
      delivery_type: "post_office",
      cost: 150 + (isCapital ? 0 : 50),
      days_min: 5 + daysAdd,
      days_max: 10 + daysAdd,
    },
    {
      provider: "boxberry",
      provider_name: "Boxberry",
      tariff_id: "bb-pvz-1",
      tariff_name: "ПВЗ Boxberry",
      delivery_type: "pvz",
      cost: 200,
      days_min: 4 + daysAdd,
      days_max: 7 + daysAdd,
    },
    {
      provider: "boxberry",
      provider_name: "Boxberry",
      tariff_id: "bb-courier-1",
      tariff_name: "Курьер Boxberry",
      delivery_type: "courier",
      cost: 350,
      days_min: 3 + daysAdd,
      days_max: 5 + daysAdd,
    },
    {
      provider: "cdek",
      provider_name: "СДЭК",
      tariff_id: "cdek-pvz-1",
      tariff_name: "ПВЗ СДЭК",
      delivery_type: "pvz",
      cost: 250,
      days_min: 3 + daysAdd,
      days_max: 6 + daysAdd,
    },
    {
      provider: "cdek",
      provider_name: "СДЭК",
      tariff_id: "cdek-courier-1",
      tariff_name: "Курьер СДЭК",
      delivery_type: "courier",
      cost: 400,
      days_min: 2 + daysAdd,
      days_max: 4 + daysAdd,
    },
  ];
}

function getMockPickupPoints(cityId: number): PickupPoint[] {
  const isCapital = cityId === 44 || cityId === 137;
  const baseLat = cityId === 44 ? 55.75 : cityId === 137 ? 59.93 : 55.0;
  const baseLng = cityId === 44 ? 37.62 : cityId === 137 ? 30.32 : 73.0;

  const providers: DeliveryProvider[] = ["fivepost", "boxberry", "pochta", "cdek"];
  const points: PickupPoint[] = [];
  const count = isCapital ? 20 : 8;

  for (let i = 0; i < count; i++) {
    const provider = providers[i % providers.length];
    const type = provider === "fivepost" ? "postamat" as const : provider === "pochta" ? "post_office" as const : "pvz" as const;
    points.push({
      id: `mock-${provider}-${i}`,
      provider,
      name: `${PROVIDER_NAMES[provider]} #${i + 1}`,
      address: `ул. Примерная, д. ${i * 5 + 1}`,
      lat: baseLat + (Math.random() - 0.5) * 0.08,
      lng: baseLng + (Math.random() - 0.5) * 0.12,
      work_time: "Пн-Вс: 09:00-21:00",
      type,
      provider_color: PROVIDER_COLORS[provider],
    });
  }

  return points;
}

// =============================================
// API functions
// =============================================

export async function calculateAll(
  toCityId: number,
  weightGrams: number,
  length = 20,
  width = 15,
  height = 10
): Promise<DeliveryOption[]> {
  if (isMockMode()) {
    return getMockTariffs(toCityId).sort((a, b) => a.cost - b.cost);
  }

  try {
    const res = await fetch(`${BASE_URL}/calculator`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        from: { cityId: Number(FROM_CITY_ID) },
        to: { cityId: toCityId },
        weight: weightGrams,
        length,
        width,
        height,
        providers: [
          { providerKey: "fivepost" },
          { providerKey: "boxberry" },
          { providerKey: "pochta" },
          { providerKey: "cdek" },
        ],
      }),
    });

    if (!res.ok) return getMockTariffs(toCityId).sort((a, b) => a.cost - b.cost);

    const data = await res.json();
    const options: DeliveryOption[] = [];

    for (const calc of data.deliveries || []) {
      for (const tariff of calc.tariffs || []) {
        const provider = calc.providerKey as DeliveryProvider;
        options.push({
          provider,
          provider_name: PROVIDER_NAMES[provider] || calc.providerKey,
          tariff_id: String(tariff.tariffId),
          tariff_name: tariff.tariffName || "",
          delivery_type: tariff.deliveryType || "pvz",
          cost: tariff.deliveryCost || 0,
          days_min: tariff.daysMin || 3,
          days_max: tariff.daysMax || 7,
        });
      }
    }

    return options.sort((a, b) => a.cost - b.cost);
  } catch {
    return getMockTariffs(toCityId).sort((a, b) => a.cost - b.cost);
  }
}

export async function getPickupPoints(
  cityId: number,
  providers?: DeliveryProvider[]
): Promise<PickupPoint[]> {
  if (isMockMode()) {
    const all = getMockPickupPoints(cityId);
    return providers ? all.filter((p) => providers.includes(p.provider)) : all;
  }

  try {
    const params = new URLSearchParams({
      cityId: String(cityId),
      limit: "100",
    });
    if (providers) params.set("providerKeys", providers.join(","));

    const res = await fetch(`${BASE_URL}/lists/points?${params}`, {
      headers: headers(),
    });

    if (!res.ok) return getMockPickupPoints(cityId);

    const data = await res.json();
    return (data.rows || []).map((p: Record<string, unknown>) => ({
      id: String(p.id),
      provider: p.providerKey as DeliveryProvider,
      name: p.name || "",
      address: p.address || "",
      lat: Number(p.lat) || 0,
      lng: Number(p.lng) || 0,
      work_time: (p.workTime as string) || "",
      phone: (p.phone as string) || undefined,
      type: (p.type as string) || "pvz",
      provider_color: PROVIDER_COLORS[p.providerKey as DeliveryProvider] || "#666",
    }));
  } catch {
    return getMockPickupPoints(cityId);
  }
}

export async function getCities(query: string): Promise<City[]> {
  if (isMockMode() || query.length < 2) {
    return mockCities.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}/lists/cities?filter=${encodeURIComponent(query)}&limit=15`,
      { headers: headers() }
    );

    if (!res.ok) {
      return mockCities.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const data = await res.json();
    return (data.rows || []).map((c: Record<string, unknown>) => ({
      id: Number(c.id),
      name: String(c.cityName || ""),
      region: String(c.areaName || ""),
    }));
  } catch {
    return mockCities.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function createOrder(
  provider: DeliveryProvider,
  tariffId: string,
  orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    toCityId: number;
    toAddress?: string;
    pickupPointId?: string;
    items: { name: string; quantity: number; price: number; weight: number }[];
  }
): Promise<{ orderId: string; providerNumber: string }> {
  if (isMockMode()) {
    return {
      orderId: `MOCK-${Date.now()}`,
      providerNumber: `${provider.toUpperCase()}-${Math.floor(Math.random() * 1000000)}`,
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        providerKey: provider,
        tariffId: Number(tariffId),
        from: { cityId: Number(FROM_CITY_ID) },
        to: {
          cityId: orderData.toCityId,
          address: orderData.toAddress,
          pointId: orderData.pickupPointId,
        },
        sender: { contactName: "КФХ Ранчо Мушкино", phone: "+79001234567" },
        receiver: {
          contactName: orderData.customerName,
          phone: orderData.customerPhone,
          email: orderData.customerEmail,
        },
        places: [
          {
            weight: orderData.items.reduce((s, i) => s + i.weight * i.quantity, 0),
            items: orderData.items.map((i) => ({
              description: i.name,
              quantity: i.quantity,
              cost: i.price,
              weight: i.weight,
            })),
          },
        ],
      }),
    });

    const data = await res.json();
    return {
      orderId: String(data.orderId || ""),
      providerNumber: String(data.providerNumber || ""),
    };
  } catch {
    return {
      orderId: `ERR-${Date.now()}`,
      providerNumber: "",
    };
  }
}

export async function trackOrder(
  orderId: string
): Promise<{ status: string; history: TrackingEvent[] }> {
  if (isMockMode()) {
    return {
      status: "В пути",
      history: [
        { date: "2026-03-30T10:00:00", status: "Создан", description: "Заказ создан" },
        { date: "2026-03-30T14:00:00", status: "Принят", description: "Принят службой доставки" },
        { date: "2026-03-31T09:00:00", status: "В пути", description: "Отправлен в город назначения" },
      ],
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      headers: headers(),
    });
    const data = await res.json();
    return {
      status: String(data.status || ""),
      history: (data.statuses || []).map((s: Record<string, unknown>) => ({
        date: String(s.date || ""),
        status: String(s.statusName || ""),
        description: String(s.description || ""),
      })),
    };
  } catch {
    return { status: "Неизвестно", history: [] };
  }
}
