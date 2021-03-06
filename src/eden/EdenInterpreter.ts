/* eslint-disable @typescript-eslint/no-unused-vars */
import { Eve } from '../eve/Eve'
import { EveValue, Instruction } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
// import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { EdenParser } from './EdenParser'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'
import { CodeEngine } from './types'

export class EdenInterpreter implements Interpreter {
  engine: CodeEngine = new EdenCodeEngine()
  parser: Parser = new EdenParser()
  eve = new Eve()

  evaluate(input: string): EveValue {
    const ast = this.parser.parse(input)
    // if (ast.kind === ASTNodeKind.Nothing) {
    //   console.error(ast.comment)
    //   throw new Error(ast.comment)
    // }
    const code = this.interpret(ast)
    this.eve.vm.constantPool = this.engine.constants
    return this.eve.execute(code)
  }

  private interpret(ast: ASTNode): Instruction[] {
    const code = this.engine[ast.kind](ast)
    return code
  }
}
