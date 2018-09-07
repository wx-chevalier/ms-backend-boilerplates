// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header/Header'
import Footer from './Footer/Footer'

import './App.css'

const App = (props: Object) => {
  const { children } = props

  return (
    <div className="app">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element
}

export default App
