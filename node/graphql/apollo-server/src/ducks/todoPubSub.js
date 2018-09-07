// @flow
import createDebug from 'debug'
import R from 'ramda'
import { createLogic } from 'redux-logic'
import createReducer from '../redux/createReducer'
import { errorObject } from '../utils'
import TODO_UPDATED_SUBSCRIPTION from '../graphql/todoUpdatedSubscription.graphql'
import ADD_TODO_MUTATION from '../graphql/addTodoMutation.graphql'
import TOGGLE_TODO_MUTATION from '../graphql/toggleTodoMutation.graphql'

const debugPubSub = createDebug('example:pubsub')

// Actions

export const TODO_PUBSUB_SUBSCRIBE = 'TODO_PUBSUB_SUBSCRIBE'
export const TODO_PUBSUB_SUBSCRIBE_SUCCEEDED = 'TODO_PUBSUB_SUBSCRIBE_SUCCEEDED'
export const TODO_PUBSUB_UNSUBSCRIBE = 'TODO_PUBSUB_UNSUBSCRIBE'
export const TODO_PUBSUB_RECEIVE_SUCCEEDED = 'TODO_PUBSUB_RECEIVE_SUCCEEDED'
export const TODO_PUBSUB_RECEIVE_FAILED = 'TODO_PUBSUB_RECEIVE_FAILED'
export const TODO_PUBSUB_CREATE = 'TODO_PUBSUB_CREATE'
export const TODO_PUBSUB_CREATE_SUCCEEDED = 'TODO_PUBSUB_CREATE_SUCCEEDED'
export const TODO_PUBSUB_CREATE_FAILED = 'TODO_PUBSUB_CREATE_FAILED'
export const TODO_PUBSUB_TOGGLE = 'TODO_PUBSUB_TOGGLE'
export const TODO_PUBSUB_TOGGLE_SUCCEEDED = 'TODO_PUBSUB_TOGGLE_SUCCEEDED'
export const TODO_PUBSUB_TOGGLE_FAILED = 'TODO_PUBSUB_TOGGLE_FAILED'

export function todoPubSubSubscribe(): Action {
  return {
    type: TODO_PUBSUB_SUBSCRIBE
  }
}

export function todoPubSubSubscribeSucceeded(subid: string): Action {
  return {
    type: TODO_PUBSUB_SUBSCRIBE_SUCCEEDED,
    payload: { subid }
  }
}

export function todoPubSubUnsubscribe(): Action {
  return {
    type: TODO_PUBSUB_UNSUBSCRIBE
  }
}

export function todoPubSubReceiveSucceeded(todo: Todo): Action {
  return {
    type: TODO_PUBSUB_RECEIVE_SUCCEEDED,
    payload: { todo }
  }
}

export function todoPubSubReceiveFailed(error: ErrorType): Action {
  return {
    type: TODO_PUBSUB_RECEIVE_FAILED,
    payload: { error }
  }
}

export function todoPubSubCreate(text: string): Action {
  return {
    type: TODO_PUBSUB_CREATE,
    payload: { text }
  }
}

export function todoPubSubCreateSucceeded(): Action {
  return {
    type: TODO_PUBSUB_CREATE_SUCCEEDED
  }
}

export function todoPubSubCreateFailed(error: ErrorType): Action {
  return {
    type: TODO_PUBSUB_CREATE_FAILED,
    payload: { error }
  }
}

export function todoPubSubToggle(todoID: string): Action {
  return {
    type: TODO_PUBSUB_TOGGLE,
    payload: { todoID }
  }
}

export function todoPubSubToggleSucceeded(): Action {
  return {
    type: TODO_PUBSUB_TOGGLE_SUCCEEDED
  }
}

export function todoPubSubToggleFailed(error: ErrorType): Action {
  return {
    type: TODO_PUBSUB_TOGGLE_FAILED,
    payload: { error }
  }
}

// Types

