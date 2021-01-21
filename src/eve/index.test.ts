import Eve, { instruction as inst } from '.';
import { EveInteger, EveString } from './types';
import { Opcode } from "./Opcode";
import { RegistryKey } from './EveVM';

describe(Eve.Runner, () => {
  it('noop', () => {
    let machine = new Eve.Runner()
    let result = machine.execute([
      inst(Opcode.NOOP),
    ])
    expect(result.js).toEqual(null)
  })

  it('computes the sum of one added to itself', () => {
    let machine = new Eve.Runner()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ONE),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(2)
  });
  
  it('computes the sum of one and two', () => {
    let machine = new Eve.Runner()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_TWO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(3)
  });

  it('computes the sum of zero and one', () => {
    let machine = new Eve.Runner()
    let result = machine.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ZERO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(1)
  });
  
  it('computes the sum of larger numbers', () => {
    let machine = new Eve.Runner()
    machine.vm.constants = [ new EveInteger(3), new EveInteger(4) ]
    let result = machine.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(7)
  });

  it('joins strings', () => {
    let machine = new Eve.Runner()
    machine.vm.constants = [ new EveString('hello '), new EveString('world') ]
    let result = machine.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.STR_JOIN)
    ])
    expect(result.js).toEqual('hello world')
  });

  it('stores and loads values', () => {
    let machine = new Eve.Runner();
    machine.vm.constants = [ new EveString('hello '), new EveString('there') ]
    let result = machine.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.ASTORE, RegistryKey.A),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.ASTORE, RegistryKey.B),
      inst(Opcode.POP2),
      inst(Opcode.LSTORE, RegistryKey.A),
      inst(Opcode.LSTORE, RegistryKey.B),
      inst(Opcode.STR_JOIN),
    ])
    expect(result.js).toEqual('hello there')
  })
});