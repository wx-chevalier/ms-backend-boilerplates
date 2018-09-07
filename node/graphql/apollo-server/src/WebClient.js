// @flow
import R from 'ramda'
import Rx from 'rxjs'
import createDebug from 'debug'

class WebClient {
  ajax: (...rest: Array<any>) => Rx.Observable
  debugAuth: (...rest: Array<any>) => void

  constructor() {
    this.ajax = Rx.Observable.ajax
    this.debugAuth = createDebug('example:auth')
  }

  request(method: (...rest: Array<any>) => Rx.Observable, args: Array<any>, auth: ?boolean) {
    const headers = args[args.length - 1] || {}

    const devHeaders = localStorage.getItem('devHeaders')
    if (devHeaders) {
      R.forEachObjIndexed((value: any, key: string) => {
        headers[key] = value
      }, JSON.parse(devHeaders))
    }

    const authEnabled = auth === undefined || auth
    if (authEnabled) {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
      }
    }

    return method(...[...args.slice(0, args.length - 1), headers])
  }

  tokenRefresh() {
    this.debugAuth('refreshing token')
    return Rx.Observable.create((observer: Rx.Observer) => {
      const refreshToken = localStorage.getItem('refreshToken') || ''
      this.post('/auth/refresh', { refreshToken }, null, false).subscribe(
        (result: Object) => {
          this.debugAuth('token refreshed')
          const { accessToken } = result.response
          localStorage.setItem('accessToken', accessToken)
          observer.next(result.response)
        },
        (error: Object) => {
          this.debugAuth(
            'refreshing token failed',
            R.pathOr(error, ['xhr', 'response', 'error'], error)
          )
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          observer.error(error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }

  get(url: string, headers: ?Object, auth: ?boolean) {
    return this.request(this.ajax.get, [url, headers], auth)
  }

  post(url: string, body: ?Object | ?FormData, headers: ?Object, auth: ?boolean) {
    return this.request(this.ajax.post, [url, body, headers], auth)
  }

  delete(url: string, headers: ?Object, auth: ?boolean) {
    return this.request(this.ajax.delete, [url, headers], auth)
  }

  put(url: string, body: ?Object | ?FormData, headers: ?Object, auth: ?boolean) {
    return this.request(this.ajax.put, [url, body, headers], auth)
  }

  ajax(...args: Array<any>) {
    return this.ajax(...args)
  }
}

export default WebClient
