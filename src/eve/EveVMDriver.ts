import { VM, Program } from "./types";
import { VMDriver } from "./VMDriver";
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
    this.instructionPointer = 0;
    if (program) {
      this.currentProgramName = programName;
      let nextInstruction = program[0];
      while(true) {
        let oldIp = this.instructionPointer;
        Executor.perform(nextInstruction, this.vm);
        if (oldIp === this.instructionPointer) {
          // vm didn't move the ip => so increment it
          this.instructionPointer++
        }
        nextInstruction = program[this.instructionPointer];
        if (!nextInstruction) { break; }
      }
      this.currentProgramName = '';
    } else {
      console.warn("no such program " + programName);
    }
  }
}
