const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const NoteType = require('../Note/NoteType');
const Note = require('../Note/Note');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (user) => user.id,
    },
    username: {
      type: GraphQLString,
      resolve: (user) => user.username,
    },
    email: {
      type: GraphQLString,
      resolve: (user) => user.email,
    },
    notes: {
      type: new GraphQLList(NoteType),
      resolve: (user) => user.getNotes(),
    },
    createdAt: {
      type: GraphQLString,
      resolve: (user) => user.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (user) => user.updatedAt,
    },
  }),
});

module.exports = UserType;
