import { Eve } from './Eve'
import { EveString } from './vm/data-types/EveString'
import { EveInteger } from './vm/data-types/EveInteger'
import { Opcode } from './vm/Opcode'
import { RegistryKey } from './vm/RegistryKey'
import { inst, label, goto, call } from './vm/InstructionHelpers'

describe(Eve, () => {
  let eve: Eve
  beforeEach(() => { eve = new Eve() })

  it('noop', () => {
    const result = eve.execute([ inst(Opcode.NOOP) ])
    expect(result.js).toEqual(null)
  })

  it('computes the sum of one added to itself', () => {
    const result = eve.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ONE),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(2)
  })
  
  it('computes the sum of one and two', () => {
    const result = eve.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_TWO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(3)
  })

  it('computes the sum of zero and one', () => {
    const result = eve.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ZERO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(1)
  })
  
  it('computes the sum of larger numbers', () => {
    eve.vm.constantPool = [ new EveInteger(3), new EveInteger(4) ]
    const result = eve.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(7)
  })

  it('joins strings', () => {
    eve.vm.constantPool = [ new EveString('hello '), new EveString('world') ]
    const result = eve.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.STR_JOIN)
    ])
    expect(result.js).toEqual('hello world')
  })

  it('stores and loads values', () => {
    eve.vm.constantPool = [ new EveString('hello '), new EveString('there') ]
    const result = eve.execute([
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
    const executeThrow = () => eve.execute([ inst(Opcode.THROW) ])
    expect(executeThrow).toThrow( 'EveException: Threw at line 0 in _program')

    const executeThrowOnLineOne = () => eve.execute([ inst(Opcode.NOOP), inst(Opcode.THROW) ])
    expect(executeThrowOnLineOne).toThrow( 'EveException: Threw at line 1 in _program')
  })

  it('illegal op', () => {
    expect(() => eve.execute([ inst(-1) ])).toThrow()
  })

  it('jumps to a specific program offset', () => {
    const result = eve.execute([
      inst(Opcode.LCONST_ONE),  // 0
      inst(Opcode.JUMP_Z, 4),   // 1
      inst(Opcode.LCONST_ZERO), // 2
      inst(Opcode.JUMP_Z, 5),   // 3
      inst(Opcode.THROW),       // 4
      inst(Opcode.LCONST_TWO),  // 5
    ])
    expect(result.js).toEqual(2)
  })

  it('goto label', () => {
    eve.vm.constantPool = [
      new EveInteger(-1),
      new EveInteger(10)
    ]
    const result = eve.execute([
      inst(Opcode.LCONST_IDX, 1), 
      inst(Opcode.ASTORE, RegistryKey.A),
      label('start'),
      inst(Opcode.LSTORE, RegistryKey.A),
      inst(Opcode.JUMP_Z, 6),
      goto('sub'),
      goto('done'),
      label('sub'),
      inst(Opcode.LSTORE, RegistryKey.A),
      inst(Opcode.LCONST_IDX, 0), 
      inst(Opcode.INT_ADD),
      inst(Opcode.ASTORE, RegistryKey.A),
      goto('start'),
      label('done'),
      inst(Opcode.LSTORE, RegistryKey.A),
    ])
    expect(result.js).toEqual(0)
  })

  it('goto with missing label', () => {
    expect(() => eve.execute([ goto('nowhere') ]))
      .toThrow('code optimize failed -- no such label nowhere')
  })

  it('invokes a nullary subroutine and returns', () => {
    eve.vm.constantPool = [ new EveInteger(-1) ]
    const result = eve.execute([
      label('main'),
      call('sub'), // <--- is where the bottom stack frame is pointing
      goto('done'),
      inst(Opcode.THROW),
      label('sub'),
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.RET),
      inst(Opcode.THROW), // execution should not get here :)
      label('done'),
    ])
    expect(result.js).toEqual(-1)
  })

  it('invokes a unary subroutine and returns', () => {
    eve.vm.constantPool = [ new EveInteger(2), new EveInteger(4) ]
    const result = eve.execute([
      label('main'),
      inst(Opcode.LCONST_IDX, 1),
      call('double', 1),
      call('double', 1),
      goto('done'),
      inst(Opcode.THROW),
      label('double'),
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.INT_MUL),
      inst(Opcode.RET),
      inst(Opcode.THROW),
      label('done')
    ])
    expect(result.js).toEqual(16)
  })
})