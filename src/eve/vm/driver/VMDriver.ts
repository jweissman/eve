import { Program } from '../types'
import { FlightRecording } from './FlightRecording'

export abstract class VMDriver {
  abstract get currentProgramName(): string;
  abstract get instructionPointer(): number;
  abstract set instructionPointer(programOffset: number);
  abstract load(program: Program): void;
  abstract runUntilHalt(): FlightRecording;
}
