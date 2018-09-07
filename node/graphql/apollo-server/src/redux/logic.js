// @flow
import {
  signinLogic,
  signoutLogic,
  signinResumeLogic,
  autoSignoutLogic,
  githubSigninLogic,
  authCallbackLogic
} from '../ducks/auth'
import { todosFetchLogic, todoCreateLogic, todoToggleLogic } from '../ducks/todoRemote'
import {
  todoSubscribeLogic,
  todoCreateLogic as todoCreateLogicForPubSub,
  todoToggleLogic as todoToggleLogicForPubSub
} from '../ducks/todoPubSub'

const rootLogic = [
  signinLogic,
  signoutLogic,
  signinResumeLogic,
  autoSignoutLogic,
  githubSigninLogic,
  authCallbackLogic,
  todosFetchLogic,
  todoCreateLogic,
  todoToggleLogic,
  todoSubscribeLogic,
  todoCreateLogicForPubSub,
  todoToggleLogicForPubSub
]

export default rootLogic
