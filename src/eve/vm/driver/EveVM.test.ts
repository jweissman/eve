import { EveString } from '../data-types/EveString'
import { EveVM } from './EveVM'
import { VM } from '../types'

describe(EveVM, () => {
  let vm: VM
  beforeEach(() => {
    vm = new EveVM()
  })

  it('is okay to noop sometimes', () => expect(() => vm.noop()).not.toThrow())

  describe('int math', () => {
    it('can add integers', () => {
      vm.load_const_one()
      vm.load_const_one()
      vm.iadd()
      expect(vm.top.js).toEqual(2)

      vm.load_const_one()
      vm.load_const_two()
      vm.iadd()
      expect(vm.top.js).toEqual(3)

      vm.load_const_two()
      vm.load_const_two()
      vm.iadd()
      expect(vm.top.js).toEqual(4)

      vm.load_const_zero()
      vm.load_const_two()
      vm.iadd()
      expect(vm.top.js).toEqual(2)
    })

    it('can subtract integers', () => {
      vm.load_const_one()
      vm.load_const_one()
      vm.isub()
      expect(vm.top.js).toEqual(0)

      vm.load_const_two()
      vm.load_const_one()
      vm.isub()
      expect(vm.top.js).toEqual(1)

      vm.load_const_two()
      vm.load_const_two()
      vm.isub()
      expect(vm.top.js).toEqual(0)

      vm.load_const_zero()
      vm.load_const_two()
      vm.isub()
      expect(vm.top.js).toEqual(-2)
    })

    it('can multiply integers', () => {
      vm.load_const_one()
      vm.load_const_one()
      vm.imul()
      expect(vm.top.js).toEqual(1)

      vm.load_const_two()
      vm.load_const_one()
      vm.imul()
      expect(vm.top.js).toEqual(2)

      vm.load_const_two()
      vm.load_const_two()
      vm.imul()
      expect(vm.top.js).toEqual(4)

      vm.load_const_zero()
      vm.load_const_two()
      vm.imul()
      expect(vm.top.js).toEqual(0)
    })

    it('can divide integers', () => {
      vm.load_const_one()
      vm.load_const_one()
      vm.idiv()
      expect(vm.top.js).toEqual(1)

      vm.load_const_two()
      vm.load_const_one()
      vm.idiv()
      expect(vm.top.js).toEqual(2)

      vm.load_const_two()
      vm.load_const_two()
      vm.idiv()
      expect(vm.top.js).toEqual(1)

      vm.load_const_zero()
      vm.load_const_two()
      vm.idiv()
      expect(vm.top.js).toEqual(0)
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
    expect(vm.stack[vm.stack.length-1].js).toEqual('hello')
  })

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
      expect(() => vm.add_to_store({ operandOne: -1 })).toThrow()
      expect(() => vm.load_from_store({})).toThrow()
      expect(() => vm.load_from_store({ operandOne: -1 })).toThrow()
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