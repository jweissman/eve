import { Opcode } from './Opcode'
import { Operation } from './Operation'

type InstructionTable = { [key in Opcode]: Operation } 
const instructionTable: InstructionTable = {
  [Opcode.ASTORE]: Operation.AddToStore,
  [Opcode.GOTO]: Operation.Goto,
  [Opcode.INT_ADD]: Operation.IntegerAdd,
  [Opcode.INT_SUB]: Operation.IntegerSubtract,
  [Opcode.INT_MUL]: Operation.IntegerMultiply,
  [Opcode.INT_DIV]: Operation.IntegerDivide,
  [Opcode.INT_POW]: Operation.IntegerExponentiate,
  [Opcode.INT_MOD]: Operation.IntegerModulo,
  [Opcode.JUMP]: Operation.Jump,
  [Opcode.JUMP_Z]: Operation.JumpIfZero,
  [Opcode.LCONST_IDX]: Operation.LoadConstantByIndex,
  [Opcode.LCONST_ONE]: Operation.LoadConstantOne,
  [Opcode.LCONST_TWO]: Operation.LoadConstantTwo,
  [Opcode.LCONST_ZERO]: Operation.LoadConstantZero,
  [Opcode.LSTORE]: Operation.LoadFromStore,
  [Opcode.NOOP]: Operation.NoOperation,
  [Opcode.POP2]: Operation.PopTwo,
  [Opcode.POP]: Operation.Pop,
  [Opcode.STR_JOIN]: Operation.StringJoin,
  [Opcode.THROW]: Operation.Throw,
}

export { instructionTable }