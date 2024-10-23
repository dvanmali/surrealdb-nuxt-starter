import { MySurreal, toAnyAuth } from '~/composables/surrealdb'

export const serverSurreal = new MySurreal(useRuntimeConfig().surrealAuthUrl)

export default defineNitroPlugin(async () => {
  try {
    const {
      surrealAuthUrl: url,
      surrealAuthNamespace: authNamespace,
      surrealAuthDatabase: authDatabase,
      surrealAuthUsername: username,
      surrealAuthPassword: password,
      surrealAuthScope: scope,
      surrealAuthAccess: access,
      surrealAuthAccessVariables: variables,
    } = useRuntimeConfig()
    const auth = toAnyAuth({
      namespace: authNamespace,
      database: authDatabase,
      username,
      password,
      scope,
      access,
      variables,
    })

    const {
      surrealNamespace: namespace,
      surrealDatabase: database,
    } = useRuntimeConfig().public
    const surrealdb = await serverSurreal.surrealdb({
      namespace,
      database,
      auth,
    })

    // THE FOLLOWING IS ONLY USED IN THE CLIENT EXAMPLE
    await surrealdb.query(INIT_DB)
  } catch (error) {
    throw new Error(error as unknown as string)
  }
})

const INIT_DB = `
BEGIN TRANSACTION;
USE NAMESPACE test;
USE DATABASE test;

DEFINE TABLE OVERWRITE User SCHEMAFULL
  PERMISSIONS
    FOR select WHERE (id=$auth.id)
    FOR create FULL
    FOR update WHERE (id=$auth.id)
    FOR delete WHERE (id=$auth.id)
;
DEFINE FIELD OVERWRITE username ON TABLE User TYPE string
  VALUE string::lowercase($value)
  ASSERT string::len($value) > 0 AND string::is::alphanum($value)
;
DEFINE INDEX OVERWRITE username ON TABLE User FIELDS username UNIQUE;
DEFINE FIELD OVERWRITE pass ON TABLE User TYPE string PERMISSIONS NONE;

DEFINE ACCESS OVERWRITE db_user ON DATABASE TYPE RECORD
	SIGNUP ( CREATE User SET username = $username, pass = crypto::argon2::generate($pass) )
	SIGNIN ( SELECT * FROM User WHERE username = $username AND crypto::argon2::compare(pass, $pass) )
	DURATION FOR TOKEN 15m, FOR SESSION 12h;
COMMIT TRANSACTION;
`