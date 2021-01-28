import { MatchResult } from 'ohm-js'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { edenGrammar } from './EdenGrammar'
import { edenSemantics } from './EdenSemantics'
import { Parser } from './Parser'

export class EdenParser implements Parser {
  parse(input: string): ASTNode {
    const match: MatchResult = edenGrammar.match(input)
    if (match.failed()) {
      const empty: ASTNode = {
        id: 'mu',
        children: [],
        kind: ASTNodeKind.Nothing,
        comment: 'EdenParser: match failed at ' + match.message
      }
      return empty
    } else {
      const semantics = edenSemantics(match)
      const ast = semantics.tree()
      return ast
    }
  }
}
