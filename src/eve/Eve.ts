import { EveNull } from "./EveNull";
import { EveVM } from "./EveVM";
// import { instructionTable } from "./InstructionTable";
import { VM, Program, EveValue } from "./types";

export class Eve {
  vm: VM = new EveVM();

  execute(program: Program): EveValue {
    Eve.runOnce(program, this.vm);
    let top = this.vm.stack[this.vm.stack.length - 1];
    if (top !== undefined) {
      return top;
    } else {
      return new EveNull();
    }
  }

  static runOnce(program: Program, vm: VM) {
    // console.log("[Eve.runOnce] Program: "
    // program.map((instruction, index) => `\n\t${index}: ${instructionTable[instruction.opcode]}`)
    // );
    vm.driver.load(program)
    vm.driver.runUntilHalt()
  }
}
