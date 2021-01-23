import { EveNull } from './vm/data-types/EveNull'
import { EveVM } from './vm/driver/EveVM'
import { VM, Program, EveValue } from './vm/types'

export class Eve {
  vm: VM = new EveVM();

  execute(program: Program): EveValue {
    Eve.runOnce(program, this.vm)
    const top = this.vm.stack[this.vm.stack.length - 1]
    if (top !== undefined) {
      return top
    } else {
      return new EveNull()
    }
  }

  static runOnce(program: Program, vm: VM): void {
    vm.driver.load(program)
    vm.driver.runUntilHalt()
  }
}
