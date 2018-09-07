import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Header from '../components/Header/Header'
import Signin from '../components/Signin/Signin'

storiesOf('Header', module)
  .add('without auth', () => <Header path={'/'} admin={false} signout={action('signout')} />)
  .add('with normal user', () =>
    <Header path={'/'} username={'bob'} admin={false} signout={action('signout')} />
  )
  .add('with admin user', () =>
    <Header path={'/'} username={'bob'} admin signout={action('signout')} />
  )
  .add('Local tab', () =>
    <Header path={'/todo'} username={'bob'} admin={false} signout={action('signout')} />
  )
  .add('GraphQL tab', () =>
    <Header path={'/todo-remote'} username={'bob'} admin={false} signout={action('signout')} />
  )
  .add('GraphQL Subscription tab', () =>
    <Header path={'/todo-pubsub'} username={'bob'} admin={false} signout={action('signout')} />
  )

storiesOf('Signin', module)
  .add('Initial state', () =>
    (<Signin
      authenticating={false}
      onSubmit={action('signin')}
      githubSignin={action('githubSignin')}
    />)
  )
  .add('Signing in', () =>
    <Signin authenticating onSubmit={action('signin')} githubSignin={action('githubSignin')} />
  )
  .add('Error', () =>
    (<Signin
      authenticating={false}
      error={'Authentication failed'}
      onSubmit={action('signin')}
      githubSignin={action('githubSignin')}
    />)
  )
