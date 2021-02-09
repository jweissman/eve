import { Instruction, VM, VMMethod } from './types'
import { instructionTable } from './InstructionTable'
export class Executor {
  static debug = false
  static perform(
    instruction: Instruction,
    virtualMachine: VM
  ): void {
    const vmMethodCall = this.lookupVirtualMachineMethod(
      instruction,
      virtualMachine
    )
    vmMethodCall({
      operandOne: instruction.operandOne,
      operandTwo: instruction.operandTwo,
    })
  }

  static lookupVirtualMachineMethod(instruction: Instruction, vm: VM): VMMethod {
    const instructionName = instructionTable[instruction.opcode]
    if (!instructionName) {
      throw new Error('[Executor] Instruction table does not have entry ' + instruction.opcode)
    }
    if (!vm[instructionName]) {
      throw new Error('[Executor] Virtual machine does not implement ' + instructionName + ' (' + instruction.opcode + ')')
    }
    const vmMethodCall = vm[instructionName].bind(vm)
    return vmMethodCall
  }
}
