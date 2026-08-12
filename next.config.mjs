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
  async redirects() {
    return [
      {
        // old slug predates the "Колышки-скобы" -> "Набор горшков прозрачных" rename
        source: '/product/kolyshki-skoby-silikon',
        destination: '/product/gorshki-prozrachnye-fitomodul',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
