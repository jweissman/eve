import { ASTNodeKind } from './ASTNodeKind';

export type ASTNode = {
  id?: string;
  kind: ASTNodeKind;
  children?: ASTNode[];
  comment?: string;
  numericValue?: number;
};
