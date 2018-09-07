import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import App from '../App'

const renderer = new ReactShallowRenderer()

function setup() {
  renderer.render(<App />)
  const output = renderer.getRenderOutput()

  return {
    output
  }
}

describe('<App/>', () => {
  const { output } = setup()

  it('renders div', () => {
    expect(output.type).toBe('div')
  })
})
