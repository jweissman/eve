import { Eve } from './Eve'
import { EveString } from './vm/data-types/EveString'
import { EveInteger } from './vm/data-types/EveInteger'
import { Opcode } from './vm/Opcode'
import { RegistryKey } from './vm/RegistryKey'
import { inst, label, goto, call } from './vm/InstructionHelpers'
import { Instruction } from './vm/types'

const noop = inst(Opcode.NOOP)
const lconst_one = inst(Opcode.LCONST_ONE)
const lconst_two = inst(Opcode.LCONST_TWO)
const lconst_zero = inst(Opcode.LCONST_ZERO)
const lconst_idx = (index: number) => inst(Opcode.LCONST_IDX, index)
const iadd = inst(Opcode.INT_ADD)
const imul = inst(Opcode.INT_MUL)
const str_join = inst(Opcode.STR_JOIN)
const pop2 = inst(Opcode.POP2)
const ret = inst(Opcode.RET)

let eve: Eve
const expectEve = (...instructions: Instruction[]) => {
  const result = eve.execute(instructions)
  return expect(result.js)
}

describe(Eve, () => {
  beforeEach(() => { eve = new Eve() })

  it('noop', () => expectEve(noop).toEqual(null))
  it('sums', () => {
    expectEve(lconst_one, lconst_one, iadd).toEqual(2)
    expectEve(lconst_one, lconst_two, iadd).toEqual(3)
    expectEve(lconst_two, lconst_two, iadd).toEqual(4)
    expectEve(lconst_one, lconst_zero, iadd).toEqual(1)
    expectEve(lconst_zero, lconst_zero, iadd).toEqual(0)
  })
  it('products', () => {
    expectEve(lconst_one, lconst_one,  imul).toEqual(1)
    expectEve(lconst_one, lconst_two,  imul).toEqual(2)
    expectEve(lconst_two, lconst_two,  imul).toEqual(4)
    expectEve(lconst_one, lconst_zero, imul).toEqual(0)
    expectEve(lconst_zero, lconst_zero, imul).toEqual(0)
  })
  
  it('math on constants from pool', () => {
    eve.vm.constantPool = [ new EveInteger(3), new EveInteger(4) ]
    expectEve(lconst_idx(0), lconst_idx(1), iadd).toEqual(7)
    eve.vm.constantPool = [ new EveInteger(10), new EveInteger(20) ]
    expectEve(lconst_idx(0), lconst_idx(1), imul).toEqual(200)
  })

  it('joins strings', () => {
    eve.vm.constantPool = [ new EveString('hello '), new EveString('world') ]
    expectEve(lconst_idx(0), lconst_idx(1), str_join).toEqual('hello world')
  })

  it('stores and loads values', () => {
    eve.vm.constantPool = [ new EveString('hello '), new EveString('there') ]
    expectEve(
      lconst_idx(0),
      inst(Opcode.ASTORE, RegistryKey.A),
      lconst_idx(1),
      inst(Opcode.ASTORE, RegistryKey.B),
      pop2,
      inst(Opcode.LSTORE, RegistryKey.A),
      inst(Opcode.LSTORE, RegistryKey.B),
      str_join,
    ).toEqual('hello there')
  })

  describe('throw', () => {
    it('throws an exception', () => {
      const executeThrow = () => eve.execute([inst(Opcode.THROW)])
      expect(executeThrow).toThrow('EveException: Threw at program offset 0')
    })

    it('reflects program counter', () => {
      const throwAtSecondInstruction = () => eve.execute([inst(Opcode.NOOP), inst(Opcode.THROW)])
      expect(throwAtSecondInstruction).toThrow('EveException: Threw at program offset 1')
    })
  })

  it('illegal op', () => {
    expect(() => eve.execute([ inst(-1) ])).toThrow()
  })

  it('jumps to a specific program offset', () => {
    // const result = eve.execute([
    expectEve(
      lconst_one,
      inst(Opcode.JUMP_Z, 4),   // 1
      lconst_zero,
      inst(Opcode.JUMP_Z, 5),   // 3
      inst(Opcode.THROW),       // 4
      lconst_two,
    ).toEqual(2)
  })

  it('goto label', () => {
    eve.vm.constantPool = [
      new EveInteger(-1),
      new EveInteger(10)
    ]
    const result = eve.execute([
      lconst_idx(1),
      inst(Opcode.ASTORE, RegistryKey.A),
      label('start'),
      inst(Opcode.LSTORE, RegistryKey.A),
      inst(Opcode.JUMP_Z, 6),
      goto('sub'),
      goto('done'),
      label('sub'),
      inst(Opcode.LSTORE, RegistryKey.A),
      lconst_idx(0),
      iadd,
      inst(Opcode.ASTORE, RegistryKey.A),
      goto('start'),
      label('done'),
      inst(Opcode.LSTORE, RegistryKey.A),
    ])
    expect(result.js).toEqual(0)
  })

  it('call/goto with missing label', () => {
    expect(() => eve.execute([ goto('nowhere') ]))
      .toThrow('code optimize failed -- no such label nowhere')
    expect(() => eve.execute([ call('nothing') ]))
      .toThrow('code optimize failed -- no such label nothing')
  })

  it('invokes a nullary subroutine and returns', () => {
    eve.vm.constantPool = [ new EveInteger(-1) ]
    const result = eve.execute([
      label('main'),
      call('sub'), // <--- is where the bottom stack frame is pointing
      goto('done'),
      inst(Opcode.THROW),
      label('sub'),
      lconst_idx(0),
      inst(Opcode.RET),
      inst(Opcode.THROW), // execution should not get here :)
      label('done'),
    ])
    expect(result.js).toEqual(-1)
  })

  it('invokes a unary subroutine and returns', () => {
    eve.vm.constantPool = [ new EveInteger(2), new EveInteger(4) ]
    expectEve(
      label('main'),
      lconst_idx(1),
      call('double', 1),
      call('double', 1),
      goto('done'),
      inst(Opcode.THROW),
      label('double'),
      lconst_idx(0),
      imul,
      ret,
      inst(Opcode.THROW),
      label('done')
    ).toEqual(16)
  })

  // call a method by reference...
  xit('jumps to a method based on a reference', () => {
    // eve.vm.constantPool = [ new EveFunctionReference('method', 0), new EveInteger(42) ]
    // const result = eve.execute([
    //   label('method'),
    //   // inst(Opcode.PRT, { }),
    //   inst(Opcode.LCONST_IDX, 1),
    //   inst(Opcode.RET),
    //   label('main'),
    //   inst(Opcode.LCONST_IDX, 0),
    //   inst(Opcode.CALL),
    // ])
  })
})
