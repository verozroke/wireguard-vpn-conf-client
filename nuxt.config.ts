export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  pages: true,
  modules: [
    '@pinia/nuxt',
    'nuxtjs-naive-ui',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    }
  },
  devServer: {
    host: '127.0.0.1'
  }
})