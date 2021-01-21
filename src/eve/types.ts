import { Opcode } from "./Opcode";
import { Operation } from "./Operation";

export type OperandByte = number
export type Instruction = {
  opcode: Opcode,
  operandOne?: OperandByte,
  label?: string, // i guess the idea is that this is just a comment for debug purposes?
                  // will not make it into compiled bytecode i don't think
};
export type Program = Instruction[];

type InstructionTable = { [key in Opcode]: Operation } 
export const ixTable: InstructionTable = {
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
};

export type JSValue = number | string | null

abstract class EveDataType {
  abstract get js(): JSValue
}

export class EveNull implements EveDataType {
  get js(): null { return null }
}

export class EveInteger implements EveDataType {
  private internalValue: number;
  constructor(value: any) { this.internalValue = Number(value); }
  get js(): number { return Number(this.internalValue) }
}

export class EveString implements EveDataType {
  private internalValue: string;
  constructor(value: any) { this.internalValue = String(value); }
  get js(): string { return String(this.internalValue) }
}

type EveValue = EveNull | EveInteger | EveString

// interface VMError { kind: 'error', message: string }
// interface VMOkay { kind: 'ok', message: string }
// type VMResult = VMError | VMOkay
// VMResult

type VMMethod = (arg?: number) => void 

type VMKernel = {
  [key in Operation]: VMMethod
}

type VM = VMKernel & { constants: EveValue[], stack: EveValue[] }

export { VM, EveValue }