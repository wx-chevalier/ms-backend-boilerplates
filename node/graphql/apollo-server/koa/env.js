// @flow
import dotenv from 'dotenv'

const denv = dotenv.config().parsed

export default function env(key: string, def: string = ''): string {
  return denv[key] !== undefined ? denv[key] : def
}
