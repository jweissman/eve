import { EveString } from '../data-types/EveString'
import { EveVM } from './EveVM'
import { VM } from '../types'

describe(EveVM, () => {
  let vm: VM = new EveVM()
  beforeEach(() => { vm = new EveVM() })

  it('noop', () => expect(() => vm.noop()).not.toThrow())

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
