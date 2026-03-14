/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Es vital que el basePath coincida con tu repositorio para que el movimiento funcione
  basePath: process.env.NODE_ENV === 'production' ? '/Leiham-company' : '',
};

module.exports = nextConfig;
