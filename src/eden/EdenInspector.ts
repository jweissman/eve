/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node, Action } from 'ohm-js'
import { SemanticOperation } from './SemanticOperation'

export class EdenInspector extends SemanticOperation {
  Nothing: Action = () => '(mu)'
  number: Action = (digits: Node) => digits.sourceString
  Identifier: Action = (letters: Node) => letters.sourceString
  CompoundExpression: Action = (list: Node) => list.asIteration().inspect().join('; ')
  AssignmentExpression: Action = (left: Node, _eq: Node, right: Node) => (
    left.inspect() + ' = ' + right.inspect()
  )

  Addition: Action = (left: Node, op: Node, right: Node) => (left.inspect() + op.sourceString + right.inspect())
  Multiplication: Action = (left: Node, op: Node, right: Node) => (left.inspect() + op.sourceString + right.inspect())
  Exponentiation: Action = (left: Node, op: Node, right: Node) => (left.inspect() + op.sourceString + right.inspect())
  ParentheticalExpression: Action = (_lp: Node, expr: Node, _rp: Node) => expr.inspect()
}
