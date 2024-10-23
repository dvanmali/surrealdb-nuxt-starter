import { H3Event } from 'h3'
import { serverSurreal } from '../plugins/surrealdb'

const helloWorldQuery = `RETURN "Hello World From SurrealDB";`

export default defineEventHandler<any>(async (event: H3Event) => {
  try {
    const surrealdb = await serverSurreal.surrealdb()
    const [res] = await surrealdb.query(helloWorldQuery)
    console.log('Server:', res)
    return res
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error as unknown as string)
  }
})
