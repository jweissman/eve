import { instructionTable } from "./InstructionTable";
import { Opcode } from "./Opcode";
import { Operation } from "./Operation";

describe('instructionTable', () => {
  it('has entries', () => {
    expect(instructionTable[Opcode.NOOP]).toEqual(Operation.NoOperation);
    expect(instructionTable[Opcode.POP]).toEqual(Operation.Pop);
    expect(instructionTable[Opcode.LCONST_ONE]).toEqual(Operation.LoadConstantOne);
    expect(instructionTable[Opcode.LCONST_TWO]).toEqual(Operation.LoadConstantTwo);
  })
})