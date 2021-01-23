/* eslint-disable @typescript-eslint/no-unused-vars */
import assertNever from 'assert-never'
import { Eve } from '../eve/Eve'
import { EveInteger } from '../eve/vm/data-types/EveInteger'
import { inst } from '../eve/vm/InstructionHelpers'
import { Opcode } from '../eve/vm/Opcode'
import { ConstantPool, Instruction, JSValue } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { BinaryOperator } from './BinaryOperator'
import { EdenParser } from './EdenParser'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'

// bytecode generator
type IxGenerator = (ast: ASTNode) => Instruction[]
type Engine = {
  [key in ASTNodeKind]: IxGenerator
} & { constants: ConstantPool}

class EdenEngine implements Engine {
  public constants: ConstantPool = []
  // get constantPool() { return this.constantPool }

  emptyProgram = () => []

  integerLiteral = ({ numericValue }: { numericValue?: number }) => ([
    ...(numericValue ? [
      inst(
        Opcode.LCONST_IDX, this.constants.push(new EveInteger(numericValue))-1
      )
    ] : [])
  ])

  binaryExpression = ({ operator, children }: {
    operator?: BinaryOperator
    children?: ASTNode[],
  }) => (operator && children) ? [
    ...children.flatMap((child: ASTNode) => this.codegen(child)),
    inst(this.binaryOperation(operator))
    // binaryOperator === BinaryOperator.Add ? inst(Opcode.INT_ADD)
  ] : []

  private binaryOperation(binaryOperator: BinaryOperator): Opcode {
    switch(binaryOperator) {
    case BinaryOperator.Add: return Opcode.INT_ADD
    case BinaryOperator.Subtract: throw new Error('subtract not impl')
    case BinaryOperator.Multiply: throw new Error('mul not impl')
    case BinaryOperator.Divide: throw new Error('div not impl')
    default: assertNever(binaryOperator)
    }
  }

  private codegen(node: ASTNode): Instruction[] {
    return this[node.kind](node)
  }
}

export class EdenInterpreter implements Interpreter {
  engine: Engine = new EdenEngine()
  parser: Parser = new EdenParser()
  evaluate(_input: string): JSValue {
    const ast = this.parser.parse(_input)
    const code = this.interpret(ast)
    // console.log("Parsed ast: " + JSON.stringify(ast))
    // const instructions = this.parser.codegen()
    // console.log('CODE', code)

    const eve = new Eve()
    // console.log("set constants", this.engine.constants)
    eve.vm.constantPool = this.engine.constants
    return eve.execute(code).js
    // throw new Error('EdenInterpreter.evalute: Method not implemented.')
  }

  private interpret(ast: ASTNode): Instruction[] {
    console.log('Interpret ast ' + JSON.stringify(ast))
    const code = this.engine[ast.kind](ast)
    return code
  }
}