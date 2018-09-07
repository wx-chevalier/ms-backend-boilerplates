// @flow
import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import AddTodo from './AddTodo'
import VisibleTodoList from './VisibleTodoList'

const TodoApp = () => (
  <Container text className="main main-content">
    <h1>Todo Example</h1>
    <AddTodo />
    <Divider />
    <VisibleTodoList />
  </Container>
)

export default TodoApp
