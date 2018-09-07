// @flow
import R from 'ramda'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  todoPubSubSubscribe,
  todoPubSubUnsubscribe,
  todoPubSubToggle
} from '../../ducks/todoPubSub'
import TodoList from '../../components/Todo/TodoList'

class TodoListContainer extends TodoList {
  componentDidMount() {
    this.props.subscribeTodos()
  }

  componentWillUnmount() {
    this.props.unsubscribeTodos()
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
  subscribeTodos: PropTypes.func.isRequired,
  unsubscribeTodos: PropTypes.func.isRequired,
  onTodoClick: PropTypes.func.isRequired
}

const mapStateToProps = (state: Object) => ({
  todos: R.values(R.prop('todos', state.todoPubSub))
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribeTodos() {
    dispatch(todoPubSubSubscribe())
  },
  unsubscribeTodos() {
    dispatch(todoPubSubUnsubscribe())
  },
  onTodoClick(todoID: string) {
    dispatch(todoPubSubToggle(todoID))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoListContainer)
