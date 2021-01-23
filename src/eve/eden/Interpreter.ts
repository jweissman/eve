import { JSValue } from '../vm/types';
import { Parser } from './Parser';

export interface Interpreter {
  parser: Parser;
  evaluate(input: string): JSValue;
}
