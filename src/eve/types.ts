enum Operation {
  NoOperation = 'noop',
  LoadConstantZero = 'load_const_zero',
  LoadConstantOne = 'load_const_one',
  LoadConstantTwo = 'load_const_two',

  IntegerAdd = 'add_integers',
  // LongJump = 'long_jmp',
  IntegerCreate = 'create_integer',

  StringCreate = 'create_string',
  StringJoin = 'join_strings',
};

export enum Opcode {
  NOOP = 0xfe,
  LCONST_ZERO = 0x00,
  LCONST_ONE = 0x01,
  LCONST_TWO = 0x02,
  INT_CREATE = 0xa0,
  INT_ADD = 0xa1,
  STR_CREATE = 0xb0,
  STR_JOIN = 0xb1,
};

export type InstructionArgument = (number | string) & { kind: 'ix-arg' }
export type Instruction = {
  opcode: Opcode,
  label?: string,
  value?: InstructionArgument,
};
export type Program = Instruction[];

type InstructionTable = { [key in Opcode]: Operation } 
export const ixTable: InstructionTable = {
  [Opcode.NOOP]: Operation.NoOperation,

  [Opcode.LCONST_ZERO]: Operation.LoadConstantZero,
  [Opcode.LCONST_ONE]: Operation.LoadConstantOne,
  [Opcode.LCONST_TWO]: Operation.LoadConstantTwo,
  [Opcode.INT_ADD]: Operation.IntegerAdd,
  [Opcode.INT_CREATE]: Operation.IntegerCreate,

  [Opcode.STR_JOIN]: Operation.StringJoin,
  [Opcode.STR_CREATE]: Operation.StringCreate,
};

export type JSValue = number | string | null

abstract class EveDataType {
  abstract get js(): JSValue
}

export class EveNull implements EveDataType {
  // kind = 'eve-null'
  get js(): null { return null }
}

export class EveInteger implements EveDataType {
  // kind = 'eve-int'
  private internalValue: number;
  constructor(value: any) { this.internalValue = Number(value); }
  get js(): number { return Number(this.internalValue) }
}

// const isEveInt = (val: any): val is EveInteger

export class EveString implements EveDataType {
  // kind = 'eve-string'
  private internalValue: string;
  constructor(value: any) { this.internalValue = String(value); }
  get js(): string { return String(this.internalValue) }
}

export type EveValue = EveNull | EveInteger | EveString

export type VMResult = EveValue

type VMMethod = (arg: InstructionArgument) => VMResult
export type VM = { [key in Operation]: VMMethod }
