import { inst } from './InstructionHelpers'
import { Opcode } from './Opcode'
import { prettyInstruction } from './prettyInstruction'

describe(prettyInstruction, () => {
  it('reports the operation name', () => {
    expect(prettyInstruction(inst(Opcode.NOOP))).toMatch('noop')
  })

  it('reports the operand', () => {
    expect(prettyInstruction(inst(Opcode.LCONST_IDX, 1))).toMatch('load_const_by_index')
    expect(prettyInstruction(inst(Opcode.LCONST_IDX, 1))).toMatch('1')
  })
})