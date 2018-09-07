// @flow

function createReducer(
  handlers: { [string]: (Object, Object) => Object } = {},
  initialState: Object = {}
): (Object, Object) => Object {
  function reducer(state: Object = initialState, action: Object = {}): Object {
    if (action && action.type && handlers[action.type]) {
      return handlers[action.type](state, action)
    }
    return state
  }
  return reducer
}

export default createReducer
