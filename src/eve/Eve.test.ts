import { Eve } from "./Eve";
import { Instruction } from './types';
import { EveString } from "./EveString";
import { EveInteger } from "./EveInteger";
import { Opcode } from "./Opcode";
import { RegistryKey } from "./RegistryKey";

// build an instruction
const inst =
  (opcode: Opcode, operandOne?: number): Instruction => {
    return { opcode, operandOne }
  }

describe(Eve, () => {
  const driver = new Eve();

  it('noop', () => {
    let result = driver.execute([ inst(Opcode.NOOP) ])
    expect(result.js).toEqual(null)
  })

  it('computes the sum of one added to itself', () => {
    let result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ONE),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(2)
  });
  
  it('computes the sum of one and two', () => {
    let result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_TWO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(3)
  });

  it('computes the sum of zero and one', () => {
    let result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ZERO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(1)
  });
  
  it('computes the sum of larger numbers', () => {
    driver.vm.constantPool = [ new EveInteger(3), new EveInteger(4) ]
    let result = driver.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(7)
  });

  it('joins strings', () => {
    driver.vm.constantPool = [ new EveString('hello '), new EveString('world') ]
    let result = driver.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.STR_JOIN)
    ])
    expect(result.js).toEqual('hello world')
  });

  it('stores and loads values', () => {
    driver.vm.constantPool = [ new EveString('hello '), new EveString('there') ]
    let result = driver.execute([
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

  it('throws an error', () => {
    let executeThrow = () => driver.execute([ inst(Opcode.THROW) ])
    expect(executeThrow).toThrow( 'EveException: Threw at line 0 in _program')

    let executeThrowOnLineOne = () => driver.execute([ inst(Opcode.NOOP), inst(Opcode.THROW) ])
    expect(executeThrowOnLineOne).toThrow( 'EveException: Threw at line 1 in _program')
  })

  it('illegal op', () => {
    expect(() => driver.execute([ inst(-1) ])).toThrow()
  })

  test.todo('jumps to a specific program offset')
});