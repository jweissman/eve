import { VM, Program, Stack, EveValue } from '../types'
import { Opcode } from '../Opcode'
import { Executor } from '../Executor'
import { Driver } from './Driver'
import { FlightRecording } from './FlightRecording'
import { eveNull } from './EveVM'

type Frame = { 
  instructionPointer: number
  stack: Stack
}

export class EveDriver extends Driver {
  private programLibrary: { [key: string]: Program; } = { _main: [] };
  currentProgramName = '';
  frames: Frame[] = [{ instructionPointer: 0, stack: [] }]
  get topFrame(): Frame { return this.frames[this.frames.length - 1] }

  get instructionPointer(): number { return this.topFrame.instructionPointer }
  set instructionPointer(value: number) { this.topFrame.instructionPointer = value }

  get stack(): Stack { return this.topFrame.stack } 

  constructor(private vm: VM) { super() }

  pushStackFrame(frame: { programOffset: number }, arity: number): void {
    const args = []
    for (let i = 0; i < arity; i++) {
      const nextArg: EveValue = this.stack.pop() || eveNull
      if (nextArg) { args.push(nextArg) }
    }
    this.frames.push({
      instructionPointer: frame.programOffset,
      stack: args
    })
  }

  popStackFrame(): void {
    const retVal: EveValue = this.vm.top
    this.frames.pop()
    this.stack.push(retVal)
  }

  load(program: Program, name = '_program'): void {
    const optimized: Program = EveDriver.optimize(program)
    this.programLibrary[name] = optimized
  }

  // todo refactor?
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
        const oldFrameLength = this.frames.length
        Executor.perform(nextInstruction, this.vm)
        instructionsPerformed++
        if (oldIp === this.instructionPointer || this.frames.length !== oldFrameLength) {
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
    } else if (instruction.opcode === Opcode.CALL) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        // replace with call at program offset (todo -- args..? are there other things to do around a funcall..?)
        // newInstruction.opcode = Opcode.CALL
        newInstruction.operandOne = program.indexOf(targetInstruction)
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    }
    return newInstruction
  })
}
