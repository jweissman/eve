import { Stack, EveValue } from '../types'
import { EveInteger } from '../data-types/EveInteger'
import { eveNull, eveZero, eveOne, eveTwo } from '../Constants'

export abstract class ArithmeticLogicUnit {
  abstract get stack(): Stack;
  get top(): EveValue { return this.stack[this.stack.length - 1] || eveNull }
  get second(): EveValue { return this.stack[this.stack.length - 2] || eveNull }

  noop = (): void => {
    // no op
  }

  pop = (): void => { this.stack.pop() };
  pop_two = (): void => { this.pop(); this.pop() };

  load_const_zero = (): void => { this.stack.push(eveZero) };
  load_const_one = (): void => { this.stack.push(eveOne) };
  load_const_two = (): void => { this.stack.push(eveTwo) };

  iadd = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js + b.js));
  isub = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js - b.js));
  imul = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js * b.js));
  idiv = (): void => this.integerBinaryOp((a, b) => new EveInteger(a.js / b.js));
  ipow = (): void => this.integerBinaryOp((a, b) => new EveInteger(Math.pow(a.js, b.js)));
  imod = (): void => this.integerBinaryOp((a, b) => new EveInteger(((a.js % b.js) + b.js) % b.js));

  private integerBinaryOp = (operation: (top: EveInteger, second: EveInteger) => EveInteger): void => {
    const { top, second } = this
    if (!(top instanceof EveInteger && second instanceof EveInteger)) {
      throw new Error('Integer operation error -- one of top two values not eve int')
    }
    const result = operation(second, top)
    this.pop_two()
    this.stack.push(result)
  };
}