type TodoPubSubState = {
  subid: ?string,
  todos: { [string]: Todo },
  createError: ?string,
  toggleError: ?string,
  receiveError: ?string
}

// Reducer

export const initialState: TodoPubSubState = {
  subid: null,
  todos: {},
  createError: null,
  toggleError: null,
  receiveError: null
}

export const todoPubSubReducer = createReducer(
  {
    [TODO_PUBSUB_SUBSCRIBE]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_SUBSCRIBE_SUCCEEDED]: (
      state: TodoPubSubState,
      payload: { subid: string }
    ): TodoPubSubState =>
      R.merge(state, {
        subid: payload.subid
      }),

    [TODO_PUBSUB_UNSUBSCRIBE]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_RECEIVE_SUCCEEDED]: (
      state: TodoPubSubState,
      { payload: { todo } }
    ): TodoPubSubState =>
      R.merge(state, {
        todos: R.assoc(todo.id, todo, state.todos)
      }),

    [TODO_PUBSUB_RECEIVE_FAILED]: (
      state: TodoPubSubState,
      { payload: { error } }
    ): TodoPubSubState =>
      R.merge(state, {
        receiveError: error
      }),

    [TODO_PUBSUB_CREATE]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_CREATE_SUCCEEDED]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_CREATE_FAILED]: (
      state: TodoPubSubState,
      { payload: { error } }
    ): TodoPubSubState =>
      R.merge(state, {
        createError: error
      }),

    [TODO_PUBSUB_TOGGLE]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_TOGGLE_SUCCEEDED]: (state: TodoPubSubState): TodoPubSubState => state,

    [TODO_PUBSUB_TOGGLE_FAILED]: (
      state: TodoPubSubState,
      { payload: { error } }
    ): TodoPubSubState =>
      R.merge(state, {
        toggleError: error
      })
  },
  initialState
)

// Logic

export const todoSubscribeLogic = createLogic({
  type: TODO_PUBSUB_SUBSCRIBE,
  cancelType: TODO_PUBSUB_UNSUBSCRIBE,
  warnTimeout: 0,

  // eslint-disable-next-line no-unused-vars
  process({ apollo, subscriptions, cancelled$ }, dispatch: Dispatch, done: () => void) {
    if (subscriptions.todo) {
      dispatch(todoPubSubSubscribeSucceeded(subscriptions.todo._networkSubscriptionId))
      return
    }
    const sub = apollo.subscribe({ query: TODO_UPDATED_SUBSCRIPTION }).subscribe({
      next({ todoUpdated }) {
        dispatch(todoPubSubReceiveSucceeded(todoUpdated))
      },
      error(error: Object) {
        dispatch(todoPubSubReceiveFailed(errorObject(error)))
      }
    })

    cancelled$.subscribe(() => {
      debugPubSub('unsubscribe todo')
      sub.unsubscribe()
      subscriptions.todo = null
    })

    subscriptions.todo = sub
    dispatch(todoPubSubSubscribeSucceeded(sub._networkSubscriptionId))
  }
})

export const todoCreateLogic = createLogic({
  type: TODO_PUBSUB_CREATE,
  processOptions: {
    dispatchReturn: true,
    successType: todoPubSubCreateSucceeded,
    failType: todoPubSubCreateFailed
  },

  process({ apollo, action }) {
    return apollo
      .mutate({
        mutation: ADD_TODO_MUTATION,
        variables: { text: action.payload.text }
      })
      .map(resp => resp.data.addTodo)
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})

export const todoToggleLogic = createLogic({
  type: TODO_PUBSUB_TOGGLE,

  processOptions: {
    dispatchReturn: true,
    successType: todoPubSubToggleSucceeded,
    failType: todoPubSubToggleFailed
  },

  process({ apollo, action }) {
    return apollo
      .mutate({
        mutation: TOGGLE_TODO_MUTATION,
        variables: { id: action.payload.todoID }
      })
      .map(resp => resp.data.toggleTodo)
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})
