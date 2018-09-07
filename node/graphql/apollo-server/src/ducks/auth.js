// @flow
import createDebug from 'debug'
import jwtDecode from 'jwt-decode'
import R from 'ramda'
import { browserHistory } from 'react-router'
import { createLogic } from 'redux-logic'
import createReducer from '../redux/createReducer'
import { errorObject } from '../utils'

const debugAuth = createDebug('example:auth')

// Actions

const SIGNIN = 'SIGNIN'
const SIGNIN_SUCCEEDED = 'SIGNIN_SUCCEEDED'
const SIGNIN_FAILED = 'SIGNIN_FAILED'
const SIGNIN_RESUME = 'SIGNIN_RESUME'
const SIGNIN_RESUME_SUCCEEDED = 'SIGNIN_RESUME_SUCCEEDED'
const SIGNIN_RESUME_FAILED = 'SIGNIN_RESUME_FAILED'
const SIGNOUT = 'SIGNOUT'
const AUTH_ERROR_CLEAR = 'AUTH_ERROR_CLEAR'
const GITHUB_SIGNIN = 'GITHUB_SIGNIN'
const GITHUB_SIGNIN_SUCCEEDED = 'GITHUB_SIGNIN_SUCCEEDED'
const GITHUB_SIGNIN_FAILED = 'GITHUB_SIGNIN_FAILED'
const AUTH_CALLBACK = 'AUTH_CALLBACK'

export function signin(username: string, password: string): Action {
  return {
    type: SIGNIN,
    payload: { username, password }
  }
}

export function signinSucceeded(user: User): Action {
  return {
    type: SIGNIN_SUCCEEDED,
    payload: { user }
  }
}

export function signinFailed(error: ErrorType): Action {
  return {
    type: SIGNIN_FAILED,
    payload: { error }
  }
}

export function signout(): Action {
  return {
    type: SIGNOUT
  }
}

export function signinResume(): Action {
  return {
    type: SIGNIN_RESUME
  }
}

export function signinResumeSucceeded(user: User): Action {
  return {
    type: SIGNIN_RESUME_SUCCEEDED,
    payload: { user }
  }
}

export function signinResumeFailed(): Action {
  return {
    type: SIGNIN_RESUME_FAILED
  }
}

export function authErrorClear(): Action {
  return {
    type: AUTH_ERROR_CLEAR
  }
}

export function githubSignin(redirect: ?string): Action {
  return {
    type: GITHUB_SIGNIN,
    payload: { redirect }
  }
}

export function githubSigninSucceeded(): Action {
  return {
    type: GITHUB_SIGNIN_SUCCEEDED
  }
}

export function githubSigninFailed(error: ErrorType): Action {
  return {
    type: GITHUB_SIGNIN_FAILED,
    payload: { error }
  }
}

export function authCallback(service: string, code: string, redirect: ?string): Action {
  return {
    type: AUTH_CALLBACK,
    payload: { service, code, redirect }
  }
}

// Types

type AuthState = {
  username: ?string,
  admin: boolean,
  authenticating: boolean,
  error: ?ErrorType
}

// Reducer

const initialState: AuthState = {
  username: null,
  admin: false,
  authenticating: false,
  error: null
}

export const authReducer = createReducer(
  {
    [SIGNIN]: (state: AuthState): AuthState =>
      R.merge(state, {
        authenticating: true,
        error: null
      }),

    [SIGNIN_SUCCEEDED]: (state: AuthState, { payload: { user } }): AuthState =>
      R.merge(state, {
        authenticated: false,
        username: user.username,
        admin: user.admin
      }),

    [SIGNIN_FAILED]: (state: AuthState, { payload: { error } }): AuthState =>
      R.merge(state, {
        authenticating: false,
        error
      }),

    [SIGNIN_RESUME]: (state: AuthState): AuthState => state,

    [SIGNIN_RESUME_SUCCEEDED]: (state: AuthState, { payload: { user } }): AuthState =>
      R.merge(state, {
        authenticating: false,
        username: user.username,
        admin: user.admin
      }),

    [SIGNIN_RESUME_FAILED]: (state: AuthState): AuthState => state,

    [SIGNOUT]: (state: AuthState): AuthState =>
      R.merge(state, {
        authenticating: false,
        username: null,
        admin: false
      }),

    [AUTH_ERROR_CLEAR]: (state: AuthState): AuthState =>
      R.merge(state, {
        error: null
      }),

    [GITHUB_SIGNIN]: (state: AuthState): AuthState =>
      R.merge(state, {
        authenticating: true,
        error: null
      }),

    [GITHUB_SIGNIN_SUCCEEDED]: (state: AuthState): AuthState => state,

    [GITHUB_SIGNIN_FAILED]: (state: AuthState, { payload: { error } }): AuthState =>
      R.merge(state, {
        authenticating: false,
        error
      }),

    [AUTH_CALLBACK]: (state: AuthState): AuthState =>
      R.merge(state, {
        authenticating: true,
        error: null
      })
  },
  initialState
)

