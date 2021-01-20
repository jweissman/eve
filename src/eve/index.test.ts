import Eve, { instruction as inst } from '.';
import { Opcode } from './types';

describe('eve machine', () => {
  it('computes the sum of one added to itself', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ONE),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(2)
  });
  it('computes the sum of one and two', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_TWO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(3)
  });
  it('computes the sum of zero and one', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ZERO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(1)
  }) 
  it('computes the sum of larger numbers', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      inst(Opcode.INT_CREATE, 3),
      inst(Opcode.INT_CREATE, 4),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(7)
  })

  it('joins strings', () => {
    let machine = new Eve.Machine()
    let result = machine.execute([
      inst(Opcode.STR_CREATE, 'hello '),
      inst(Opcode.STR_CREATE, 'world'),
      inst(Opcode.STR_JOIN)
    ])
    expect(result.js).toEqual('hello world')
  })
})