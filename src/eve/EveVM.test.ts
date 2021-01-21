import { EveString } from "./EveString";
import { EveVM } from "./EveVM";

describe(EveVM, () => {
  let vm: EveVM = new EveVM();
  it('can add integers', () => {
    vm.load_const_one();
    vm.load_const_one();
    vm.add_integers();
    expect(vm.stack[vm.stack.length-1].js).toEqual(2)
  })

  it('can join strings', () => {
    vm.constantPool = [ new EveString('hi'), new EveString(' '), new EveString('there')]
    vm.load_const_by_index(0);
    vm.load_const_by_index(1);
    vm.load_const_by_index(2);
    vm.join_strings()
    vm.join_strings()
    expect(vm.stack[vm.stack.length-1].js).toEqual('hi there')
  })

  it('loads constants by index', () => {
    vm.constantPool = [ new EveString('hello') ]
  })

  it('throws on data type mismatch', () => {
    expect(() => vm.add_integers()).toThrow()
    expect(() => vm.join_strings()).toThrow()
  })
  it('throws on missing operand',() => {
    expect(() => vm.load_from_store()).toThrow()
    expect(() => vm.add_to_store()).toThrow()
    expect(() => vm.load_const_by_index()).toThrow()
  })
  it('throws on nonsense operand', () => {
    expect(() => vm.load_const_by_index(-1)).toThrow()
    expect(() => vm.add_to_store(-1)).toThrow()
    expect(() => vm.load_from_store(-1)).toThrow()
  })
})