// @flow
import { makeExecutableSchema } from 'graphql-tools'
import schema from './schema'
import { resolvers, pubsub, TODO_UPDATED_TOPIC } from './resolvers'

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
})

export { executableSchema, pubsub, TODO_UPDATED_TOPIC }
