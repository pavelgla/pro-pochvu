export type DeliveryProvider = "fivepost" | "boxberry" | "pochta" | "cdek";

export type DeliveryType = "pvz" | "courier" | "postamat" | "post_office";

export type DeliveryOption = {
  provider: DeliveryProvider;
  provider_name: string;
  tariff_id: string;
  tariff_name: string;
  delivery_type: DeliveryType;
  cost: number;
  days_min: number;
  days_max: number;
};

export type PickupPoint = {
  id: string;
  provider: DeliveryProvider;
  name: string;
  address: string;
  lat: number;
  lng: number;
  work_time: string;
  phone?: string;
  type: DeliveryType;
  provider_color: string;
};

export type City = {
  id: number;
  name: string;
  region?: string;
};

export type DeliveryAddress = {
  city: string;
  city_id: number;
  street: string;
  house: string;
  apartment?: string;
  postal_code?: string;
};

export type TrackingEvent = {
  date: string;
  status: string;
  description: string;
};

export const PROVIDER_NAMES: Record<DeliveryProvider, string> = {
  fivepost: "5Post",
  boxberry: "Boxberry",
  pochta: "Почта России",
  cdek: "СДЭК",
};

export const PROVIDER_COLORS: Record<DeliveryProvider, string> = {
  fivepost: "#FF6B35",
  boxberry: "#E4002B",
  pochta: "#003DA5",
  cdek: "#00B33C",
};
