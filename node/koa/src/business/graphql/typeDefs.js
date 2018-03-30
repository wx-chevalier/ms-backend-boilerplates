// @flow
export const typeDefs = `
  type User {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    author: User
    votes: Int
  }
  # the schema allows the following query:
  type Query {
    posts: [Post]
    user(id: Int!): User
  }
  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;
