/* eslint-disable @typescript-eslint/no-unused-vars */
import { Eve } from '../eve/Eve'
import { eveNull } from '../eve/vm/Constants'
import { EveValue, Instruction } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { EdenParser } from './EdenParser'
import { EdenTreeInspector } from './EdenTreeInspector'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'
import { CodeEngine } from './types'

export class EdenInterpreter implements Interpreter {
  // config = { debug: true }
  engine: CodeEngine = new EdenCodeEngine()
  parser: Parser = new EdenParser()
  prettyPrinter: EdenTreeInspector = new EdenTreeInspector()
  eve = new Eve()

  evaluate(input: string): EveValue {
    try {
      const ast = this.parser.parse(input)
      if (ast.kind === ASTNodeKind.Nothing) {
        // console.error(ast.comment)
        return eveNull
      } 
      const code = this.interpret(ast)
      this.eve.vm.constantPool = this.engine.constants
      return this.eve.execute(code)
    } catch (err) { console.error(err) }
    return eveNull
  }

  private interpret(ast: ASTNode): Instruction[] {
    // const pretty = this.prettyPrinter[ast.kind](ast)
    //     process.stdout.write(`     > ${pretty}
    // `)
    const code = this.engine[ast.kind](ast)
    return code
  }
}
