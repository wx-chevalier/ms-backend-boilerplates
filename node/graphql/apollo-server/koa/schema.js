// @flow
const schema = `
  type Todo {
    id: String!
    text: String!
    completed: Boolean!
  }

  type TodoList {
    todos: [Todo]
  }

  type Query {
    todoList: TodoList
  }

  type Mutation {
    addTodo(
      text: String!
    ): Todo,
    toggleTodo(
      id: String!
    ): Todo
  }

  type Subscription {
    todoUpdated: Todo
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export default schema;
