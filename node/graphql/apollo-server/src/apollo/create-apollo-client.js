// @flow
import ApolloClient from 'apollo-client'

export default (options: Object) =>
  new ApolloClient(
    Object.assign(
      {},
      {
        addTypename: true,
        dataIdFromObject: (result) => {
          if (result.id && result.__typename) {
            return result.__typename + result.id
          }
          return null
        }
        // shouldBatch: true,
      },
      options
    )
  )
