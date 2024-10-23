// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-23',

  devtools: { enabled: true },

  // variables can be overridden see https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    // Surreal
    surrealAuthUrl: 'ws://localhost:8000/rpc',
    surrealAuthUsername: 'root',
    surrealAuthPassword: 'pass',
    // surrealAuthNamespace: undefined,
    // surrealAuthDatabase: undefined,
    // surrealAuthScope: undefined,
    // surrealAuthAccess: undefined,
    // surrealAuthAccessVariables: undefined,
    public: {
      surrealUrl: 'http://localhost:8000/rpc',
      surrealNamespace: 'test',
      surrealDatabase: 'test',
      surrealAccess: 'db_user'
    },
  },
})
