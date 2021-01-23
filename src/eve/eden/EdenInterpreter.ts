import { JSValue } from '../vm/types'
import { EdenParser } from './EdenParser'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'

export class EdenInterpreter implements Interpreter {
  parser: Parser = new EdenParser()
  evaluate(): JSValue {
    throw new Error('EdenInterpreter.evalute: Method not implemented.')
  }
}