import { Opcode } from "./Opcode";
import { Operation } from "./Operation";

type InstructionTable = { [key in Opcode]: Operation } 
const instructionTable: InstructionTable = {
  [Opcode.NOOP]: Operation.NoOperation,

  [Opcode.LCONST_ZERO]: Operation.LoadConstantZero,
  [Opcode.LCONST_ONE]: Operation.LoadConstantOne,
  [Opcode.LCONST_TWO]: Operation.LoadConstantTwo,
  [Opcode.LCONST_IDX]: Operation.LoadConstantByIndex,
  [Opcode.INT_ADD]: Operation.IntegerAdd,
  [Opcode.STR_JOIN]: Operation.StringJoin,

  [Opcode.ASTORE]: Operation.AddToStore,
  [Opcode.LSTORE]: Operation.LoadFromStore,

  [Opcode.POP]: Operation.Pop,
  [Opcode.POP2]: Operation.PopTwo,

  [Opcode.JUMP]: Operation.Jump,
  [Opcode.JUMP_Z]: Operation.JumpIfZero,

  [Opcode.THROW]: Operation.Throw,

  [Opcode.GOTO]: Operation.Goto,
};

export { instructionTable };