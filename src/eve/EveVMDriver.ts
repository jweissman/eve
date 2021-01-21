import { VM, Program, VMDriver } from "./types";
import { Executor } from "./Executor";

export class EveVMDriver extends VMDriver {
  private programLibrary: { [key: string]: Program; } = { _main: [] };
  currentProgramName: string = '';
  instructionPointer = 0;

  constructor(private vm: VM) { super(); }

  load(program: Program, name: string = '_program') {
    this.programLibrary[name] = program;
  }

  runUntilHalt(programName: string = '_program') {
    let program = this.programLibrary[programName];
    this.instructionPointer = -1;
    if (program) {
      this.currentProgramName = programName;
      program.forEach(instruction => {
        this.instructionPointer++;
        Executor.perform(instruction, this.vm);
      });
      this.currentProgramName = '';
    } else {
      throw new Error("no such program " + programName);
    }
  }
}
