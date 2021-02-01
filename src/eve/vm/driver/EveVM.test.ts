import { EveString } from '../data-types/EveString'
import { EveVM } from './EveVM'
import { VM } from '../types'
import { Operation } from '../Operation'

const constantFor = (value: number) => {
  if (value === 0) { return 'load_const_zero' }
  else if (value === 1) { return 'load_const_one' }
  else if (value === 2) { return 'load_const_two' }
  else { throw new Error('no constant found for ' + value) }
}

let vm: VM
const verifyArithmetic = (method: Operation, left: number, right: number, result: number) => {
  vm[constantFor(left)]()
  vm[constantFor(right)]()
  vm[method]()
  expect(vm.top.js).toEqual(result)
}

describe(EveVM, () => {
  beforeEach(() => {
    vm = new EveVM()
  })

  it('noop', () => expect(() => vm.noop()).not.toThrow())

  describe('int math', () => {
    it('can add integers', () => {
      verifyArithmetic(Operation.IntegerAdd, 1, 1, 2)
      verifyArithmetic(Operation.IntegerAdd, 1, 2, 3)
      verifyArithmetic(Operation.IntegerAdd, 2, 2, 4)
      verifyArithmetic(Operation.IntegerAdd, 0, 1, 1)
      verifyArithmetic(Operation.IntegerAdd, 1, 0, 1)
      verifyArithmetic(Operation.IntegerAdd, 2, 0, 2)
      verifyArithmetic(Operation.IntegerAdd, 0, 2, 2)
    })

    it('can subtract integers', () => {
      verifyArithmetic(Operation.IntegerSubtract, 1, 1, 0)
      verifyArithmetic(Operation.IntegerSubtract, 1, 2, -1)
      verifyArithmetic(Operation.IntegerSubtract, 2, 2, 0)
      verifyArithmetic(Operation.IntegerSubtract, 0, 1, -1)
      verifyArithmetic(Operation.IntegerSubtract, 1, 0, 1)
      verifyArithmetic(Operation.IntegerSubtract, 2, 0, 2)
      verifyArithmetic(Operation.IntegerSubtract, 0, 2, -2)
    })

    it('can multiply integers', () => {
      verifyArithmetic(Operation.IntegerMultiply, 1, 1, 1)
      verifyArithmetic(Operation.IntegerMultiply, 1, 2, 2)
      verifyArithmetic(Operation.IntegerMultiply, 2, 2, 4)
      verifyArithmetic(Operation.IntegerMultiply, 0, 1, 0)
      verifyArithmetic(Operation.IntegerMultiply, 1, 0, 0)
      verifyArithmetic(Operation.IntegerMultiply, 2, 0, 0)
      verifyArithmetic(Operation.IntegerMultiply, 0, 2, 0)
    })

    it('can divide integers', () => {
      verifyArithmetic(Operation.IntegerDivide, 1, 1, 1)
      verifyArithmetic(Operation.IntegerDivide, 1, 2, 1/2)
      verifyArithmetic(Operation.IntegerDivide, 2, 2, 1)
      verifyArithmetic(Operation.IntegerDivide, 0, 1, 0)
      verifyArithmetic(Operation.IntegerDivide, 1, 0, Infinity)
      verifyArithmetic(Operation.IntegerDivide, 2, 0, Infinity)
      verifyArithmetic(Operation.IntegerDivide, 0, 2, 0)
    })

    it('can exponentiate integers', () => {
      verifyArithmetic(Operation.IntegerExponentiate, 1, 1, 1)
      verifyArithmetic(Operation.IntegerExponentiate, 1, 2, 1)
      verifyArithmetic(Operation.IntegerExponentiate, 2, 2, 4)
      verifyArithmetic(Operation.IntegerExponentiate, 0, 1, 0)
      verifyArithmetic(Operation.IntegerExponentiate, 1, 0, 1)
      verifyArithmetic(Operation.IntegerExponentiate, 2, 0, 1)
      verifyArithmetic(Operation.IntegerExponentiate, 0, 2, 0)
    })
  })

  it('can join strings', () => {
    vm.constantPool = [new EveString('hi'), new EveString(' '), new EveString('there')]
    vm.load_const_by_index({ operandOne: 0 })
    vm.load_const_by_index({ operandOne: 1 })
    vm.load_const_by_index({ operandOne: 2 })
    vm.join_strings()
    vm.join_strings()
    expect(vm.stack[vm.stack.length-1].js).toEqual('hi there')
  })

  it('loads constants by index', () => {
    vm.constantPool = [ new EveString('hello') ]
    vm.load_const_by_index({ operandOne: 0 })
    expect(vm.top.js).toEqual('hello')
  })

  it('stores/loads from registers', () => {
    vm.constantPool = [ new EveString('hi') ]
    vm.load_const_by_index({ operandOne: 0 })
    vm.add_to_store({ operandOne: 0 })
    vm.load_from_store({ operandOne: 0 })
    expect(vm.top.js).toEqual('hi')
  })

  // seems easier to do this at 'asm' layer??
  // it('call nullary function..', () => {
  //   vm.constantPool = [ new EveReference({
  //     comment: 'function foo()',
  //     programOffset: 10
  //   }) ]
  // })

  describe('error conditions', () => {
    it('throws on data type mismatch', () => {
      expect(() => vm.iadd()).toThrow()
      expect(() => vm.imul()).toThrow()
      expect(() => vm.isub()).toThrow()
      expect(() => vm.idiv()).toThrow()
      expect(() => vm.join_strings()).toThrow()
    })

    it('throws on missing operand', () => {
      expect(() => vm.load_from_store()).toThrow()
      expect(() => vm.add_to_store()).toThrow()
      expect(() => vm.load_const_by_index()).toThrow()
    })

    it('throws on missing/nonsense operand', () => {
      expect(() => vm.load_const_by_index({})).toThrow()
      expect(() => vm.load_const_by_index({ operandOne: -1 })).toThrow()
      expect(() => vm.add_to_store({})).toThrow()
      // expect(() => vm.add_to_store({ operandOne: -1 })).toThrow()
      expect(() => vm.load_from_store({})).toThrow()
      // expect(() => vm.load_from_store({ operandOne: -1 })).toThrow()
      expect(() => vm.jump()).toThrow()
      expect(() => vm.jump({})).toThrow()
      expect(() => vm.jump_if_zero()).toThrow()
      expect(() => vm.jump_if_zero({})).toThrow()
    })

    it('throws on goto', () => {
      expect(() => vm.goto()).toThrow('goto not actually valid')
    })
  })
})