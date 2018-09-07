// @flow
import createDebug from 'debug'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import R from 'ramda'
import request from 'request-promise-native'
import oauth2 from 'simple-oauth2'
import digest from './digest'
import env from './env'
import { getUser, getOrCreateUser } from './store'

const debugAuth = createDebug('example:auth')

function devHeader(ctx: Object, header: string, def: string): string {
  if (env('NODE_ENV', 'production') === 'production') {
    return def
  }
  return ctx.request.get(header) || def
}

function generateTokens(user: User, ctx: Object): { accessToken: string, refreshToken: string } {
  const accessExp = devHeader(
    ctx,
    'X-ACCESS-TOKEN-EXPIRES-IN',
    env('ACCESS_TOKEN_EXPIRES_IN', '2h')
  )
  const refreshExp = devHeader(
    ctx,
    'X-REFRESH-TOKEN-EXPIRES-IN',
    env('REFRESH_TOKEN_EXPIRES_IN', '60d')
  )
  debugAuth('accessExp', accessExp)
  debugAuth('refreshExp', refreshExp)

  // call `parseInt(numStr)` if `numStr` is a minus number because
  // ms('numStr') returns undefined in that case
  // (minus numbers are required by tests)
  const accessToken = jwt.sign(
    {
      user: R.omit(['password'], user),
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + (ms(accessExp) || parseInt(accessExp, 10))) / 1000)
    },
    env('AUTH_SECRET')
  )
  const refreshToken = jwt.sign(
    {
      user: R.omit(['password'], user),
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + (ms(refreshExp) || parseInt(refreshExp, 10))) / 1000)
    },
    env('AUTH_SECRET')
  )
  return { accessToken, refreshToken }
}

export async function jwtUser(ctx: Object, next: () => {}) {
  try {
    const { user } = jwt.verify(
      ctx.request.header.authorization ? ctx.request.header.authorization.split(' ')[1] : '',
      env('AUTH_SECRET')
    )
    ctx.state.user = user
  } catch (error) {
    debugAuth('auth failed', error)
  }
  await next()
}

export async function authenticated(ctx: Object, next: () => {}) {
  try {
    const { user } = jwt.verify(
      ctx.request.header.authorization ? ctx.request.header.authorization.split(' ')[1] : '',
      env('AUTH_SECRET')
    )
    ctx.state.user = user
    await next()
  } catch (error) {
    ctx.throw(401, 'Access denied.')
  }
}

export async function signin(ctx: Object) {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.throw(401, 'Must provide username and password.')
  }
  const user = getUser(username)
  const storedPassword = user ? user.password : null
  if (digest(password) !== storedPassword) {
    ctx.throw(401, 'Username or password incorrect.')
  }
  ctx.body = generateTokens(user, ctx)
}

export async function signout(ctx: Object) {
  ctx.body = {}
}

export async function tokenRefresh(ctx: Object) {
  const { refreshToken } = ctx.request.body
  try {
    const { user } = jwt.verify(refreshToken, env('AUTH_SECRET'))
    const tokens = generateTokens(user, ctx)
    ctx.body = tokens
    ctx.status = 201
  } catch (error) {
    ctx.throw(401, 'Access denied.')
  }
}

const githubAuth = oauth2.create({
  client: {
    id: env('GITHUB_CLIENT_ID'),
    secret: env('GITHUB_CLIENT_SECRET')
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
})

export function githubAuthRedirect(ctx: Object) {
  const redirect = ctx.params.redirect || ''
  const url = githubAuth.authorizationCode.authorizeURL({
    redirect_uri: `http://${env('SERVER_HOST')}:${env('PROXY_PORT')}/authcb/github/${redirect}`,
    scope: 'notifications',
    state: '3(#0/!~'
  })
  ctx.body = { url }
}

export async function githubAuthCB(ctx: Object) {
  const { code } = ctx.request.body
  const tokenConfig = { code }

  try {
    const result = await githubAuth.authorizationCode.getToken(tokenConfig)
    if (result.error) {
      debugAuth('Authentication error', result.error, result.error_description)
      ctx.throw(401, 'Authentication failed.')
    }
    const token = result.access_token
    const checkResult = await request.post(
      `https://${env('GITHUB_CLIENT_ID')}:${env('GITHUB_CLIENT_SECRET')}@` +
        `api.github.com/applications/${env('GITHUB_CLIENT_ID')}/tokens/${token}`,
      {
        headers: {
          'User-Agent': 'request'
        },
        json: true
      }
    )
    const username = checkResult.user.login
    const user = getOrCreateUser(username, 'github')
    ctx.body = generateTokens(user, ctx)
  } catch (error) {
    debugAuth('Authentication error', error)
    ctx.throw(401, 'Authentication failed.')
  }
}
