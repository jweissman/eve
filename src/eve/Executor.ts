import { Instruction, VM } from "./types";
import { instructionTable as ixTable } from './InstructionTable'

export class Executor {
  static perform(instruction: Instruction, _vm: VM) {
    let instructionName = ixTable[instruction.opcode];
    if (_vm[instructionName]) {
      let callee = _vm[instructionName].bind(_vm);
      callee(
        instruction.operandOne
      );
    } else {
      throw new Error("[Executor] Instruction table does not have entry " + instruction.opcode);
    }
  }
}
