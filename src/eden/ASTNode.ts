import { ASTNodeKind } from './ASTNodeKind'
import { BinaryOperator } from './BinaryOperator'

type ASTNodeCommon = {
  kind: ASTNodeKind;
  children: ASTNode[];
  comment?: string;
}

type ASTNothing = ASTNodeCommon & { kind: ASTNodeKind.Nothing }

export type ASTIdentifier = ASTNodeCommon & { kind: ASTNodeKind.Identifier, name: string }
export function isIdentifier(node: ASTNode): node is ASTIdentifier {
  return node.kind === ASTNodeKind.Identifier
}
export function identifier(value: string): ASTIdentifier {
  return { kind: ASTNodeKind.Identifier, name: value, children: [] }
}

export type ASTIntegerLiteral = ASTNodeCommon & { kind: ASTNodeKind.IntLit, numericValue: number }
export function isIntLit(node: ASTNode): node is ASTIntegerLiteral {
  return node.kind === ASTNodeKind.IntLit
}
export function integerLiteral(value: number): ASTIntegerLiteral {
  return { kind: ASTNodeKind.IntLit, numericValue: value, children: [] }
}

export type ASTBinaryExpression = ASTNodeCommon & { kind: ASTNodeKind.BinaryExpression, operator: BinaryOperator }
export function isBinaryExpression(node: ASTNode): node is ASTBinaryExpression {
  return node.kind === ASTNodeKind.BinaryExpression
}
export function binaryExpression(operator: BinaryOperator, left: ASTNode, right: ASTNode): ASTBinaryExpression {
  return { kind: ASTNodeKind.BinaryExpression, operator, children: [ left, right ] }
}

export type ASTAssignment = ASTNodeCommon & { kind: ASTNodeKind.Assignment }
export function isAssignment(node: ASTNode): node is ASTAssignment {
  return node.kind === ASTNodeKind.Assignment
}
export function assignment(lhs: ASTNode, rhs: ASTNode): ASTAssignment {
  return {
    kind: ASTNodeKind.Assignment,
    children: [
      lhs, rhs
    ]
  }
}

export type ASTNode = ASTNothing
  | ASTIdentifier
  | ASTIntegerLiteral
  | ASTBinaryExpression
  | ASTAssignment
