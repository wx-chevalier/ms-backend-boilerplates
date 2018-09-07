// @flow

// NOTE: this is a DB mock. Rewrite this for a real world app

import R from 'ramda'
import digest from './digest'

type UserMap = { [string]: User }

export const todos: Array<Todo> = [
  { id: '1', text: 'Make America great again', completed: false },
  { id: '2', text: 'Quit TPP', completed: false }
]

const users: UserMap = R.reduce((acc: UserMap, u: User) => R.assoc(u.username, u, acc), {}, [
  { username: 'alice', password: digest('alicepass'), admin: true, authService: null },
  { username: 'bob', password: digest('bobpass'), admin: false, authService: null }
])

export function getUser(username: string): User {
  return users[username]
}

export function getOrCreateUser(username: string, authService: string): User {
  const existingUser = getUser(username)
  if (existingUser) return existingUser

  const user = {
    username,
    admin: false,
    authService
  }
  users[username] = user

  return user
}
