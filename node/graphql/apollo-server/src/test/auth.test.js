import Nightmare from 'nightmare'
import { BASE_URL } from './test_config'

beforeAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
})

describe('Todo page w/o auth', () => {
  it('redirects the req to /signin', async () => {
    const path = await Nightmare().goto(`${BASE_URL}/todo`).path().end()
    expect(path).toEqual('/signin')
  })
})

describe('Signing in', () => {
  it('fails with an incorrect password', async () => {
    const { message, path } = await Nightmare({ typeInterval: 10 })
      .goto(`${BASE_URL}/signin`)
      .type('input[name=username]', 'alice')
      .type('input[name=password]', 'incorrect')
      .click('#signin-button')
      .wait('.negative')
      .evaluate(() => ({
        message: document.querySelector('.negative p').innerText,
        path: document.location.pathname
      }))
      .end()
    expect(message).toEqual('Username or password incorrect.')
    expect(path).toEqual('/signin')
  })

  it('redirects /signin to / after auth', async () => {
    const { username, path } = await Nightmare({ typeInterval: 10 })
      .goto(`${BASE_URL}/signin`)
      .type('input[name=username]', 'alice')
      .type('input[name=password]', 'alicepass')
      .click('#signin-button')
      .wait('#username')
      .evaluate(() => ({
        username: document.querySelector('#username').innerText,
        path: document.location.pathname
      }))
      .end()
    expect(username).toEqual('alice')
    expect(path).toEqual('/')
  })

  it('redirects /todo to /todo after auth', async () => {
    const { username, path } = await Nightmare({ typeInterval: 10 })
      .goto(`${BASE_URL}/todo`)
      .type('input[name=username]', 'alice')
      .type('input[name=password]', 'alicepass')
      .click('#signin-button')
      .wait('#username')
      .evaluate(() => ({
        username: document.querySelector('#username').innerText,
        path: document.location.pathname
      }))
      .end()
    expect(username).toEqual('alice')
    expect(path).toEqual('/todo')
  })
})
