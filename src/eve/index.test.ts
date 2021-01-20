import Eve, { Opcode } from '.';

describe('eve machine', () => {
  it('computes the sum of one added to itself', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      Opcode.LCONST_ONE,
      Opcode.LCONST_ONE,
      Opcode.ADD
    ])
    expect(result.js).toEqual(2)
  });
  it('computes the sum of one and two', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      Opcode.LCONST_ONE,
      Opcode.LCONST_TWO,
      Opcode.ADD
    ])
    expect(result.js).toEqual(3)
  });
  it('computes the sum of zero and one', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      Opcode.LCONST_ONE,
      Opcode.LCONST_ZERO,
      Opcode.ADD
    ])
    expect(result.js).toEqual(1)
  })
})