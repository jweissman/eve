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
  nothing: Action = () => ({ kind: ASTNodeKind.Nothing })
  integerLiteral: Action = (digits: Node) => ({
    kind: ASTNodeKind.IntLit,
    numericValue: Number(digits.sourceString)
  })
  addition: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  multiplication: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  exponentiation: Action = (left: Node, op: Node, right: Node) =>
    binaryExpr(left, op, right)
  parentheticalExpression: Action = (_leftParens: Node, expr: Node, _rightParens: Node) =>
    expr.tree()
}
