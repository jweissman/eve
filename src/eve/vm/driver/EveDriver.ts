import { VM, Program, Stack, EveValue, Instruction } from '../types'
import { Opcode } from '../Opcode'
import { Executor } from '../Executor'
import { Driver } from './Driver'
import { FlightRecording } from './FlightRecording'
import { eveNull } from './EveVM'
import { Timer } from './Timer'

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

  runUntilHalt(programName = '_program'): FlightRecording {
    const program = this.programLibrary[programName]
    if (!program) { throw new Error('no such program ' + programName) }
    this.currentProgramName = programName
    this.instructionPointer = 0
    const flightPlan = () => this.followProgram(program)
    const [timeElapsed, instructionsPerformed] = Timer.measureMillis(flightPlan)
    this.currentProgramName = ''
    const recording: FlightRecording = {
      instructionsPerformed,
      timeElapsed
    }
    return recording
  }

  private followProgram(program: Program): number {
    let nextInstruction = program[0]
    let stepCount = 0
    while (!this.vm.halted && nextInstruction) {
      this.runOneInstruction(nextInstruction)
      stepCount++
      nextInstruction = program[this.instructionPointer]
    }
    return stepCount
  }

  runOneInstruction(instruction: Instruction): void {
    const oldIp = this.instructionPointer
    const oldFrameLength = this.frames.length
    Executor.perform(instruction, this.vm)
    if (oldIp === this.instructionPointer || this.frames.length !== oldFrameLength) {
      this.instructionPointer++
    }
  }

  static optimize = (program: Program): Program => program.map(instruction => {
    const newInstruction = { ...instruction }
    if (instruction.opcode === Opcode.GOTO) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        newInstruction.opcode = Opcode.JUMP
        newInstruction.operandOne = program.indexOf(targetInstruction)
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    } else if (instruction.opcode === Opcode.CALL) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        newInstruction.operandOne = program.indexOf(targetInstruction)
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    }
    return newInstruction
  })
}
