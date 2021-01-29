import { Instruction, VM } from './types'
import { instructionTable } from './InstructionTable'
import chalk from 'chalk'

const prettyInstruction = (instruction: Instruction): string => {
  const instructionName = instructionTable[instruction.opcode]
  let pretty = chalk.magenta(instructionName) 
  if (instruction.operandOne !== undefined) {
    pretty += ' ' + chalk.gray(instruction.operandOne)
  }
  if (instruction.label !== undefined) {
    pretty += ' ' + chalk.gray(instruction.label)
  }
  return pretty
}

export class Executor {
  static debug = false
  static perform(
    instruction: Instruction,
    virtualMachine: VM
  ): void {
    const instructionName = instructionTable[instruction.opcode]
    if (instructionName) {
      if (virtualMachine[instructionName]) {
        if (Executor.debug) {
          console.log(prettyInstruction(instruction))
        }
        const vmMethodCall = virtualMachine[instructionName].bind(virtualMachine)
        vmMethodCall({
          operandOne: instruction.operandOne,
          operandTwo: instruction.operandTwo,
        })
      } else {
        throw new Error('[Executor] Virtual machine does not implement ' + instructionName + ' (' + instruction.opcode + ')')
      }
    } else {
      throw new Error('[Executor] Instruction table does not have entry ' + instruction.opcode)
    }
  }
}
