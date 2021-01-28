import { ASTNodeKind } from './ASTNodeKind'
import { BinaryOperator } from './BinaryOperator'

export type ASTNode = {
  children: ASTNode[];
  id?: string;
  name?: string;
  kind: ASTNodeKind;
  comment?: string;
  numericValue?: number;
  operator?: BinaryOperator;
};
