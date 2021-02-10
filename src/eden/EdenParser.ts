import { MatchResult } from 'ohm-js'
import { ASTNode, isExpressionList } from './ASTNode'
import { edenGrammar } from './EdenGrammar'
import { edenSemantics } from './EdenSemantics'
import { Parser } from './Parser'
export class EdenParser implements Parser {
  parse(input: string): ASTNode {
    const match: MatchResult = edenGrammar.match(input)
    if (match.failed()) {
      const parseError = `Match failed at ${match.message}`
      return this.fail(parseError)
    }
    const semantics = edenSemantics(match)
    return this.simplify(semantics.tree())
  }

  private simplify = (ast: ASTNode): ASTNode =>
    (isExpressionList(ast) && ast.children.length === 1)
      ? ast.children[0]
      : ast

  private fail = (comment: string): ASTNode => {
    throw new Error('EdenParser: ' + comment)
  }
}
