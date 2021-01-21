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
type VM = VMKernel & {
  constants: EveValue[],
  stack: Stack,
  registry: Register,
}
export { 
  Instruction,
  Stack, Register,
  Program, JSValue,
  VM, EveValue
}
