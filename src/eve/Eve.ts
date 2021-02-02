import chalk from 'chalk'
import { EveNull } from './vm/data-types/EveNull'
import { EveVM } from './vm/driver/EveVM'
import { VM, Program, EveValue } from './vm/types'

export class Eve {
  debug = false;
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
    const run = vm.driver.runUntilHalt()

    // todo analyze flight recordings
    if (run.timeElapsed > 1000) {
      console.log(chalk.gray(run.timeElapsed + 'ms elapsed'))
      // console.trace()
    }
    //   const ips = run.instructionsPerformed / run.timeElapsed
    //   console.log(chalk.gray(ips + ' instructions per millisecond'))
    //   if (run.instructionsPerformed > 1000000) {
    //     console.log(chalk.gray(run.instructionsPerformed / 1000000 + 'm instructions performed'))
    //   } else if (run.instructionsPerformed > 1000) {
    //     console.log(chalk.gray(run.instructionsPerformed / 1000 + 'k instructions performed'))
    //   }
    // }
  }
}
