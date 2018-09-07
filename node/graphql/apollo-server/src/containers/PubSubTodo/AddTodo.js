// @flow
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TodoField from '../../components/Todo/TodoField'
import { todoPubSubCreate } from '../../ducks/todoPubSub'

class AddTodo extends PureComponent {
  render() {
    const { onCreateTodo } = this.props

    return <TodoField onSubmit={onCreateTodo} />
  }
}

AddTodo.propTypes = {
  onCreateTodo: PropTypes.func.isRequired
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCreateTodo(text: string) {
    dispatch(todoPubSubCreate(text))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo)
