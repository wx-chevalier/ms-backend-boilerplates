// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { authCallback } from '../../ducks/auth'

class AuthCallback extends Component {
  componentWillMount() {
    const { service, redirect } = this.props.params
    const { code } = this.props.location.query
    this.props.authCallback(service, code, redirect)
  }

  render() {
    return (
      <div id="loading">
        <h2>Authenticating...</h2>
        <div className="loader" />
      </div>
    )
  }
}

AuthCallback.propTypes = {
  params: PropTypes.shape({
    service: PropTypes.string.isRequired,
    redirect: PropTypes.string
  }),
  location: PropTypes.shape({
    query: PropTypes.shape({
      code: PropTypes.string
    }).isRequired
  }).isRequired,
  authCallback: PropTypes.func.isRequired
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  authCallback(service: string, code: string, redirect: ?string) {
    dispatch(authCallback(service, code, redirect))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallback)
