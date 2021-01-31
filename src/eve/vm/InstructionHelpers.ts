import { Opcode } from './Opcode'
import { Instruction } from './types'

// build an instruction
const inst =
  (opcode: Opcode, operandOne?: number): Instruction => {
    return { opcode, operandOne }
  }

const label = (labelName: string): Instruction => {
  return { opcode: Opcode.NOOP, label: labelName }
}

const goto = (labelName: string): Instruction => {
  return { opcode: Opcode.GOTO, targetLabel: labelName }
}

const call = (labelName: string, arity = 0): Instruction => {
  return { opcode: Opcode.CALL, targetLabel: labelName, operandTwo: arity }
}



export { inst, label, goto, call }