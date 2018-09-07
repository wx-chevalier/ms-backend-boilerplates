// @flow
import createDebug from 'debug'
import jwt from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions'
import R from 'ramda'
import env from './env'
import { todos } from './store'

const debugAuth = createDebug('example:auth')
const debugPubSub = createDebug('example:pubsub')

const TODO_UPDATED_TOPIC = 'todoUpdated'

const pubsub = new PubSub()

const authenticated = (method: Function) => async (_, args: Object, context: Object) => {
  const { ctx } = context
  // debugAuth('header.authorization', ctx.request.header.authorization)
  try {
    const { user } = jwt.verify(
      ctx.request.header.authorization ? ctx.request.header.authorization.split(' ')[1] : '',
      env('AUTH_SECRET')
    )
    ctx.state.user = user
  } catch (error) {
    debugAuth('error', error)
    ctx.throw(401, 'Access denied.')
  }
  const result = await method(_, args, context)
  return result
}

function authenticatedResolvers(resolvers: Object): Object {
  return R.mapObjIndexed((resolver: Object, key: string) => {
    if (key === 'Subscription') {
      // subscriptions do not have ctx.request.header
      return resolver
    }
    return R.mapObjIndexed((method: Function) => authenticated(method), resolver)
  }, resolvers)
}

const resolvers = authenticatedResolvers({
  TodoList: {
    todos() {
      return todos
    }
  },
  Query: {
    todoList() {
      return true
    }
  },
  Mutation: {
    addTodo(_, { text }) {
      const todo = {
        id: (todos.length + 1).toString(),
        text,
        completed: false
      }
      todos.push(todo)
      pubsub.publish(TODO_UPDATED_TOPIC, { todoUpdated: { ...todo } })
      debugPubSub('publish', TODO_UPDATED_TOPIC, todo)
      return todo
    },
    toggleTodo(_, { id }, { ctx }) {
      const todo = todos[id - 1]
      if (!todo) {
        ctx.throw(404, `Couldn't find Todo with id ${id}`)
      }
      todo.completed = !todo.completed
      pubsub.publish(TODO_UPDATED_TOPIC, { todoUpdated: { ...todo } })
      debugPubSub('publish', TODO_UPDATED_TOPIC, todo)
      return todo
    }
  },
  Subscription: {
    todoUpdated: {
      // subscription payload can be filtered here
      // resolve(payload, args) {
      //   return payload.todoUpdated
      // },
      subscribe(_, args, { ctx, subscriptionUser }) {
        // it is possible to check authentication here
        // debugGraphQL('subscribe subscriptionUser', subscriptionUser)
        // if (!subscriptionUser) {
        //   return null
        // }
        return pubsub.asyncIterator(TODO_UPDATED_TOPIC)
      }
    }
  }
})

export { resolvers, pubsub, TODO_UPDATED_TOPIC }
