// @flow
import R from 'ramda'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'semantic-ui-react'
import Todo from './Todo'

class TodoList extends Component {
  handleTodoClick(event: Event, todoID: string) {
    event.preventDefault()
    const { onTodoClick } = this.props
    onTodoClick(todoID)
  }

  render() {
    const { todos } = this.props

    return (
      <List>
        {R.map(
          todo => (
            <Todo
              key={todo.id}
              onClick={(e) => {
                this.handleTodoClick(e, todo.id)
              }}
              todo={todo}
            />
          ),
          todos
        )}
      </List>
    )
  }
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList
