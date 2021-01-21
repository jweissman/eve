import { eveNull, EveVM } from "./EveVM";
import { Executor } from "./Executor";
import { VM, Program, EveValue, Instruction } from "./types";
import { Opcode } from "./Opcode";

class Runner {
  vm: VM = new EveVM()

  execute(program: Program): EveValue {
    Runner.runOnce(program, this.vm);
    let top = this.vm.stack[this.vm.stack.length-1];
    if (top !== undefined) {
      return top;
    } else {
      return eveNull;
    }
  }

  static runOnce(program: Program, vm: VM) {
    program.forEach(instruction => Executor.perform(instruction, vm));
  }
}

const instruction =
  (opcode: Opcode, operandOne?: number): Instruction => {
    return { opcode, operandOne }
  }

export { instruction }
export default { Runner }
