// @flow
import createDebug from 'debug'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import { execute, subscribe } from 'graphql'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import R from 'ramda'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { executableSchema, pubsub, TODO_UPDATED_TOPIC } from './executableSchema'
import queryMap from '../src/extracted_queries.json'
import errorHandler from './error'
import env from './env'
import { todos } from './store'
import { signin, signout, tokenRefresh, githubAuthRedirect, githubAuthCB } from './auth'

const debugPubSub = createDebug('example:pubsub')

const app = new Koa()

app.proxy = true

// Logger, parser and error handler

app.use(logger())
app.use(bodyParser())
app.use(errorHandler)

// GraphQL persisted query

app.use(async (ctx: Object, next: () => Promise<void>) => {
  if (ctx.path === '/graphql' && ctx.request.body.id) {
    const invertedMap = R.invertObj(queryMap)
    ctx.request.body.query = invertedMap[ctx.request.body.id]
  }
  await next()
})

// Routes

const router = Router()

router.post('/auth/signin', signin)
router.post('/auth/signout', signout)
router.post('/auth/refresh', tokenRefresh)

router.post('/auth/github', githubAuthRedirect)
router.post('/auth/github/:redirect', githubAuthRedirect)
router.post('/auth/cb/github', githubAuthCB)

router.post(
  '/graphql',
  graphqlKoa(ctx => ({
    schema: executableSchema,
    context: { ctx }
  }))
)

if (process.env !== 'production') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

app.use(router.routes())
app.use(router.allowedMethods())

// Launching the server

const server = app.listen(parseInt(env('SERVER_PORT'), 10), env('SERVER_HOST'))

// Setup the subscription server

SubscriptionServer.create(
  {
    schema: executableSchema,
    execute,
    subscribe,
    onConnect: (connectionParams: Object, socket: WebSocket) => {
      try {
        const { user } = jwt.verify(connectionParams.authToken, env('AUTH_SECRET'))
        const jwtData = jwtDecode(connectionParams.authToken)
        const timeout = jwtData.exp * 1000 - Date.now()
        debugPubSub('authenticated', jwtData)
        debugPubSub('set connection timeout', timeout)
        setTimeout(() => {
          // let the client reconnect
          socket.close()
        }, timeout)
        return { subscriptionUser: user }
      } catch (error) {
        debugPubSub('authentication failed', error.message)
        return { subscriptionUser: null }
      }
    },
    onOperation(message: string, params: Object) {
      setTimeout(() => {
        R.forEach((todo: Todo) => {
          pubsub.publish(TODO_UPDATED_TOPIC, { todoUpdated: todo })
          debugPubSub('publish', TODO_UPDATED_TOPIC, todo)
        }, todos)
      }, 0)
      return Promise.resolve(params)
    }
  },
  {
    server,
    path: '/graphql-sock'
  }
)
