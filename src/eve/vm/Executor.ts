import { Instruction, VM } from './types'
import { instructionTable } from './InstructionTable'

export class Executor {
  static perform(
    instruction: Instruction,
    virtualMachine: VM
  ): void {
    const instructionName = instructionTable[instruction.opcode]
    if (virtualMachine[instructionName]) {
      const vmMethodCall = virtualMachine[instructionName].bind(virtualMachine)
      vmMethodCall({
        operandOne: instruction.operandOne,
        operandTwo: instruction.operandTwo,
      })
    } else {
      throw new Error('[Executor] Instruction table does not have entry ' + instruction.opcode)
    }
  }
}
