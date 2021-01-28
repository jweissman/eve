/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ASTNode } from './ASTNode'
import { BinaryOperator } from './BinaryOperator'
import { TreeInspector } from './types'

// tree pretty printer
export class EdenTreeInspector implements TreeInspector {
  emptyProgram = () => '( _mu_ )';

  integerLiteral = ({ numericValue }: { numericValue?: number; }) => String(numericValue);

  binaryExpression = ({ operator, children }: { operator?: BinaryOperator; children?: ASTNode[]; }) =>
    children
      ? ('(' + this.inspect(children[0]) + ' ' + operator + ' ' + this.inspect(children[1]) + ')')
      : '-- error, no children for binary op --';

  identifier = ({ name }: { name?: string; }) => name || '-- id w/o name? --';

  assignment = ({ children }: { children?: ASTNode[]; }) =>
    children
      ? (this.inspect(children[0]) + ' = ' + this.inspect(children[1]))
      : '-- error, no children for assignment --'

  private inspect(node: ASTNode): string { return this[node.kind](node) }
}
