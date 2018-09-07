// @flow
import R from 'ramda'
import { createLogic } from 'redux-logic'
import createReducer from '../redux/createReducer'
import { errorObject } from '../utils'
import TODO_LIST_QUERY from '../graphql/todoListQuery.graphql'
import ADD_TODO_MUTATION from '../graphql/addTodoMutation.graphql'
import TOGGLE_TODO_MUTATION from '../graphql/toggleTodoMutation.graphql'

// Types

type TodoRemoteState = {
  todos: { [string]: Todo },
  fetching: boolean,
  fetchError: ?string,
  createError: ?string,
  toggleError: ?string
}

// Actions

export const TODO_REMOTE_FETCH = 'TODO_REMOTE_FETCH'
export const TODO_REMOTE_FETCH_SUCCEDED = 'TODO_REMOTE_FETCH_SUCCEDED'
export const TODO_REMOTE_FETCH_FAILED = 'TODO_REMOTE_FETCH_FAILED'
export const TODO_REMOTE_CREATE = 'TODO_REMOTE_CREATE'
export const TODO_REMOTE_CREATE_SUCCEEDED = 'TODO_REMOTE_CREATE_SUCCEEDED'
export const TODO_REMOTE_CREATE_FAILED = 'TODO_REMOTE_CREATE_FAILED'
export const TODO_REMOTE_TOGGLE = 'TODO_REMOTE_TOGGLE'
export const TODO_REMOTE_TOGGLE_SUCCEEDED = 'TODO_REMOTE_TOGGLE_SUCCEEDED'
export const TODO_REMOTE_TOGGLE_FAILED = 'TODO_REMOTE_TOGGLE_FAILED'

export function todoRemoteFetch(): Action {
  return {
    type: TODO_REMOTE_FETCH
  }
}

export function todoRemoteFetchSucceeded(todos: Todo[]): Action {
  return {
    type: TODO_REMOTE_FETCH_SUCCEDED,
    payload: { todos }
  }
}

export function todoRemoteFetchFailed(error: ErrorType): Action {
  return {
    type: TODO_REMOTE_FETCH_FAILED,
    payload: { error }
  }
}

export function todoRemoteCreate(text: string): Action {
  return {
    type: TODO_REMOTE_CREATE,
    payload: { text }
  }
}

export function todoRemoteCreateSucceeded(): Action {
  return {
    type: TODO_REMOTE_CREATE_SUCCEEDED
  }
}

export function todoRemoteCreateFailed(error: ErrorType): Action {
  return {
    type: TODO_REMOTE_CREATE_FAILED,
    payload: { error }
  }
}

export function todoRemoteToggle(todoID: string): Action {
  return {
    type: TODO_REMOTE_TOGGLE,
    payload: { todoID }
  }
}

export function todoRemoteToggleSucceeded(todo: Todo): Action {
  return {
    type: TODO_REMOTE_TOGGLE_SUCCEEDED,
    payload: { todo }
  }
}

export function todoRemoteToggleFailed(error: ErrorType): Action {
  return {
    type: TODO_REMOTE_TOGGLE_FAILED,
    payload: { error }
  }
}

// Reducer

const initialState: TodoRemoteState = {
  todos: {},
  fetching: false,
  fetchError: null,
  createError: null,
  toggleError: null
}

export const todoRemoteReducer = createReducer(
  {
    [TODO_REMOTE_FETCH]: (state: TodoRemoteState): TodoRemoteState =>
      R.merge(state, {
        fetching: true
      }),

    [TODO_REMOTE_FETCH_SUCCEDED]: (
      state: TodoRemoteState,
      { payload: { todos } }
    ): TodoRemoteState =>
      R.merge(state, {
        fetching: false,
        todos: R.reduce(
          (acc: { [string]: Todo }, todo: Todo) => R.assoc(todo.id, todo, acc),
          {},
          todos
        )
      }),

    [TODO_REMOTE_FETCH_FAILED]: (state: TodoRemoteState, { payload: { error } }): TodoRemoteState =>
      R.merge(state, {
        fetching: false,
        fetchError: error
      }),

    [TODO_REMOTE_CREATE]: (state: TodoRemoteState): TodoRemoteState => state,

    [TODO_REMOTE_CREATE_SUCCEEDED]: (state: TodoRemoteState): TodoRemoteState => state,

    [TODO_REMOTE_CREATE_FAILED]: (
      state: TodoRemoteState,
      { payload: { error } }
    ): TodoRemoteState =>
      R.merge(state, {
        createError: error
      }),

    [TODO_REMOTE_TOGGLE]: (state: TodoRemoteState): TodoRemoteState => state,

    [TODO_REMOTE_TOGGLE_SUCCEEDED]: (
      state: TodoRemoteState,
      { payload: { todo } }
    ): TodoRemoteState =>
      R.merge(state, {
        todos: R.assoc(todo.id, todo, state.todos)
      }),

    [TODO_REMOTE_TOGGLE_FAILED]: (
      state: TodoRemoteState,
      { payload: { error } }
    ): TodoRemoteState =>
      R.merge(state, {
        toggleError: error
      })
  },
  initialState
)

// Logic

export const todosFetchLogic = createLogic({
  type: [TODO_REMOTE_FETCH, TODO_REMOTE_CREATE_SUCCEEDED],
  processOptions: {
    dispatchReturn: true,
    successType: todoRemoteFetchSucceeded,
    failType: todoRemoteFetchFailed
  },

  process({ apollo }) {
    return apollo
      .query({
        query: TODO_LIST_QUERY,
        fetchPolicy: 'network-only'
      })
      .map(resp => resp.data.todoList.todos)
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})

export const todoCreateLogic = createLogic({
  type: TODO_REMOTE_CREATE,
  processOptions: {
    dispatchReturn: true,
    successType: todoRemoteCreateSucceeded,
    failType: todoRemoteCreateFailed
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
  type: TODO_REMOTE_TOGGLE,
  processOptions: {
    dispatchReturn: true,
    successType: todoRemoteToggleSucceeded,
    failType: todoRemoteToggleFailed
  },

  process({ apollo, action }) {
    return apollo
      .mutate({
        mutation: TOGGLE_TODO_MUTATION,
        variables: { id: R.prop('todoID', action.payload) }
      })
      .map(resp => resp.data.toggleTodo)
      .catch((error: Object) => {
        throw errorObject(error)
      })
  }
})
