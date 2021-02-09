import { Instruction, Program, Stack } from '../types'
import { FlightRecording } from './FlightRecording'
export abstract class Driver {
  abstract get code(): Instruction[];
  abstract get stack(): Stack;
  abstract get instructionPointer(): number;
  abstract set instructionPointer(programOffset: number);
  abstract load(program: Program): void;
  abstract runUntilHalt(): FlightRecording;
  abstract pushStackFrame(frame: { programOffset: number }, arity: number): void;
  abstract popStackFrame(): void;
}
