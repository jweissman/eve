import { MatchResult } from 'ohm-js'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { edenGrammar } from './EdenGrammar'
import { edenSemantics } from './EdenSemantics'

export class EdenParser {
  // edenSemantics: EdenSemantics = new EdenSemantics(edenGrammar)
  parse(input: string): ASTNode {
    const match: MatchResult = edenGrammar.match(input)
    if (match.failed()) {
      const empty: ASTNode = {
        id: 'mu',
        kind: ASTNodeKind.Nothing,
        comment: 'EdenParser: match failed at ' + match.message
      }
      return empty
    } else {
      const semantics = edenSemantics(match)
      console.log(semantics.inspect())
      return semantics.tree()
    }
  }
}
