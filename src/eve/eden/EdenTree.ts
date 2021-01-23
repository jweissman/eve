/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Node, Action } from 'ohm-js'
import { ASTNodeKind } from './ASTNodeKind'
import { SemanticOperation } from './SemanticOperation'

export class EdenTree extends SemanticOperation {
  nothing: Action = () => ({ kind: ASTNodeKind.Nothing })
  integerLiteral: Action = (digits: Node) => ({
    kind: ASTNodeKind.IntLit,
    numericValue: Number(digits.sourceString)
  })
}
