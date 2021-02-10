import assertNever from 'assert-never'
import { Opcode } from '../eve/vm/Opcode'
import { BinaryOperator } from './BinaryOperator'

export function opcodeForBinaryOperation(binaryOperator: BinaryOperator): Opcode {
  switch (binaryOperator) {
  case BinaryOperator.Add: return Opcode.INT_ADD
  case BinaryOperator.Subtract: return Opcode.INT_SUB
  case BinaryOperator.Multiply: return Opcode.INT_MUL
  case BinaryOperator.Divide: return Opcode.INT_DIV
  case BinaryOperator.Power: return Opcode.INT_POW
  case BinaryOperator.Modulus: return Opcode.INT_MOD
  /* istanbul ignore next */
  default: assertNever(binaryOperator)
  }
}
