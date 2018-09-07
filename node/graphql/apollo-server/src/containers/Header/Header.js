// @flow
import { connect } from 'react-redux'
import { signout } from '../../ducks/auth'
import Header from '../../components/Header/Header'

const mapStateToProps = (state: Object) => ({
  username: state.auth.username,
  admin: state.auth.admin,
  path: window.location.pathname
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signout() {
    dispatch(signout())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
