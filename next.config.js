const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'firebase-images', expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'cloudinary-images', expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /\/api\/products.*/,
      handler: 'NetworkFirst',
      options: { cacheName: 'products-api', expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 } },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/dashboard', permanent: false },
      { source: '/vendor', destination: '/vendor/dashboard', permanent: false },
    ]
  },
  experimental: { serverActions: { allowedOrigins: ['sokoyetu.co.ke', 'www.sokoyetu.co.ke'] } },
}

module.exports = withPWA(nextConfig)
