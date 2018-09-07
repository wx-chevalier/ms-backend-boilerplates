import R from 'ramda'

export const keyLength = R.compose(R.length, R.keys)

export const errorMessage = (error: Object) =>
  R.pathOr(error.message, ['xhr', 'response', 'error', 'message'], error)

export const errorObject = (error: Object): ErrorType => ({
  message: errorMessage(error),
  status: R.propOr(null, 'status', error)
})
