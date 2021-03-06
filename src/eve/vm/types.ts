import { EveInteger } from './data-types/EveInteger'
import { EveNull } from './data-types/EveNull'
import { EveString } from './data-types/EveString'
import { Driver } from './driver/Driver'
import { Opcode } from './Opcode'
import { Operation } from './Operation'
import { RegistryKey } from './RegistryKey'

type OperandByte = number
type Instruction = {
  // opcode indicates the instruction to execute
  opcode: Opcode,

  // some operations require arguments (operands)
  operandOne?: OperandByte,
  operandTwo?: OperandByte,

  // support gotos
  // (in practice we optimize these to unconditional jumps!)
  label?: string,
  targetLabel?: string,
}
type Program = Instruction[];
type JSValue = number | string | null
type EveValue = EveNull | EveInteger | EveString

type Frame = { 
  instructionPointer: number
  stack: Stack
}

type VMMethodArgs = Partial<{
  operandOne: number,
  operandTwo: number,
  targetLabel: string
}>
type VMMethod = (instruction?: VMMethodArgs) => void 

type VMKernel = { [key in Operation]: VMMethod }

type Stack = EveValue[]
type Register = { [key in RegistryKey]?: EveValue } 
type ConstantPool = EveValue[]
// type MethodPool = { programOffset: number }[]

type VM = VMKernel & {
  constantPool: ConstantPool
  // methodPool: MethodPool
  stack: Stack
  readonly driver: Driver
  readonly registry: Register
  readonly halted: boolean
  readonly top: EveValue
  readonly second: EveValue

  // ()
}

export { 
  VMMethod, VMMethodArgs,
  Instruction,
  Stack, Register, Frame,
  ConstantPool,
  Program, JSValue,
  VM, EveValue
}
