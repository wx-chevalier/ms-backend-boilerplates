// @flow
import React from 'react'
import logo from '../../logo.svg'

const Footer = () =>
  (<div className="ui inverted vertical footer segment">
    <div className="ui center aligned container">
      <img src={logo} className="ui centered mini image" alt="logo" />
      <div className="ui horizontal inverted small divided link list">
        <a className="item" href="/">
          Site Map
        </a>
        <a className="item" href="/">
          Contact Us
        </a>
        <a className="item" href="/">
          Terms and Conditions
        </a>
        <a className="item" href="/">
          Privacy Policy
        </a>
      </div>
    </div>
  </div>)

export default Footer
