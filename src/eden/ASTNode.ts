import { ASTNodeKind } from './ASTNodeKind'
import { BinaryOperator } from './BinaryOperator'

type ASTNodeCommon = {
  kind: ASTNodeKind;
  children: ASTNode[];
  id?: string;
  name?: string;
  comment?: string;
  numericValue?: number;
  operator?: BinaryOperator;
}

type ASTNothing = ASTNodeCommon & { kind: ASTNodeKind.Nothing }

export type ASTIdentifier = ASTNodeCommon & { kind: ASTNodeKind.Identifier, name: string }
export function isIdentifier(node: ASTNode): node is ASTIdentifier {
  return node.kind === ASTNodeKind.Identifier
}

type ASTIntegerLiteral = ASTNodeCommon & { kind: ASTNodeKind.IntLit, numericValue: number }
export function isIntLit(node: ASTNode): node is ASTIntegerLiteral {
  return node.kind === ASTNodeKind.IntLit
}


type ASTBinaryExpression = ASTNodeCommon & { kind: ASTNodeKind.BinaryExpression, operator: BinaryOperator }
export function isBinaryExpression(node: ASTNode): node is ASTBinaryExpression {
  return node.kind === ASTNodeKind.BinaryExpression
}

type ASTAssignment = ASTNodeCommon & { kind: ASTNodeKind.Assignment }
export function isAssignment(node: ASTNode): node is ASTAssignment {
  return node.kind === ASTNodeKind.Assignment
}

export type ASTNode = ASTNothing
                    | ASTIdentifier
                    | ASTIntegerLiteral
                    | ASTBinaryExpression
                    | ASTAssignment
                    // | ASTNodeCommon;
