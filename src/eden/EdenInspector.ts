import { Node, Action } from 'ohm-js'
import { SemanticOperation } from './SemanticOperation'

export class EdenInspector extends SemanticOperation {
  Nothing: Action = () => '(mu)'
  number: Action = (digits: Node) => digits.sourceString
}
