import { VM, ConstantPool, Stack, VMDriver, EveValue, Register } from "./types";
import { EveString } from "./EveString";
import { EveInteger } from "./EveInteger";
import { EveNull } from "./EveNull";
import { RegistryKey } from "./RegistryKey";
import { EveVMDriver } from "./EveVMDriver";

const eveNull = new EveNull();
const eveZero = new EveInteger(0);
const eveOne = new EveInteger(1);
const eveTwo = new EveInteger(2);

class EveVM implements VM {
  private constants: ConstantPool = [];

  driver: VMDriver = new EveVMDriver(this)
  stack: Stack = [];
  registry: Register = {
    [RegistryKey.A]: eveNull,
    [RegistryKey.B]: eveNull,
    [RegistryKey.C]: eveNull,
    [RegistryKey.D]: eveNull,
  }

  set constantPool(theConstants: ConstantPool) {
    this.constants = theConstants
  }

  get constantPool() { return this.constants }

  noop = () => {}

  load_const_zero = () => this.push(eveZero);
  load_const_one  = () => this.push(eveOne);
  load_const_two  = () => this.push(eveTwo);

  load_const_by_index = (idx?: number) => {
    if (idx === undefined) {
      throw new Error("Load const by index failed, index undefined")
    } 

    if (this.constants[idx] === undefined) {
      throw new Error("Load const by index failed, target constant undefined")
    }
    let theConst = this.constants[idx];
    return this.push(theConst);
  }

  add_integers = () => {
    let { top, second } = this;
    if (!(top instanceof EveInteger && second instanceof EveInteger)) {
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
      throw new Error("Str join Error -- one of top two values not eve string");
    } 
    let jsResult = second.js + top.js;
    let eveResult = new EveString(jsResult);
    this.pop_two();
    this.push(eveResult);
  };

  load_from_store = (register?: number) => {
    if (register === undefined) { throw new Error("Load from store failed, key undefined") }
    if (!(register in RegistryKey)) { throw new Error('Invalid register: ' + register) }
    let storedValue = this.registry[register];
    this.push(storedValue)
  }

  add_to_store = (register?: number) => {
    if (register === undefined) { throw new Error("Add to Store: key undefined") }
    if (!(register in RegistryKey)) { throw new Error('Invalid register: ' + register) }
    this.registry[register] = this.top;
  }

  pop = () => this.stack.pop();
  pop_two = () => { this.pop(); this.pop() }

  jump_if_zero = () => { throw new Error('jumpz not impl') }
  throw = () => {
    let generalExceptionMessage = `Threw at line ${this.driver.instructionPointer} in ${this.driver.currentProgramName}`
    throw new Error(`EveException: ${generalExceptionMessage}`)
  }

  private push(value: EveValue) { this.stack.push(value); }
  private get top()  { return this.stack[this.stack.length-1] }
  private get second()  { return this.stack[this.stack.length-2] }
}

export { EveVM }