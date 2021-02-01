import { Instruction } from './types'
import { instructionTable } from './InstructionTable'
import chalk from 'chalk'

export function prettyInstruction(instruction: Instruction): string {
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
