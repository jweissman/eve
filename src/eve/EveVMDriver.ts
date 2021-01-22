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
    let optimized: Program = EveVMDriver.optimize(program);
    this.programLibrary[name] = optimized;
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
      throw new Error('no such program ' + programName)
    }
  }

  static optimize = (program: Program): Program => program.map(instruction => {
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
}
