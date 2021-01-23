import { Eve } from './Eve'
import { Instruction } from './vm/types'
import { EveString } from './vm/data-types/EveString'
import { EveInteger } from './vm/data-types/EveInteger'
import { Opcode } from './vm/Opcode'
import { RegistryKey } from './vm/RegistryKey'

// build an instruction
const inst =
  (opcode: Opcode, operandOne?: number): Instruction => {
    return { opcode, operandOne }
  }

const label = (labelName: string): Instruction => {
  return { opcode: Opcode.NOOP, label: labelName }
}

const goto = (labelName: string): Instruction => {
  return { opcode: Opcode.GOTO, targetLabel: labelName }
}

describe(Eve, () => {
  const driver = new Eve()

  it('noop', () => {
    const result = driver.execute([ inst(Opcode.NOOP) ])
    expect(result.js).toEqual(null)
  })

  it('computes the sum of one added to itself', () => {
    const result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ONE),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(2)
  })
  
  it('computes the sum of one and two', () => {
    const result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_TWO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(3)
  })

  it('computes the sum of zero and one', () => {
    const result = driver.execute([
      inst(Opcode.LCONST_ONE),
      inst(Opcode.LCONST_ZERO),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(1)
  })
  
  it('computes the sum of larger numbers', () => {
    driver.vm.constantPool = [ new EveInteger(3), new EveInteger(4) ]
    const result = driver.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.INT_ADD)
    ])
    expect(result.js).toEqual(7)
  })

  it('joins strings', () => {
    driver.vm.constantPool = [ new EveString('hello '), new EveString('world') ]
    const result = driver.execute([
      inst(Opcode.LCONST_IDX, 0),
      inst(Opcode.LCONST_IDX, 1),
      inst(Opcode.STR_JOIN)
    ])
    expect(result.js).toEqual('hello world')
  })

  it('stores and loads values', () => {
    driver.vm.constantPool = [ new EveString('hello '), new EveString('there') ]
    const result = driver.execute([
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
    const executeThrow = () => driver.execute([ inst(Opcode.THROW) ])
    expect(executeThrow).toThrow( 'EveException: Threw at line 0 in _program')

    const executeThrowOnLineOne = () => driver.execute([ inst(Opcode.NOOP), inst(Opcode.THROW) ])
    expect(executeThrowOnLineOne).toThrow( 'EveException: Threw at line 1 in _program')
  })

  it('illegal op', () => {
    expect(() => driver.execute([ inst(-1) ])).toThrow()
  })

  it('jumps to a specific program offset', () => {
    const result = driver.execute([
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
    driver.vm.constantPool = [
      new EveInteger(-1),
      new EveInteger(100000)
    ]
    const result = driver.execute([
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
    expect(() => driver.execute([ goto('nowhere') ]))
      .toThrow('code optimize failed -- no such label nowhere')
  })
  test.todo('invokes a subroutine and returns')
})