/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EveInteger } from '../eve/vm/data-types/EveInteger'
import { inst } from '../eve/vm/InstructionHelpers'
import { Opcode } from '../eve/vm/Opcode'
import { RegistryKey } from '../eve/vm/RegistryKey'
import { ConstantPool, Instruction } from '../eve/vm/types'
import { ASTNode, isAssignment, isBinaryExpression, isIdentifier, isIntLit } from './ASTNode'
import { opcodeForBinaryOperation } from './opcodeForBinaryOperation'
import { CodeEngine } from './types'

// vm bytecode generator
export class EdenCodeEngine implements CodeEngine {
  public constants: ConstantPool = [];
  public identifiers: { [key: string]: RegistryKey } = {}

  emptyProgram = () => [];
  program = ({ children }: { children: ASTNode[]}) =>
    children.map(child => this.codegen(child)).flat()

  integerLiteral = (intLit: ASTNode) => {
    if (!isIntLit(intLit)) { throw new Error('expected integer literal') }
    return [ this.loadIntegerConstant(intLit.numericValue) ]
  };

  binaryExpression = (expr: ASTNode) => {
    if (!isBinaryExpression(expr)) { throw new Error('Expected binary expression') }
    return [
      ...expr.children.flatMap((child: ASTNode) => this.codegen(child)),
      inst(opcodeForBinaryOperation(expr.operator))
    ]
  }

  // in general we want to load ids from local vars
  identifier = (id: ASTNode) => {
    if (!isIdentifier(id)) { throw new Error('expected id to be id?') } 
    return [
      inst(Opcode.LSTORE, this.findOrCreateRegisterForIdentifier(id.name))
    ]
  }

  assignment = (assign: ASTNode) => {
    if (!isAssignment(assign)) { throw new Error('expected assignment')}
    const [ left, right ]: ASTNode[] = assign.children
    if (!isIdentifier(left)) { throw new Error('cannot construct assignment with a non-identifier lhs?') }
    return [
      ...this.codegen(right),
      inst(Opcode.ASTORE, this.findOrCreateRegisterForIdentifier(left.name)),
    ]
  }

  private codegen(node: ASTNode): Instruction[] {
    return this[node.kind](node)
  }

  private loadIntegerConstant(value: number) {
    if (value === 0) {
      return inst(Opcode.LCONST_ZERO)
    } else if (value === 1) {
      return inst(Opcode.LCONST_ONE)
    } else if (value === 2) {
      return inst(Opcode.LCONST_TWO)
    }

    return inst(
      Opcode.LCONST_IDX, this.findOrCreateIntegerConstant(value)
    )
  }

  private findOrCreateIntegerConstant(value: number): number {
    const exists = this.constants.find(c => c instanceof EveInteger && c.js === value)
    if (exists) {
      return this.constants.indexOf(exists)
    } else {
      return this.constants.push(new EveInteger(value)) - 1
    }
  }

  get idPool(): Set<RegistryKey> { return new Set(Object.values(this.identifiers)) }

  private findOrCreateRegisterForIdentifier(id: string): number {
    const exists = Object.keys(this.identifiers).includes(id)
    if (!exists) {
      this.identifiers[id] = this.idPool.size
    }
    return this.identifiers[id]
  }
}
