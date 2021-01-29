/* eslint-disable @typescript-eslint/no-unused-vars */
import chalk from 'chalk'
import { Eve } from '../eve/Eve'
import { Instruction, JSValue } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { EdenParser } from './EdenParser'
import { EdenTreeInspector } from './EdenTreeInspector'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'
import { CodeEngine, TreeInspector } from './types'

export class EdenInterpreter implements Interpreter {
  config = { debug: true }
  engine: CodeEngine = new EdenCodeEngine()
  parser: Parser = new EdenParser()
  prettyPrinter: TreeInspector = new EdenTreeInspector()

  eve = new Eve()
  evaluate(_input: string): JSValue {
    const ast = this.parser.parse(_input)
    if (this.config.debug) {
      const prettyAst = chalk.blue(this.prettyPrint(ast))
      console.log(prettyAst)
    }
    if (ast.kind === ASTNodeKind.Nothing) {
      // we might have a parse error comment to display..
      console.warn(ast.comment)
      return null
    } else {
      const code = this.interpret(ast)
      this.eve.vm.constantPool = this.engine.constants /// hmmmm -- we need to share it w codegen..
      return this.eve.execute(code).js
    }
  }

  private interpret(ast: ASTNode): Instruction[] {
    const code = this.engine[ast.kind](ast)
    return code
  }

  private prettyPrint(ast: ASTNode): string {
    const pretty = this.prettyPrinter[ast.kind](ast)
    return pretty
  }
}