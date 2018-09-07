// @flow
import { PersistedQueryNetworkInterface } from 'persistgraphql'
import queryMap from '../extracted_queries.json'
import config from '../config.json'

// Returns either a standard, fetch-full-query network interface or a
// persisted query network interface (from `extractgql`) depending on
// the configuration within `../config.json`.
// export default function getNetworkInterface(apiUrl = '/graphql', headers = {}) {
export default function getNetworkInterface(apiUrl: string, headers: Object = {}) {
  return new PersistedQueryNetworkInterface({
    queryMap,
    uri: apiUrl,
    opts: {
      credentials: 'same-origin',
      headers
    },
    enablePersistedQueries: config.persistedQueries
  })
}
