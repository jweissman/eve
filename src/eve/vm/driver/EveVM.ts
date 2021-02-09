import { VM, ConstantPool, Stack, Register, VMMethodArgs } from '../types'
import { Driver } from './Driver'
import { EveString } from '../data-types/EveString'
import { EveDriver } from './EveDriver'
// import { eveNull } from '../Constants'
import { ArithmeticLogicUnit } from './ArithmeticLogicUnit'

class EveVM extends ArithmeticLogicUnit implements VM {
  driver: Driver = new EveDriver(this)
  registry: Register = {}
  private constants: ConstantPool = []
  private isHalted = false
  get stack(): Stack { return this.driver.stack }
  get halted(): boolean { return this.isHalted }
  set constantPool(theConstants: ConstantPool) { this.constants = theConstants }
  set ip(programOffset: number) { this.driver.instructionPointer = programOffset }

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
    this.stack.push(theConst)
  }

  join_strings = (): void => {
    const {top, second} = this
    if (!(top instanceof EveString && second instanceof EveString)) {
      throw new Error('Str join Error -- one of top two values not eve string')
    } 
    const jsResult = second.js + top.js
    const eveResult = new EveString(jsResult)
    this.pop_two()
    this.stack.push(eveResult)
  };

  load_from_store = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: register } = instruction
    if (register === undefined) { throw new Error('Load from store failed, key undefined') }
    // if (!Object.keys(this.registry).includes(String(register))) {
    // }
    const storedValue = this.registry[String(register)]
    if (storedValue === undefined) {
      throw new Error('Load from store failed: no value at register ' + register)
    }
    this.stack.push(storedValue)
  }

  add_to_store = (instruction?: VMMethodArgs): void => {
    if (!instruction) { throw new Error('no instruction')}
    const { operandOne: register } = instruction
    if (register === undefined) { throw new Error('Add to Store: key undefined') }
    const value = this.top
    this.registry[String(register)] = value
    this.pop()
  }

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
    const generalExceptionMessage = `Threw at program offset ${this.driver.instructionPointer}`
    console.log('At throw, driver code is: ' + JSON.stringify(this.driver.code))
    throw new Error(`EveException: ${generalExceptionMessage}`)
  }

  goto = (): void => { throw new Error('goto not actually valid (note: should get optimized into unconditional jumps)')}

  call = (instruction?: VMMethodArgs): void => {
    if (!instruction || instruction.operandOne === undefined || instruction.operandTwo === undefined) {
      throw new Error('call -- program offset or arity undefined')
    }
    this.driver.pushStackFrame({
      programOffset: instruction.operandOne
    }, instruction.operandTwo)
  }

  ret = (): void => this.driver.popStackFrame()
}

export { EveVM }
