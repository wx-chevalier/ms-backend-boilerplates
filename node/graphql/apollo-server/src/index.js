// @flow
import createDebug from 'debug'
import jwtDecode from 'jwt-decode'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { replace, syncHistoryWithStore } from 'react-router-redux'
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history3/locationHelper'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import WebClient from './WebClient'
import App from './containers/App'
import HomeApp from './containers/Home/HomeApp'
import SigninApp from './containers/Signin/SigninApp'
import TodoApp from './containers/Todo/TodoApp'
import RemoteTodoApp from './containers/RemoteTodo/RemoteTodoApp'
import PubSubTodoApp from './containers/PubSubTodo/PubSubTodoApp'
import AuthCallback from './containers/Signin/AuthCallback'
import NotFound from './components/NotFound'
import configureStore from './redux/store'
import createApolloClient from './apollo/create-apollo-client'
import getNetworkInterface from './apollo/transport'
import { signinResume, signout } from './ducks/auth'
import config from './config.json'

import './index.css'

const debugPubSub = createDebug('example:pubsub')

const wsClient = new SubscriptionClient(config.wsURL, {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem('accessToken'),
    reconnect: false
  }
})

const webClient = new WebClient()

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  getNetworkInterface(config.graphqlURL),
  wsClient
)

networkInterfaceWithSubscriptions.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }
      const token = localStorage.getItem('accessToken')
      req.options.headers.authorization = token ? `Bearer ${token}` : null
      next()
    }
  }
])

const apolloClient = createApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

const store = configureStore({}, apolloClient, webClient, wsClient)
const history = syncHistoryWithStore(browserHistory, store)
const locationHelper = locationHelperBuilder({})

wsClient.on('connecting', () => {
  debugPubSub('connecting', Date.now())
})
wsClient.on('connected', () => {
  debugPubSub('connected', Date.now())
  if (wsClient.connectionParams.reconnect) {
    wsClient.connectionParams.reconnect = false
    wsClient.close()
  }
})
wsClient.on('reconnecting', () => {
  debugPubSub('reconnecting', Date.now())
})
wsClient.on('reconnected', () => {
  debugPubSub('reconnected', Date.now())
  if (wsClient.connectionParams.reconnect) {
    wsClient.connectionParams.reconnect = false
    wsClient.close()
  }
})
wsClient.on('disconnected', async () => {
  debugPubSub('disconnected', Date.now())
  const { authToken } = wsClient.connectionParams
  if (authToken) {
    const jwtData = jwtDecode(authToken)
    debugPubSub('exp', jwtData.exp * 1000)
    if (jwtData.exp * 1000 < Date.now()) {
      // token expired
      webClient.tokenRefresh().subscribe({
        next() {
          const accessToken = localStorage.getItem('accessToken')
          wsClient.connectionParams.authToken = accessToken
          debugPubSub('wsClient.status', wsClient.status)
          if (wsClient.status === WebSocket.OPEN) {
            wsClient.close()
          } else if (wsClient.status === WebSocket.CONNECTING) {
            wsClient.connectionParams.reconnect = true
          }
        },
        error(error: ErrorType) {
          store.dispatch(signout())
        }
      })
    }
  }
})

const userIsAuthenticated = connectedReduxRedirect({
  redirectPath: '/signin',
  allowRedirectBack: true,
  authenticatedSelector: state => state.auth.username !== null,
  redirectAction: replace,
  wrapperDisplayName: 'userIsAuthenticated'
})

const userIsNotAuthenticated = connectedReduxRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.username === null,
  redirectAction: replace,
  wrapperDisplayName: 'userIsNotAuthenticated'
})

store.dispatch(signinResume())

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={HomeApp} />
        <Route path="signin" component={userIsNotAuthenticated(SigninApp)} />
        <Route path="todo" component={userIsAuthenticated(TodoApp)} />
        <Route path="todo-remote" component={userIsAuthenticated(RemoteTodoApp)} />
        <Route path="todo-pubsub" component={userIsAuthenticated(PubSubTodoApp)} />
        <Route path="authcb/(:service)(/:redirect)" component={AuthCallback} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
