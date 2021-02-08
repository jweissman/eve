import { MatchResult } from 'ohm-js'
import { ASTNode, isExpressionList } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { edenGrammar } from './EdenGrammar'
import { edenSemantics } from './EdenSemantics'
import { Parser } from './Parser'

export class EdenParser implements Parser {
  parse(input: string): ASTNode {
    const match: MatchResult = edenGrammar.match(input)
    if (match.failed()) {
      const empty: ASTNode = {
        children: [],
        kind: ASTNodeKind.Nothing,
        comment: 'EdenParser: match failed at ' + match.message
      }
      return empty
    } else {
      const semantics = edenSemantics(match)
      const ast = semantics.tree()
      if (isExpressionList(ast)) {
        if (ast.children.length === 1) { return ast.children[0] }
      }
      return ast
    }
  }
}
