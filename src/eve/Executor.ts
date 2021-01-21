import { Instruction, VM, ixTable } from "./types";

// class Instruction { constructor(public opcode: Opcode) {} }
// class Program { constructor(public instructions: Instruction[]) {} }
// Executor: wrapper around raw vm
// 'performs' instructions, i.e.
// take instruction + decode bytecode + interact with vm
// (ideally in a traceable way...?)
export class Executor {
  static perform(instruction: Instruction, _vm: VM) {
    let instructionName = ixTable[instruction.opcode];
    if (_vm[instructionName]) {
      let callee = _vm[instructionName].bind(_vm);
      // console.log("[Executor.perform]", { instruction, instructionName, callee });
      callee(instruction.operandOne);
    } else {
      throw new Error("[Executor] Instruction table does not have entry " + instruction.opcode);
    }
  }
}
