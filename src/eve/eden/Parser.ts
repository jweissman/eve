import { ASTNode } from './ASTNode'

export interface Parser {
  parse(input: string): ASTNode
}
