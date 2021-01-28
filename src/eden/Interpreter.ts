import { JSValue } from '../eve/vm/types'
import { Parser } from './Parser'

export interface Interpreter {
  parser: Parser
  evaluate(input: string): JSValue
}
