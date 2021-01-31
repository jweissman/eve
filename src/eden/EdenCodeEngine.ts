/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import assertNever from 'assert-never'
import { EveInteger } from '../eve/vm/data-types/EveInteger'
import { inst } from '../eve/vm/InstructionHelpers'
import { Opcode } from '../eve/vm/Opcode'
import { RegistryKey } from '../eve/vm/RegistryKey'
import { ConstantPool, Instruction } from '../eve/vm/types'
import { ASTNode, isIdentifier, isIntLit } from './ASTNode'
import { BinaryOperator } from './BinaryOperator'
import { CodeEngine } from './types'

const binaryOperation = (binaryOperator: BinaryOperator): Opcode => {
  switch (binaryOperator) {
  case BinaryOperator.Add: return Opcode.INT_ADD
  case BinaryOperator.Subtract: return Opcode.INT_SUB
  case BinaryOperator.Multiply: return Opcode.INT_MUL
  case BinaryOperator.Divide: return Opcode.INT_DIV
  case BinaryOperator.Power: return Opcode.INT_POW
  case BinaryOperator.Modulus: return Opcode.INT_MOD
  default: assertNever(binaryOperator)
  }
}

// vm bytecode generator
export class EdenCodeEngine implements CodeEngine {
  public constants: ConstantPool = [];
  public identifiers: { [key: string]: RegistryKey } = {}

  emptyProgram = () => [];
  program = ({ children }: { children: ASTNode[]}) =>
    children.map(child => this.codegen(child)).flat()

  integerLiteral = (intLit: ASTNode) => (
    isIntLit(intLit) ? [
      this.loadIntegerConstant(intLit.numericValue)
    ] : []
  );

  binaryExpression = ({ operator, children }: {
    operator?: BinaryOperator;
    children?: ASTNode[];
  }) => (operator && children) ? [
    ...children.flatMap((child: ASTNode) => this.codegen(child)),
    inst(binaryOperation(operator))
  ] : [];

  // in general we want to load ids from local vars
  identifier = (id: ASTNode) => isIdentifier(id) ? [
    inst(Opcode.LSTORE, this.findOrCreateRegisterForIdentifier(id.name))
  ] : []

  // ...except for assignments, where we want to store the values to locals
  assignment = ({ children }: { children: ASTNode[]}) => {
    const [ left, right ]: ASTNode[] = children
    if (!isIdentifier(left)) {
      throw new Error('cannot construct assignment with a non-identifier lhs?')
    }
    // console.log(`[CodeEngine] assignment: ${JSON.stringify(left)} = ${JSON.stringify(right)}`)
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
