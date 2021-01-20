enum Operation {
  NoOperation = 'noop',
  LoadConstantZero = 'lconst_zero',
  LoadConstantOne = 'lconst_one',
  LoadConstantTwo = 'lconst_two',
  IntegerAdd = 'int_add',
};

export enum Opcode {
  NOOP = 0xfe,
  LCONST_ZERO = 0x00,
  LCONST_ONE = 0x01,
  LCONST_TWO = 0x02,
  ADD = 0xa0,
};

type Instruction = Opcode;
type Program = Instruction[];

type InstructionTable = { [key in Opcode]: Operation } 
const ixTable: InstructionTable = {
  [Opcode.NOOP]: Operation.NoOperation,
  [Opcode.LCONST_ZERO]: Operation.LoadConstantZero,
  [Opcode.LCONST_ONE]: Operation.LoadConstantOne,
  [Opcode.LCONST_TWO]: Operation.LoadConstantTwo,
  [Opcode.ADD]: Operation.IntegerAdd,
};

type JSValue = number | null

class EveNull { get js(): JSValue { return null }}
const eveNull = new EveNull();

class EveInteger {
  constructor(private internalValue: number) {}
  get js(): JSValue { return this.internalValue }
}

const eveZero = new EveInteger(0);
const eveOne = new EveInteger(1);
const eveTwo = new EveInteger(2);

type EveValue = EveNull | EveInteger

type VMResult = EveValue

type VMMethod = () => VMResult
type VM = { [key in Operation]: VMMethod }

class EveVM implements VM {
  stack: EveValue[] = []

  noop = (): VMResult => {
    process.stdout.write('[VM] no-op')
    return eveNull 
  }

  lconst_zero = (): VMResult => this.push(eveZero);
  lconst_one = (): VMResult => this.push(eveOne);
  lconst_two = (): VMResult => this.push(eveTwo);

  int_add = (): VMResult => {
    // throw new Error('VM.int_add not impl')
    let [top, second] = this.stack;
    if (top.js !== null && second.js !== null) {
      let jsResult = top.js + second.js;
      let eveResult = new EveInteger(jsResult)
      this.push(eveResult);
      return eveResult;
    } else {
      throw new Error("Integer Addition Error -- one of top two values null")
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
    console.log("[Executor.perform]", { instruction, vm: _vm });
    let instructionName = ixTable[instruction];
    let callee = _vm[instructionName]
    console.log("[Executor.perform]", { instruction, instructionName, callee });
    return callee.call(_vm);
  }
}


class Machine {
  vm = new EveVM()
  execute(program: Program): EveValue {
    console.log("[Machine.execute]", { program })
    let retValue = eveNull;
    program.forEach((instruction: Instruction) => {
      retValue = Executor.perform(instruction, this.vm)
    })
    return retValue;
  }
}

export default { Machine, EveInteger }