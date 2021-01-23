import { VM, Program } from '../types'
import { VMDriver } from './VMDriver'
import { Executor } from '../Executor'
import { Opcode } from '../Opcode'

type FlightRecording = {
  instructionsPerformed: number,
  timeElapsed: number
}

export class EveVMDriver extends VMDriver {
  private programLibrary: { [key: string]: Program; } = { _main: [] };
  currentProgramName = '';
  instructionPointer = 0;

  constructor(private vm: VM) { super() }

  load(program: Program, name = '_program'): void {
    const optimized: Program = EveVMDriver.optimize(program)
    this.programLibrary[name] = optimized
  }

  runUntilHalt(programName = '_program'): FlightRecording {
    const startTime = new Date().getTime()
    const program = this.programLibrary[programName]
    this.instructionPointer = 0
    let instructionsPerformed = 0
    if (program) {
      this.currentProgramName = programName
      let nextInstruction = program[0]
      while(!this.vm.halted && nextInstruction) {
        const oldIp = this.instructionPointer
        Executor.perform(nextInstruction, this.vm)
        instructionsPerformed++
        if (oldIp === this.instructionPointer) {
          // vm didn't move the ip => so increment it
          this.instructionPointer++
        }
        nextInstruction = program[this.instructionPointer]
      }
      this.currentProgramName = ''
    } else {
      throw new Error('no such program ' + programName)
    }

    const timeElapsed = new Date().getTime() - startTime
    const recording: FlightRecording = {
      instructionsPerformed,
      timeElapsed
    }
    return recording
  }

  static optimize = (program: Program): Program => program.map(instruction => {
    const newInstruction = { ...instruction }
    if (instruction.opcode === Opcode.GOTO) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        // replace with unconditional jump
        newInstruction.opcode = Opcode.JUMP
        newInstruction.operandOne = program.indexOf(targetInstruction)
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    }
    return newInstruction
  })
}
