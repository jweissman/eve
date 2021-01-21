import { EveNull } from "./EveNull";
import { EveVM } from "./EveVM";
import { Executor } from "./Executor";
import { VM, Program, EveValue } from "./types";

export class Driver {
  vm: VM = new EveVM();

  execute(program: Program): EveValue {
    Driver.runOnce(program, this.vm);
    let top = this.vm.stack[this.vm.stack.length - 1];
    if (top !== undefined) {
      return top;
    } else {
      return new EveNull();
    }
  }

  static runOnce(program: Program, vm: VM) {
    program.forEach(instruction => Executor.perform(instruction, vm));
  }
}
