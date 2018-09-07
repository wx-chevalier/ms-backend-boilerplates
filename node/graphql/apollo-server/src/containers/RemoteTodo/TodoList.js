// @flow
import R from 'ramda'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { todoRemoteFetch, todoRemoteToggle } from '../../ducks/todoRemote'
import TodoList from '../../components/Todo/TodoList'

class TodoListContainer extends TodoList {
  componentDidMount() {
    this.props.todoRemoteFetch()
  }
}

TodoListContainer.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  todoRemoteFetch: PropTypes.func.isRequired,
  onTodoClick: PropTypes.func.isRequired
}

const mapStateToProps = (state: Object) => ({
  todos: R.values(R.prop('todos', state.todoRemote))
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  todoRemoteFetch() {
    dispatch(todoRemoteFetch())
  },
  onTodoClick(todoID: string) {
    dispatch(todoRemoteToggle(todoID))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoListContainer)
