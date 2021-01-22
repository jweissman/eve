import { VM, ConstantPool, Stack, EveValue, Register, VMMethodArgs } from './types'
import { VMDriver } from './VMDriver'
import { EveString } from './EveString'
import { EveInteger } from './EveInteger'
import { EveNull } from './EveNull'
import { RegistryKey } from './RegistryKey'
import { EveVMDriver } from './EveVMDriver'

const eveNull = new EveNull()
const eveZero = new EveInteger(0)
const eveOne = new EveInteger(1)
const eveTwo = new EveInteger(2)

class EveVM implements VM {
  private constants: ConstantPool = []
  private isHalted = false

  driver: VMDriver = new EveVMDriver(this)
  stack: Stack = [];
  registry: Register = {
    [RegistryKey.A]: eveNull,
    [RegistryKey.B]: eveNull,
    [RegistryKey.C]: eveNull,
    [RegistryKey.D]: eveNull,
  }

  get halted(): boolean { return this.isHalted }

  set constantPool(theConstants: ConstantPool) { this.constants = theConstants }
  set ip(programOffset: number) { this.driver.instructionPointer = programOffset }

  noop = (): void => {
    // no operation
  }

  load_const_zero = (): void => this.push(eveZero);
  load_const_one  = (): void => this.push(eveOne);
  load_const_two  = (): void => this.push(eveTwo);

  load_const_by_index = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: idx } = instruction
    if (idx === undefined) {
      throw new Error('Load const by index failed, index undefined')
    } 

    if (this.constants[idx] === undefined) {
      throw new Error('Load const by index failed, target constant undefined')
    }
    const theConst = this.constants[idx]
    return this.push(theConst)
  }

  add_integers = (): void => {
    const { top, second } = this
    if (!(top instanceof EveInteger && second instanceof EveInteger)) {
      throw new Error('Integer Addition Error -- one of top two values not eve int')
    }
    const jsResult = top.js + second.js
    const eveResult = new EveInteger(jsResult)
    this.pop_two()
    this.push(eveResult)
  };

  join_strings = (): void => {
    const {top, second} = this
    if (!(top instanceof EveString && second instanceof EveString)) {
      throw new Error('Str join Error -- one of top two values not eve string')
    } 
    const jsResult = second.js + top.js
    const eveResult = new EveString(jsResult)
    this.pop_two()
    this.push(eveResult)
  };

  load_from_store = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: register } = instruction
    if (register === undefined) { throw new Error('Load from store failed, key undefined') }
    if (!(register in RegistryKey)) { throw new Error('Invalid register: ' + register) }
    const storedValue = this.registry[register]
    this.push(storedValue)
  }

  add_to_store = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: register } = instruction
    if (register === undefined) { throw new Error('Add to Store: key undefined') }
    if (!(register in RegistryKey)) { throw new Error('Invalid register: ' + register) }
    this.registry[register] = this.top
  }

  pop = (): void => { this.stack.pop() }
  pop_two = (): void => { this.pop(); this.pop() }

  jump = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: programOffset } = instruction
    if (programOffset === undefined) {
      throw new Error('jump: program offset undefined')
    }
    this.ip = programOffset
  }

  jump_if_zero = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: programOffset } = instruction
    // const { operandOne } = args;
    if (programOffset === undefined) {
      throw new Error('jump if zero: program offset undefined')
    }
    if (this.top.js === 0) {
      this.ip = programOffset
    }
  }

  throw = (): void => {
    const generalExceptionMessage = `Threw at line ${this.driver.instructionPointer} in ${this.driver.currentProgramName}`
    throw new Error(`EveException: ${generalExceptionMessage}`)
  }

  goto = (): void => { throw new Error('goto not actually valid (note: should get optimized into unconditional jumps)')}

  private push(value: EveValue) { this.stack.push(value) }
  private get top()  { return this.stack[this.stack.length-1] }
  private get second()  { return this.stack[this.stack.length-2] }
}

export { EveVM }