import { ASTNodeKind } from './ASTNodeKind'
import { BinaryOperator } from './BinaryOperator';

export type ASTNode = {
  id?: string;
  kind: ASTNodeKind;
  children?: ASTNode[];
  comment?: string;
  numericValue?: number;
  operator?: BinaryOperator;
};
