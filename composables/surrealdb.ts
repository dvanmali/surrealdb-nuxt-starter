import type { AnyAuth, Token } from 'surrealdb'
import { Surreal, ConnectionStatus } from 'surrealdb'

export interface AnyAuthInput {
  username: string
  password: string
  namespace: string
  database: string
  scope: string
  access: string
  variables: {
		ns?: never;
		db?: never;
		ac?: never;
		[K: string]: unknown;
	}
}

export class MySurreal {
  // A single instantiation of a surreal connection
  private _surrealdb: Surreal | undefined
  private _url: Parameters<InstanceType<typeof Surreal>['connect']>[0]
  private _opts: Parameters<InstanceType<typeof Surreal>['connect']>[1]

  constructor(
    url: Parameters<InstanceType<typeof Surreal>['connect']>[0]
  ) {
    this._url = url
  }

  async surrealdb(opts?: Parameters<InstanceType<typeof Surreal>['connect']>[1]): Promise<Surreal> {
    // Init Surreal
    if (!this._surrealdb) this._surrealdb = new Surreal()
    if (opts) this._opts = opts

    if (this._surrealdb.status === ConnectionStatus.Connected) {
      return this._surrealdb
    } else if (this._surrealdb.status === ConnectionStatus.Disconnected) {
      try {
        if (!this._url) throw new Error('required url')

        // Connect as a database user
        await this._surrealdb.connect(this._url, this._opts)
        this._surrealdb.emitter.subscribe('disconnected', () => {
          this._handleDisconnect(this._url, this._opts)
        })
        if (process.env.NODE_ENV === 'development') {
          const str = toConnectionString(this._surrealdb.status, this._opts)
          console.info(str)
        }
      } catch (error) {
        if (error instanceof Error) throw error
        throw new Error(error as unknown as string)
      }
    }
    return this._surrealdb
  }

  /**
   * Handles a disconnection with the database with exponential backoff
   * @param url - the database url
   * @param auth - auth credentials
   * @param {number} [reconnectDelay = 1000] - initial delay amount
   * @param {number} [maxRetries = 5] - maximum number of retries
   * @param {number} [retry = 0]  - current retry
   */
  _handleDisconnect(
    url: Parameters<InstanceType<typeof Surreal>['connect']>[0],
    opts?: Parameters<InstanceType<typeof Surreal>['connect']>[1],
    reconnectDelay: number = 1000,
    maxRetries: number = 5,
    retry: number = 0,
  ) {
    if (retry >= maxRetries) {
      // console.error('Shutting down.')
      process.exit(1) // Graceful exit or handle gracefully in a production environment.
    }

    retry++
    // console.log(`Reconnect in ${reconnectDelay}ms...`)
    setTimeout(async () => {
      try {
        // Connect as a database user
        await this._surrealdb?.connect(url, opts)
        // console.log('reconnected')
      } catch {
        // console.error('Reconnection attempt failed')
        // Recursively try to reconnect.
        this._handleDisconnect(url, opts, reconnectDelay * 2, maxRetries, retry)
      }
    }, reconnectDelay)
  }
}

/**
 * Converts environment variables to an AnyAuth type
 * to connect with the database
 * @param param0 - environment variables
 */
export function toAnyAuth({
  username,
  password,
  namespace,
  database,
  scope,
  access,
  variables,
}: AnyAuthInput) {
  let auth: AnyAuth
  if (username && password && namespace && database) {
    auth = {
      database,
      namespace,
      username,
      password,
    }
  } else if (username && password && namespace) {
    auth = {
      namespace,
      username,
      password,
    }
  } else if (username && password) {
    auth = {
      username,
      password,
    }
  } else if (access && variables) {
    auth = {
      namespace,
      database,
      access,
      variables,
    }
  } else if (scope) {
    auth = {
      namespace,
      database,
      username,
      password,
      scope,
    }
  } else {
    throw new Error('unsupported any auth configuration')
  }
  return auth
}

export function toConnectionString(
  status: ConnectionStatus,
  opts?: Parameters<InstanceType<typeof Surreal>['connect']>[1]
) {
  let str = `${status}`
  const auth = opts?.auth
  
  if (auth && typeof auth !== 'string') {
    if ('username' in auth) {
      str += ` as ${auth.username}`
    }
    if ('database' in auth && 'namespace' in auth) {
      str += ` for ${auth.namespace} ${auth.database}`
    } else if ('namespace' in auth) {
      str += ` for ${auth.namespace}`
    } else if ('database' in auth) {
      str += ` for ${auth.database}`
    }
  }
  return str
}
