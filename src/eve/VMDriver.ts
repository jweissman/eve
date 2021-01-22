import { Program } from "./types";


export abstract class VMDriver {
  abstract get currentProgramName(): string;
  abstract get instructionPointer(): number;
  abstract set instructionPointer(programOffset: number);
  abstract getProgramOffsetForLabel(label: string): number; 
  abstract load(program: Program): void;
  abstract runUntilHalt(): void;
}
