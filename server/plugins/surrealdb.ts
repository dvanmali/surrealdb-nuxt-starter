import { Surreal } from 'surrealdb.js'

type SignInParams = Parameters<Surreal["signin"]>
type SignInParam = SignInParams[0]
interface SurrealAuth {
  username: string
  password: string
  namespace?: string
  database?: string
  scope?: string
}

export const surrealdb = new Surreal()

export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig()
    await surrealdb.connect(config.surrealUrl)

    const authVars: SurrealAuth = {
      username: config.surrealUsername,
      password: config.surrealPassword,
    }
    if (config.surrealNamespace) authVars.namespace = config.surrealNamespace
    if (config.surrealDatabase) authVars.database = config.surrealDatabase
    if (config.surrealScope) authVars.scope = config.surrealScope
    await surrealdb.signin(authVars as SignInParam)
    
    console.info(`connected as ${config?.surrealUsername}`)
  } catch (error) {
    throw new Error(error as unknown as string)
  }
})
