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
      inst(
        Opcode.LCONST_IDX, this.constants.push(new EveInteger(numericValue)) - 1
      )
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
    default: assertNever(binaryOperator)
    }
  }

  private codegen(node: ASTNode): Instruction[] {
    return this[node.kind](node)
  }
}
