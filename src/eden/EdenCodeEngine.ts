/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import assertNever from 'assert-never'
import { EveInteger } from '../eve/vm/data-types/EveInteger'
import { inst } from '../eve/vm/InstructionHelpers'
import { Opcode } from '../eve/vm/Opcode'
import { ConstantPool, Instruction } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { BinaryOperator } from './BinaryOperator'
import { CodeEngine } from './types'

// bytecode generator
export class EdenCodeEngine implements CodeEngine {
  public constants: ConstantPool = [];
  emptyProgram = () => [];

  integerLiteral = ({ numericValue }: { numericValue?: number; }) => ([
    ...(numericValue ? [
      this.loadIntegerConstant(numericValue)
    ] : [])
  ]);

  binaryExpression = ({ operator, children }: {
    operator?: BinaryOperator;
    children?: ASTNode[];
  }) => (operator && children) ? [
    ...children.flatMap((child: ASTNode) => this.codegen(child)),
    inst(this.binaryOperation(operator))
  ] : [];

  private binaryOperation(binaryOperator: BinaryOperator): Opcode {
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
}
