import { defineConfig } from 'next';

export default defineConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-image-domain.com'], // Replace with your image domain if needed
  },
  env: {
    CUSTOM_ENV_VARIABLE: process.env.CUSTOM_ENV_VARIABLE, // Add any custom environment variables here
  },
});