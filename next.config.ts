const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'i.pravatar.cc', 'picsum.photos'],
  },
  // Если у вас была webpack конфигурация, закомментируйте её:
  // webpack: (config) => {
  //   return config;
  // },
  
  // Добавьте пустую конфигурацию turbopack
  turbopack: {},
};

module.exports = withPWA(nextConfig);