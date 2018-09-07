// @flow
import classNames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, List } from 'semantic-ui-react'
import './Todo.css'

class Todo extends PureComponent {
  render() {
    const { todo, onClick } = this.props
    const { completed, text } = todo

    return (
      <List.Item className={classNames('todo-item', { completed })}>
        <Checkbox label={text} checked={completed} onClick={onClick} />
      </List.Item>
    )
  }
}

Todo.propTypes = {
  todo: PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default Todo
