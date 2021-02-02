/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ASTNode, isIdentifier, isIntLit } from './ASTNode'
import { BinaryOperator } from './BinaryOperator'
import { TreeInspector } from './types'

// tree pretty printer
export class EdenTreeInspector implements TreeInspector {
  emptyProgram = () => '( _mu_ )';
  program = ({ children }: { children: ASTNode[]}) =>
    children.map(child => this.inspect(child)).join(';\n')

  integerLiteral = (intLit: ASTNode) => isIntLit(intLit) ? String(intLit.numericValue) : '?';

  binaryExpression = ({ operator, children }: { operator?: BinaryOperator; children: ASTNode[]; }) =>
    this.inspect(children[0]) + ' ' + operator + ' ' + this.inspect(children[1])

  identifier = (node: ASTNode) => isIdentifier(node) ? node.name : '-- ?id w/o name? --'

  assignment = (node: ASTNode) => this.inspect(node.children[0]) + ' = ' + this.inspect(node.children[1]);

  private inspect(node: ASTNode): string { return this[node.kind](node) }
}
