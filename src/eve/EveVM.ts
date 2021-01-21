import { VM, EveValue,EveInteger, EveString, EveNull } from "./types";

export const eveNull = new EveNull();
export const eveZero = new EveInteger(0);
export const eveOne = new EveInteger(1);
export const eveTwo = new EveInteger(2);

type Stack = EveValue[]
type Register = { a: EveValue, b: EveValue, c: EveValue, d: EveValue } 

export enum RegistryKey {
  A = 0x00,
  B = 0x01,
  C = 0x02,
  D = 0x03
}

const keyForRegister = (value: RegistryKey): string => {
  switch(value) {
    case RegistryKey.A: return 'a';
    case RegistryKey.B: return 'b';
    case RegistryKey.C: return 'c';
    case RegistryKey.D: return 'd';
  }
}

export class EveVM implements VM {
  stack: Stack = [];
  registry: Register = {
    a: eveNull,
    b: eveNull,
    c: eveNull,
    d: eveNull,
  }

  public constants: EveValue[] = [];

  noop = () => process.stdout.write('[EveVM.noop] ...');

  load_const_zero = () => this.push(eveZero);
  load_const_one = () => this.push(eveOne);
  load_const_two = () => this.push(eveTwo);

  load_const_by_index = (idx?: number) => {
    if (idx === undefined) {
      console.warn("[EveVM.load_const_by_index] index was undefined?", { idx });
      throw new Error("Load const by index failed, index undefined")
    } 

    if (this.constants[idx] === undefined) {
      console.warn("[EveVM.load_const_by_index] const pool value at index was undefined?", { idx });
      throw new Error("Load const by index failed, target constant undefined")
    }
    let theConst = this.constants[idx];
    return this.push(theConst);
  }

  add_integers = () => {
    let { top, second } = this;
    if (!(top instanceof EveInteger && second instanceof EveInteger)) {
      console.warn("[EveVM.add_integers] Error, values not int?", { top, second })
      throw new Error("Integer Addition Error -- one of top two values not eve int");
    }
    let jsResult = top.js + second.js;
    let eveResult = new EveInteger(jsResult);
    this.pop_two();
    this.push(eveResult);
  };

  join_strings = () => {
    let {top, second} = this;
    if (!(top instanceof EveString && second instanceof EveString)) {
      console.warn("[EveVM.join_strings] Error, values not str?", { top, second })
      throw new Error("Str join Error -- one of top two values not eve string");
    } 
    let jsResult = second.js + top.js;
    let eveResult = new EveString(jsResult);
    this.pop_two();
    this.push(eveResult);
  };

  load_from_store = (register?: number) => {
    if (register === undefined) {
      console.warn("[EveVM.load_from_store] registry key was undefined?", { key: register });
      throw new Error("Load from store failed, key undefined")
    }
    let key = keyForRegister(register);
    let storedValue = this.registry[key];
    this.push(storedValue)
  }

  add_to_store = (register?: number) => {
    if (register === undefined) {
      console.warn("[EveVM.add_to_store] registry key was undefined?", { key: register });
      throw new Error("Add to Store: key undefined")
    }
    let key = keyForRegister(register);
    this.registry[key] = this.top;
  }

  pop = () => this.stack.pop();
  pop_two = () => { this.pop(); this.pop() }

  private push(value: EveValue) { this.stack.push(value); }
  private get top()  { return this.stack[this.stack.length-1] }
  private get second()  { return this.stack[this.stack.length-2] }

}