// Logic

export const signinLogic = createLogic({
  type: SIGNIN,
  processOptions: {
    dispatchReturn: true,
    successType: signinSucceeded,
    failType: signinFailed
  },

  process({ action, webClient, wsClient }) {
    const { username, password } = action.payload
    const body = { username, password }
    const headers = { 'Content-Type': 'application/json' }
    return webClient
      .post('/auth/signin', body, headers, false)
      .map(({ response: { accessToken, refreshToken } }) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        const { user } = jwtDecode(accessToken)
        debugAuth('wsClient.status', wsClient.status)
        wsClient.connectionParams.authToken = accessToken
        if (wsClient.status === WebSocket.CONNECTING) {
          wsClient.connectionParams.reconnect = true
        } else {
          wsClient.close()
        }
        return user
      })
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})

export const signoutLogic = createLogic({
  type: SIGNOUT,

  process({ webClient, wsClient }) {
    const headers = { 'Content-Type': 'application/json' }
    webClient.post('/auth/signout', {}, headers).subscribe()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    wsClient.unsubscribeAll()
    wsClient.connectionParams.authToken = null
    wsClient.close()
  }
})

export const signinResumeLogic = createLogic({
  type: SIGNIN_RESUME,

  process({ webClient }, dispatch: Dispatch, done: () => void) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      const { user } = jwtDecode(accessToken)
      dispatch(signinResumeSucceeded(user))
    } else {
      dispatch(signinResumeFailed())
    }
    done()
  }
})

export const autoSignoutLogic = createLogic({
  type: new RegExp('_FAILED$'),

  process({ action }, dispatch: Dispatch, done: () => void) {
    if (
      R.path(['payload', 'status'], action) === 401 ||
      R.path(['graphQLErrors', 0, 'message'], action.payload) === 'Access denied.'
    ) {
      dispatch(signout())
    }
    done()
  }
})

export const githubSigninLogic = createLogic({
  type: GITHUB_SIGNIN,
  processOptions: {
    dispatchReturn: true,
    successType: githubSigninSucceeded,
    failType: githubSigninFailed
  },

  process({ action, webClient }) {
    const headers = { 'Content-Type': 'application/json' }
    return webClient
      .post(`/auth/github/${action.payload.redirect || ''}`, {}, headers, false)
      .do(({ response: { url } }) => {
        window.location = url
      })
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})

export const authCallbackLogic = createLogic({
  type: AUTH_CALLBACK,
  processOptions: {
    dispatchReturn: true,
    successType: signinSucceeded,
    failType: signinFailed
  },

  process({ action, webClient, wsClient }) {
    const { service, code, redirect } = action.payload
    const headers = { 'Content-Type': 'application/json' }
    const body = { code }
    return webClient
      .post(`/auth/cb/${service}`, body, headers, false)
      .map(({ response: { accessToken, refreshToken } }) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        const { user } = jwtDecode(accessToken)
        debugAuth('wsClient.status', wsClient.status)
        wsClient.connectionParams.authToken = accessToken
        if (wsClient.status === WebSocket.CONNECTING) {
          wsClient.connectionParams.reconnect = true
        } else {
          wsClient.close()
        }
        if (redirect) {
          browserHistory.replace(redirect)
        } else {
          browserHistory.replace('')
        }
        return user
      })
      .catch((error: Object) => {
        browserHistory.replace('/signin')
        throw errorObject(error)
      })
  }
})
