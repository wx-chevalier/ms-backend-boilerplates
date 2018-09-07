import { createMockStore } from 'redux-logic-test'
import Rx from 'rxjs'
import TODO_UPDATED_SUBSCRIPTION from '../../graphql/todoUpdatedSubscription.graphql'
import { itWithRx } from '../../test/helper'
import {
  todoPubSubSubscribe,
  todoPubSubSubscribeSucceeded,
  todoPubSubReceiveSucceeded,
  todoPubSubUnsubscribe,
  initialState,
  todoSubscribeLogic
} from '../todoPubSub'

describe('todoSubscribeLogic', () => {
  itWithRx(
    'dispatches todoPubSubSubscribeSucceeded on success',
    async ({ rstTestScheduler, hot }) => {
      const subscriptions = { todo: null }
      const todo$ = hot('-a|', {
        a: {
          todoUpdated: {
            id: '1',
            text: 'foo',
            completed: true
          }
        }
      })

      let subscribeQuery = null

      // mock todo$.subscribe() to assign _networkSubscriptionId
      todo$.subscribe_ = todo$.subscribe
      todo$.subscribe = (observer) => {
        const sub = todo$.subscribe_(observer)
        sub._networkSubscriptionId = 'sub-1'
        return sub
      }

      const store = createMockStore({
        initialState,
        injectedDeps: {
          apollo: {
            subscribe: (query) => {
              subscribeQuery = query
              return todo$
            }
          },
          subscriptions
        },
        logic: [todoSubscribeLogic]
      })

      store.dispatch(todoPubSubSubscribe())

      Rx.Observable.timer(30, rstTestScheduler).subscribe({
        next: () => {
          store.dispatch(todoPubSubUnsubscribe())
        }
      })

      await store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: 'TODO_PUBSUB_SUBSCRIBE'
          },
          {
            type: 'TODO_PUBSUB_SUBSCRIBE_SUCCEEDED',
            payload: {
              subid: 'sub-1'
            }
          },
          {
            type: 'TODO_PUBSUB_RECEIVE_SUCCEEDED',
            payload: {
              todo: {
                id: '1',
                text: 'foo',
                completed: true
              }
            }
          },
          {
            type: 'TODO_PUBSUB_UNSUBSCRIBE'
          }
        ])
        expect(subscribeQuery).toEqual({
          query: TODO_UPDATED_SUBSCRIPTION
        })
      })
    }
  )
})
