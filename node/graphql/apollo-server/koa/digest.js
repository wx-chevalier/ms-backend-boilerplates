// @flow

import crypto from 'crypto'

export default function digest(password: string) {
  return crypto.createHash('sha1').update(password).digest('hex')
}
