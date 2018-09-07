// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'semantic-ui-react'

class TodoField extends Component {
  componentDidMount() {
    if (this.inputField) this.inputField.focus()
  }

  inputField: ?HTMLInputElement

  handleSubmit(event: Event) {
    const { onSubmit } = this.props

    event.preventDefault()
    if (!this.inputField || !this.inputField.value.trim()) {
      return
    }
    onSubmit(this.inputField.value)
    if (this.inputField) {
      this.inputField.value = ''
      this.inputField.focus()
    }
  }

  render() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Field>
          <input
            ref={(elem: HTMLInputElement) => {
              this.inputField = elem
            }}
            name="add-todo"
            placeholder="Input Todo"
          />
        </Form.Field>
        <Form.Field>
          <Button id="add-todo-button" primary>
            Add Todo
          </Button>
        </Form.Field>
      </Form>
    )
  }
}

TodoField.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default TodoField
