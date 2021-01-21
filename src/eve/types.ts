import { EveInteger } from "./EveInteger";
import { EveNull } from "./EveNull";
import { EveString } from "./EveString";
import { Opcode } from "./Opcode";
import { Operation } from "./Operation";
import { RegistryKey } from "./RegistryKey";

type OperandByte = number
type Instruction = {
  opcode: Opcode,
  operandOne?: OperandByte
};
type Program = Instruction[];
type JSValue = number | string | null
type EveValue = EveNull | EveInteger | EveString
type VMMethod = (operandOne?: number, operandTwo?: number) => void 
type VMKernel = { [key in Operation]: VMMethod }

type Stack = EveValue[]
type Register = { [key in RegistryKey]: EveValue } 
type ConstantPool = EveValue[]
// type Locals = EveValue[]

export abstract class VMDriver {
  abstract load(program: Program): void
  abstract runUntilHalt(): void
  abstract get currentProgramName(): string;
  abstract get instructionPointer(): number;
}

type VM = VMKernel & {
  driver: VMDriver,
  constants: ConstantPool,
  stack: Stack,
  registry: Register,
}

export { 
  Instruction,
  Stack, Register, ConstantPool,
  Program, JSValue,
  VM, EveValue
}
