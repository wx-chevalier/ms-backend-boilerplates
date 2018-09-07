// @flow
import R from 'ramda'
import createReducer from '../redux/createReducer'
import { keyLength } from '../utils'

// Types

// eslint-disable-next-line no-undef
export type TodoAction = {
  type: string,
  payload?: {
    todo?: Todo,
    todoID?: string
  }
}

export type TodoState = {
  'todos': { [string]: Todo }
}

// Actions

const TODO_CREATE = 'TODO_CREATE'
const TODO_TOGGLE = 'TODO_TOGGLE'

export function createTodo(text: string): Action {
  return {
    type: TODO_CREATE,
    payload: { text }
  }
}

export function toggleTodo(todoID: string): Action {
  return {
    type: TODO_TOGGLE,
    payload: { todoID }
  }
}

// Reducer

export const initialState: TodoState = {
  todos: {
    '0': { id: '0', text: 'hello', completed: true }, // eslint-disable-line quote-props
    '1': { id: '1', text: 'world', completed: false } // eslint-disable-line quote-props
  }
}

export const todoReducer = createReducer(
  {
    [TODO_CREATE]: (state: TodoState, { payload: { text } }): TodoState => {
      const id = keyLength(state.todos).toString()
      return {
        todos: R.assoc(
          id,
          {
            id,
            text,
            completed: false
          },
          state.todos
        )
      }
    },

    [TODO_TOGGLE]: (state: TodoState, { payload: { todoID } }): TodoState => {
      const todo = state.todos[todoID]
      todo.completed = !todo.completed
      return {
        todos: R.assoc(todo.id, todo, state.todos)
      }
    }
  },
  initialState
)
