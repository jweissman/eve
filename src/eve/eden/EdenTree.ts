import { Node, Action } from 'ohm-js'
import { ASTNodeKind } from './ASTNodeKind'
import { SemanticOperation } from './SemanticOperation'

export class EdenTree extends SemanticOperation {
  nothing: Action = () => ({ kind: ASTNodeKind.Nothing })
  integerLiteral: Action = (digits: Node) => ({
    kind: ASTNodeKind.IntLit,
    numericValue: Number(digits.sourceString)
  })
  addition: Action = (left: Node, op: Node, right: Node) => ({
    kind: ASTNodeKind.BinaryExpression,
    children: [left.tree(), right.tree()],
    operator: op.primitiveValue,
  })
}
