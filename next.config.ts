import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
      '.md'
    ],
    // Dökümanda bahsedilen alias veya kural eklemeleri buraya gelir
  },
  
  images: {
    // 1. En modern formatlar (AVIF öncelikli)
    formats: ['image/avif', 'image/webp'],

    // 2. Kırılım noktaları (Tailwind 4 / Modern Ekranlar)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // 3. Küçük boyutlu görseller
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // 4. Güvenlik
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram.fist1-1.fna.fbcdn.net',
      },
    ],

    // 5. Cache & Performans
    minimumCacheTTL: 60,

    // NOT: 'qualities' standart NextConfig tipinde yoktur. 
    // Eğer custom bir loader kullanmıyorsan bunu bileşen seviyesinde yapmalısın.
    // Ama illa burada tutacaksan TS'i susturarak ekleyebiliriz:
    // @ts-ignore
    qualities: [70, 75, 80, 85, 90, 95, 100],
  },

  // Tailwind 4 ve Modern CSS optimizasyonları için
  bundlePagesRouterDependencies: true,
  transpilePackages: ['gray-matter'],

  // Webpack'i açık tutarak Turbopack'in 'panic' riskini azaltıyoruz
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;