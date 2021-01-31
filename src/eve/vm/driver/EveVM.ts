import { VM, ConstantPool, Stack, EveValue, Register, VMMethodArgs } from '../types'
import { Driver } from './Driver'
import { EveString } from '../data-types/EveString'
import { EveInteger } from '../data-types/EveInteger'
import { EveNull } from '../data-types/EveNull'
import { RegistryKey } from '../RegistryKey'
import { EveDriver } from './EveDriver'

export const eveNull = new EveNull()
const eveZero = new EveInteger(0)
const eveOne = new EveInteger(1)
const eveTwo = new EveInteger(2)

class EveVM implements VM {
  private constants: ConstantPool = []
  private isHalted = false
  driver: Driver = new EveDriver(this)

  get stack(): Stack { return this.driver.stack }
  registry: Register = {
    [RegistryKey.A]: eveNull,
    [RegistryKey.B]: eveNull,
    [RegistryKey.C]: eveNull,
    [RegistryKey.D]: eveNull,
    [RegistryKey.E]: eveNull,
    [RegistryKey.F]: eveNull,
    [RegistryKey.G]: eveNull,
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

  iadd = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js + b.js))

  isub = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js - b.js))
  imul = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js * b.js))
  idiv = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js / b.js))
  ipow = (): void => this.integerBinaryOp((a, b) => new EveInteger(Math.pow(a.js, b.js)))
  imod = (): void => this.integerBinaryOp((a, b) => new EveInteger(((a.js % b.js ) + b.js ) % b.js))

  private integerBinaryOp = (operation: (top: EveInteger, second: EveInteger) => EveInteger): void => {
    const { top, second } = this
    if (!(top instanceof EveInteger && second instanceof EveInteger)) {
      throw new Error('Integer operation error -- one of top two values not eve int')
    }
    const result = operation(second, top)
    // const eveResult = new EveInteger(jsResult)
    this.pop_two()
    this.push(result)
  }

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
    if (!(register in RegistryKey)) {
      console.warn('Unnamed register used ' + register)
    }
    const storedValue = this.registry[String(register)]
    // console.log('[VM] STORE = ' + util.inspect(this.registry))
    // console.log('[VM] READ FROM STORE: ' + register + ' => ' + storedValue.js)
    this.push(storedValue)
  }

  add_to_store = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: register } = instruction
    if (register === undefined) { throw new Error('Add to Store: key undefined') }
    if (!(register in RegistryKey)) {
      console.warn('Unnamed register used ' + register)
    }
    const value = this.top
    // console.log('[VM] ADD TO STORE: ' + register + ' <= ' + value.js)
    this.registry[String(register)] = value
    // console.log('[VM] STORE AFTER: ' + util.inspect(this.registry))
    this.pop()
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

  call = (instruction?: VMMethodArgs): void => {
    if (!instruction || instruction.operandOne === undefined || instruction.operandTwo === undefined) {
      throw new Error('call -- program offset or arity undefined')
    }
    // jump to prog offset
    // this.driver.instructionPointer = programOffset;
    // do that by pushing a frame onto a frame stack
    this.driver.pushStackFrame({
      programOffset: instruction.operandOne
    }, instruction.operandTwo)
  }

  ret = (): void => {
    // pop a frame stack, or just jump to ret address
    // throw new Error('ret not impl')
    this.driver.popStackFrame()
  }

  private push(value: EveValue) { this.stack.push(value) }
  get top(): EveValue  { return this.stack[this.stack.length-1] || eveNull }
  get second(): EveValue  { return this.stack[this.stack.length-2] || eveNull }
}

export { EveVM }