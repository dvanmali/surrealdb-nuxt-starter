import { Surreal } from 'surrealdb.js'

export const surrealdb = new Surreal()

export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig()
    await surrealdb.connect(config.surrealUrl)

    await surrealdb.signin({
      user: config.surrealUser,
      pass: config.surrealPass,
      ns: config?.surrealNS,
      db: config?.surrealDB,
      sc: config?.surrealSC,
    })
    
    console.info(`connected as ${config?.surrealUser}`)
  } catch (error) {
    throw new Error(error as unknown as string)
  }
})
