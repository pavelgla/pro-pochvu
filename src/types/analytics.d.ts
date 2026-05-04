export {};

declare global {
  interface Window {
    /**
     * Yandex Metrika counter API.
     * Loaded asynchronously by `<Metrika />` (src/components/analytics/Metrika.tsx).
     * May be undefined when the user blocks the script (adblock, no cookie consent).
     */
    ym?: (
      counterId: number,
      action: string,
      ...args: unknown[]
    ) => void;

    /**
     * Yandex Metrika ecommerce queue. Pushed objects are read by the counter via
     * the `ecommerce: "dataLayer"` init option.
     */
    dataLayer?: Record<string, unknown>[];
  }
}
