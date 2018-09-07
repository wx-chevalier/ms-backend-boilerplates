// @flow
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TodoField from '../../components/Todo/TodoField'
import { createTodo } from '../../ducks/todo'

class AddTodoContainer extends PureComponent {
  render() {
    const { onCreateTodo } = this.props

    return <TodoField onSubmit={onCreateTodo} />
  }
}

AddTodoContainer.propTypes = {
  onCreateTodo: PropTypes.func.isRequired
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCreateTodo(text) {
    dispatch(createTodo(text))
  }
})

const AddTodo = connect(mapStateToProps, mapDispatchToProps)(AddTodoContainer)

export default AddTodo
