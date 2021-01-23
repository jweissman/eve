import { Node, Action } from 'ohm-js'
import { SemanticOperation } from './SemanticOperation'

export class EdenInspector extends SemanticOperation {
  nothing: Action = () => '(mu)'
  integerLiteral: Action = (digits: Node) => digits.sourceString
}
