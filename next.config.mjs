/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.wbbasket.ru' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // 301, а не permanent:true — Next отдаёт на permanent 308, а Яндекс
  // надёжно склеивает именно 301 (старый /product/kolyshki-skoby-silikon
  // висел в индексе месяцами, пока стоял 308).
  async redirects() {
    return [
      {
        // old slug predates the "Колышки-скобы" -> "Набор горшков прозрачных" rename
        source: '/product/kolyshki-skoby-silikon',
        destination: '/product/gorshki-prozrachnye-fitomodul',
        statusCode: 301,
      },
      // Grunt SKUs consolidated into grunt-ecokon-20l (deactivated 2026-05 / 2026-08).
      // Both pages had organic traffic and were dropped by Yandex as HTTP_ERROR;
      // grunt-ecokon-organicheskiy was Google's top landing for "грунт эко конь".
      {
        source: '/product/grunt-ecokon-organicheskiy',
        destination: '/product/grunt-ecokon-20l',
        statusCode: 301,
      },
      {
        source: '/product/grunt-ecokon-ovoshchi',
        destination: '/product/grunt-ecokon-20l',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
