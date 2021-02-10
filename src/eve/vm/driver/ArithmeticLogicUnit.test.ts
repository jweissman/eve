import { Operation } from '../Operation'
import { VM } from '../types'
import { ArithmeticLogicUnit } from './ArithmeticLogicUnit'
import { EveVM } from './EveVM'
import { verifyArithmetic } from './spec/helpers'

describe(ArithmeticLogicUnit, () => {
  let vm: VM = new EveVM()
  beforeEach(() => { vm = new EveVM() })
  const verify = (operation: Operation, lhs: number, rhs: number, expected: number) => 
    it(`${lhs} ${operation} ${rhs} = ${expected}`, () => verifyArithmetic(vm, operation, lhs, rhs, expected))

  describe('can add consts', () => {
    verify(Operation.IntegerAdd, 1, 1, 2)
    verify(Operation.IntegerAdd, 1, 2, 3)
    verify(Operation.IntegerAdd, 2, 2, 4)
    verify(Operation.IntegerAdd, 0, 1, 1)
    verify(Operation.IntegerAdd, 1, 0, 1)
    verify(Operation.IntegerAdd, 2, 0, 2)
    verify(Operation.IntegerAdd, 0, 2, 2)
  })

  describe('can add ints', () => {
    verify(Operation.IntegerAdd, 2, 3, 5)
    verify(Operation.IntegerAdd, 12, 12, 24)
    verify(Operation.IntegerAdd, 10, 200, 210)
    verify(Operation.IntegerAdd, 50, 5, 55)
  })

  describe('can subtract consts', () => {
    verify(Operation.IntegerSubtract, 1, 1, 0)
    verify(Operation.IntegerSubtract, 1, 2, -1)
    verify(Operation.IntegerSubtract, 2, 2, 0)
    verify(Operation.IntegerSubtract, 0, 1, -1)
    verify(Operation.IntegerSubtract, 1, 0, 1)
    verify(Operation.IntegerSubtract, 2, 0, 2)
    verify(Operation.IntegerSubtract, 0, 2, -2)
  })

  describe('can subtract ints', () => {
    verify(Operation.IntegerSubtract, 2, 3, -1)
    verify(Operation.IntegerSubtract, 12, 12, 0)
    verify(Operation.IntegerSubtract, 10, 200, -190)
    verify(Operation.IntegerSubtract, 50, 5, 45)
  })

  describe('can multiply consts', () => {
    verify(Operation.IntegerMultiply, 1, 1, 1)
    verify(Operation.IntegerMultiply, 1, 2, 2)
    verify(Operation.IntegerMultiply, 2, 2, 4)
    verify(Operation.IntegerMultiply, 0, 1, 0)
    verify(Operation.IntegerMultiply, 1, 0, 0)
    verify(Operation.IntegerMultiply, 2, 0, 0)
    verify(Operation.IntegerMultiply, 0, 2, 0)
  })

  describe('can multiply ints', () => {
    verify(Operation.IntegerMultiply, 2, 3, 6)
    verify(Operation.IntegerMultiply, 12, 12, 144)
    verify(Operation.IntegerMultiply, 10, 200, 2000)
    verify(Operation.IntegerMultiply, 50, 5, 250)
  })

  describe('can divide consts', () => {
    verify(Operation.IntegerDivide, 1, 1, 1)
    verify(Operation.IntegerDivide, 1, 2, 1 / 2)
    verify(Operation.IntegerDivide, 2, 2, 1)
    verify(Operation.IntegerDivide, 0, 1, 0)
    verify(Operation.IntegerDivide, 1, 0, Infinity)
    verify(Operation.IntegerDivide, 2, 0, Infinity)
    verify(Operation.IntegerDivide, 0, 2, 0)
  })

  describe('can exponentiate consts', () => {
    verify(Operation.IntegerExponentiate, 1, 1, 1)
    verify(Operation.IntegerExponentiate, 1, 2, 1)
    verify(Operation.IntegerExponentiate, 2, 2, 4)
    verify(Operation.IntegerExponentiate, 0, 1, 0)
    verify(Operation.IntegerExponentiate, 1, 0, 1)
    verify(Operation.IntegerExponentiate, 2, 0, 1)
    verify(Operation.IntegerExponentiate, 0, 2, 0)
  })

})
