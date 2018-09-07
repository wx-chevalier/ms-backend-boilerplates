// @flow
import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import AddTodo from './AddTodo'
import TodoList from './TodoList'

const PubSubTodoApp = () => (
  <Container text className="main main-content">
    <h1>Todo Example (GraphQL PubSub)</h1>
    <AddTodo />
    <Divider />
    <TodoList />
  </Container>
)

export default PubSubTodoApp
