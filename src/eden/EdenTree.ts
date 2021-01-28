/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node, Action } from 'ohm-js'
import { ASTNodeKind } from './ASTNodeKind'
import { SemanticOperation } from './SemanticOperation'

const binaryExpr = (left: Node, operator: Node, right: Node) => ({
  kind: ASTNodeKind.BinaryExpression,
  children: [left.tree(), right.tree()],
  operator: operator.primitiveValue,
})

export class EdenTree extends SemanticOperation {
  Nothing = () => ({ kind: ASTNodeKind.Nothing })
  Identifier = (letters: Node) => ({
    kind: ASTNodeKind.Identifier,
    name: String(letters.sourceString)
  })
  IntegerLiteral = (digits: Node) => ({
    kind: ASTNodeKind.IntLit,
    numericValue: Number(digits.sourceString)
  })
  Addition: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  Multiplication: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  Exponentiation: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  ParentheticalExpression: Action = (_leftParens: Node, expr: Node, _rightParens: Node) =>
    expr.tree()
  AssignmentExpression: Action = (left: Node, _eq: Node, right: Node) => ({
    kind: ASTNodeKind.Assignment,
    children: [ left.tree(), right.tree() ]
  })
}
