import { EveNull, EveInteger, VM, ixTable, Program, EveValue, InstructionArgument, Opcode, Instruction, VMResult, EveString } from "./types";

function isNumeric(n: any) : n is number {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

const eveNull = new EveNull();
const eveZero = new EveInteger(0);
const eveOne = new EveInteger(1);
const eveTwo = new EveInteger(2);

class EveVM implements VM {
  stack: EveValue[] = []

  noop = () => {
    process.stdout.write('[VM] no-op')
    return eveNull 
  }

  load_const_zero = () => this.push(eveZero);
  load_const_one = () => this.push(eveOne);
  load_const_two = () => this.push(eveTwo);

  create_integer = (arg?: string | number) => {
    if (isNumeric(arg)) {
      let newInt = new EveInteger(arg);
      this.push(newInt);
      return newInt;
    }
    throw new Error("Int create error -- invalid arg: " + arg)
  }

  add_integers = () => {
    // throw new Error('VM.int_add not impl')
    let [top, second] = this.stack;
    if (top instanceof EveInteger && second instanceof EveInteger) {
      let jsResult = top.js + second.js;
      let eveResult = new EveInteger(jsResult)
      this.push(eveResult);
      return eveResult;
    } else {
      throw new Error("Integer Addition Error -- one of top two values not eve int")
    }
  }

 
  create_string = (arg?: string | number) => {
    if (isString(arg)) {
      let newString = new EveString(arg);
      this.push(newString);
      return newString;
    }
    throw new Error("Str create error -- invalid arg: " + arg)
  }

  join_strings = () => {
    // throw new Error('VM.int_add not impl')
    let [top, second] = this.stack;
    if (top instanceof EveString && second instanceof EveString) {
      let jsResult = top.js + second.js;
      let eveResult = new EveString(jsResult)
      this.push(eveResult);
      return eveResult;
    } else {
      throw new Error("Integer Addition Error -- one of top two values not eve int")
    }
  }

  private push(value: EveValue) {
    this.stack.push(value);
    return value;
  }
}


// class Instruction { constructor(public opcode: Opcode) {} }
// class Program { constructor(public instructions: Instruction[]) {} }

// Executor: wrapper around raw vm
// 'performs' instructions, i.e.
// take instruction + decode bytecode + interact with vm
// (ideally in a traceable way...?)
class Executor {
  static perform(instruction: Instruction, _vm: EveVM): VMResult {
    // console.log("[Executor.perform]", { instruction, vm: _vm });
    let instructionName = ixTable[instruction.opcode];
    if (_vm[instructionName]) {
      let callee = _vm[instructionName].bind(_vm);
      // console.log("[Executor.perform]", { instruction, instructionName, callee });
      if (instruction.value) {
        return callee(instruction.value);
      } else {
        return callee();
      }
    } else {
      throw new Error("[Executor] Instruction table does not have entry " + instruction.opcode);
    }
  }
}


class Machine {
  vm = new EveVM()
  execute(program: Program): EveValue {
    // console.log("[Machine.execute]", { program })
    let retValue: VMResult = eveNull;
    program.forEach((instruction: Instruction) => {
      retValue = Executor.perform(instruction, this.vm)
    })
    return retValue;
  }
}

const instruction =
  (opcode: Opcode, value?: string | number): Instruction => {
    return { opcode, ...(value !== undefined && { value: value as InstructionArgument }) }
  }

export { instruction }
export default { Machine, EveInteger }
