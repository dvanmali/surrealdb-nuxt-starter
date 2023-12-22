import { Surreal } from 'surrealdb.js'
import { AnyAuth } from 'surrealdb.js/script/types'

export const surrealdb = new Surreal()

export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig()
    await surrealdb.connect(config.surrealUrl)


    const authVars: AnyAuth = {
      username: config.surrealUsername,
      password: config.surrealPassword,
    }
    if (config.surrealNamespace) authVars.namespace = config.surrealNamespace
    if (config.surrealDatabase) authVars.database = config.surrealDatabase
    if (config.surrealScope) authVars.scope = config.surrealScope
    await surrealdb.signin(authVars)
    
    console.info(`connected as ${config?.surrealUsername}`)
  } catch (error) {
    throw new Error(error as unknown as string)
  }
})
