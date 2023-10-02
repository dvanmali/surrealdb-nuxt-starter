// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // variables can be overridden see https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    // Surreal
    surrealUrl: 'http://localhost:8000/rpc',
    surrealUser: 'root',
    surrealPass: 'pass',
    // surrealNS: 'ns',
    // surrealDB: 'db',
    // surrealSC: 'sc',
  }
})
