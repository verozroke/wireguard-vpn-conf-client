
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
  ],
  css: ['~/assets/css/main.css'],
})