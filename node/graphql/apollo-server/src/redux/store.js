// @flow
import createDebug from 'debug'
import R from 'ramda'
import Rx from 'rxjs'
import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { createLogicMiddleware } from 'redux-logic'
import configureRootReducer from './reducer'
import rootLogic from './logic'

const debugGraphQL = createDebug('example:graphql')
const debugPubSub = createDebug('example:pubsub')

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(
  initialState: Object,
  apolloClient: Object,
  webClient: Object,
  wsClient: Object
) {
  const rootReducer = configureRootReducer(apolloClient)

  const apolloRequest = (method: string) => (options: Object): Rx.Observable =>
    Rx.Observable.create((observer: Rx.Observer) => {
      Rx.Observable
        .fromPromise(apolloClient[method](R.dissoc('notifyOnNetworkStatusChange', options)))
        .subscribe(
          (resp: Object) => {
            debugGraphQL(`${method} response`, resp)
            observer.next(resp)
            observer.complete()
          },
          (error: Object) => {
            debugGraphQL(`${method} error`, error)
            if (R.path(['graphQLErrors', 0, 'message'], error) === 'Access denied.') {
              webClient.tokenRefresh().subscribe(
                () => {
                  Rx.Observable.fromPromise(apolloClient[method](options)).subscribe(
                    (retryResp: Object) => {
                      debugGraphQL(`${method} retry response`, retryResp)
                      observer.next(retryResp)
                      observer.complete()
                    },
                    (retryError: Object) => {
                      debugGraphQL(`${method} retry error`, retryError)
                      observer.error(retryError)
                    }
                  )
                },
                (refreshError: Object) => {
                  debugGraphQL('token refresh failed', refreshError, error)
                  observer.error(error)
                }
              )
            } else {
              observer.error(error)
            }
          }
        )
    })

  const logicMiddleware = createLogicMiddleware(rootLogic, {
    apollo: {
      query: apolloRequest('query'),
      mutate: apolloRequest('mutate'),
      subscribe(...args: Array<any>) {
        debugPubSub('subscribe', ...args)
        wsClient.subscribe(...args, (errors, result) => {
          if (errors) {
            R.forEach((error: { message: string }) => {
              debugPubSub('error', error.message)
            })
          }
        })
        return apolloClient.subscribe(...args)
      }
    },
    webClient,
    wsClient,
    subscriptions: { todo: null }
  })

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(routerMiddleware(browserHistory)),
      applyMiddleware(apolloClient.middleware()),
      applyMiddleware(logicMiddleware)
    )
  )
}
