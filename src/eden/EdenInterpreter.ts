/* eslint-disable @typescript-eslint/no-unused-vars */
import { Eve } from '../eve/Eve'
import { Instruction, JSValue } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { EdenParser } from './EdenParser'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'
import { CodeEngine } from './types'

export class EdenInterpreter implements Interpreter {
  config = { debug: true }
  engine: CodeEngine = new EdenCodeEngine()
  parser: Parser = new EdenParser()
  eve = new Eve()
  evaluate(_input: string): JSValue {
    const ast = this.parser.parse(_input)
    if (ast.kind === ASTNodeKind.Nothing) {
      if (this.config.debug) { console.warn(ast.comment) }
      return null
    } else {
      const code = this.interpret(ast)
      this.eve.vm.constantPool = this.engine.constants
      return this.eve.execute(code).js
    }
  }

  private interpret(ast: ASTNode): Instruction[] {
    const code = this.engine[ast.kind](ast)
    return code
  }
}
