// @flow
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolve';

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});
