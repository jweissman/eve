import { VM, Program } from "./types";
import { VMDriver } from "./VMDriver";
import { Executor } from "./Executor";
import { Opcode } from "./Opcode";

export class EveVMDriver extends VMDriver {
  private programLibrary: { [key: string]: Program; } = { _main: [] };
  currentProgramName: string = '';
  instructionPointer = 0;

  constructor(private vm: VM) { super(); }

  load(program: Program, name: string = '_program') {
    // could optimize the program -- not having to seek indexOf every time...
    let optimized: Program = program.map(instruction => {
      let newInstruction = { ...instruction }
      if (instruction.opcode === Opcode.GOTO) {
        let targetInstruction = program.find((inst) => inst.label === instruction.targetLabel);
        if (targetInstruction) {
        // replace with unconditional jump
          newInstruction.opcode = Opcode.JUMP;
          newInstruction.operandOne = program.indexOf(targetInstruction);
        }
      }
      return newInstruction
    })

    this.programLibrary[name] = optimized;
  }

  get program(): Program {
    return this.programLibrary[this.currentProgramName]
  }

  getProgramOffsetForLabel(label: string): number {
    let targetInstruction = this.program.find((instruction) => instruction.label === label);
    if (targetInstruction) {
      return this.program.indexOf(targetInstruction);
    }
    throw new Error("Could not find offset for label " + label)
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
