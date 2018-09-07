// @flow
import R from 'ramda'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { signin, authErrorClear, githubSignin } from '../../ducks/auth'
import Signin from '../../components/Signin/Signin'

class SigninApp extends Signin {
  componentWillMount() {
    this.props.authErrorClear()
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.usernameField) this.usernameField.select()
    }, 0)
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.error) {
      setTimeout(() => {
        if (this.passwordField) this.passwordField.select()
      }, 0)
    }
  }
}

SigninApp.propTypes = {
  authenticating: PropTypes.bool.isRequired,
  error: PropTypes.string,
  authErrorClear: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const mapStateToProps = (state: Object) => ({
  authenticating: state.auth.authenticating,
  error: R.path(['error', 'message'], state.auth)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmit(username, password) {
    dispatch(signin(username, password))
  },

  authErrorClear() {
    dispatch(authErrorClear())
  },

  githubSignin(redirect: ?string) {
    dispatch(githubSignin(redirect))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SigninApp)
