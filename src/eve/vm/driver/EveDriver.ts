import { VM, Program, Stack, EveValue, Instruction, Frame } from '../types'
import { Opcode } from '../Opcode'
import { Executor } from '../Executor'
import { Driver } from './Driver'
import { FlightRecording } from './FlightRecording'
import { Timer } from './Timer'
import { eveNull } from '../Constants'

export class EveDriver extends Driver {
  private programData: Instruction[] = []
  private frames: Frame[] = [{ instructionPointer: 0, stack: [] }]

  constructor(private vm: VM) { super() }

  get code(): Instruction[] { return this.programData }
  get topFrame(): Frame { return this.frames[this.frames.length - 1] }
  get instructionPointer(): number { return this.topFrame.instructionPointer }
  set instructionPointer(value: number) { this.topFrame.instructionPointer = value }
  get stack(): Stack { return this.topFrame.stack } 


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

  // okay, so the thought is to use load to get new code into the 'library' ...
  load(program: Program): void {
    // todo insert halt?
    const optimized: Program = EveDriver.optimize(program, this.programData.length)
    this.programData.push(...optimized)
    // this.programLibrary[name] = optimized
  }

  runUntilHalt(): FlightRecording {
    // const program = this.programLibrary[programName]
    // if (!program) { throw new Error('no such program ' + programName) }
    // this.currentProgramName = programName
    // this.instructionPointer = 0
    const flightPlan = () => this.followProgram()
    const [timeElapsed, instructionsPerformed] = Timer.measureMillis(flightPlan)
    // this.currentProgramName = ''
    const recording: FlightRecording = {
      instructionsPerformed,
      timeElapsed
    }
    return recording
  }

  private followProgram(): number {
    let nextInstruction = this.code[this.instructionPointer]
    let stepCount = 0
    while (!this.vm.halted && nextInstruction) {
      this.runOneInstruction(nextInstruction)
      stepCount++
      nextInstruction = this.code[this.instructionPointer]
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

  static optimize = (program: Program, offset: number): Program => program.map(instruction => {
    const newInstruction = { ...instruction }
    if (instruction.opcode === Opcode.GOTO) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        newInstruction.opcode = Opcode.JUMP
        newInstruction.operandOne = program.indexOf(targetInstruction) + offset
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    } else if (instruction.opcode === Opcode.CALL) {
      const targetInstruction = program.find((inst) => inst.label === instruction.targetLabel)
      if (targetInstruction) {
        newInstruction.operandOne = program.indexOf(targetInstruction) + offset
      } else {
        throw new Error('code optimize failed -- no such label ' + instruction.targetLabel)
      }
    }
    return newInstruction
  })
}
