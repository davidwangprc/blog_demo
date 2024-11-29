/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'image.civitai.com',
      'images.unsplash.com',
      'i.imgur.com',
      'picsum.photos',
      'via.placeholder.com'
    ],
  },
  pageExtensions: ['jsx', 'js'],
  async rewrites() {
    return [
      {
        source: '/recipes/:path*',
        destination: '/recipes/:path*',
      },
      {
        source: '/posts/:path*',
        destination: '/posts/:path*',
      }
    ]
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
