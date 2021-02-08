import { EdenInterpreter } from './EdenInterpreter'

let interpreter: EdenInterpreter
const interpret = (input: string) => interpreter.evaluate(input).js
const expectInterpretation = (input: string, expected: unknown) =>
  expect(interpret(input)).toEqual(expected)
const expectInterpretations = (interpretations: {[key: string]: unknown}) => {
  Object.entries(interpretations).forEach(([input,expectedInterpretation])=> {
    expectInterpretation(input, expectedInterpretation)
  })
}

describe('eden interpreter', () => {
  beforeEach(() => {
    interpreter = new EdenInterpreter()
    // const debug = false
    // interpreter.config = { debug }
  })

  describe('basics', () => {
    xit('empty program', () => {
      expect(interpret('')).toEqual(null)
    })
    it('multiple lines', () => {
      expect(interpret('a=2;b=3;a+b')).toEqual(5)
    })
  })

  describe('interprets basic eden code', () => {
    describe('integer math operations', () => {
      it('add', () => {
        expectInterpretations({ '2+2': 4, '2+3': 5, '2+5': 7, '15+85': 100 })
      })
      it('subtract', () => {
        expectInterpretations({ '2-3': -1, '3-1': 2, '8-5': 3, '128-64': 64 })
      })
      it('multiply', () => {
        expectInterpretations({ '2*2': 4, '2*3': 6, '3*8': 24, '4*4': 16, '12*12': 144 })
      })
      it('divide', () => {
        expectInterpretations({ '2/2': 1, '2/3': 2/3, '3/8': 3/8, '4/4': 1, '12/24': 1/2 })
      })
      it('exponent', () => {
        expectInterpretations({ '2**2': 4, '2**3': 8, '3**4': 81, '2**5': 32 })
      })
      it('modulus', () => {
        expectInterpretations({ '2%2': 0, '10%3': 1, '10%4': 2, '10%5': 0 })
      })
      it('precedence/parens', () => {
        expect(interpret('1+2/3')).toEqual(1 + 2 / 3)
        expect(interpret('(1+2)/3')).toEqual(1)
      })
    })

    it('handles spaces', () => {
      expect(interpret('4 + 3')).toEqual(7)
    })

    describe('variables with integer values', () => {
      it('assign a value to a local variable', () => {
        expect(interpret('a = 4')).toEqual(null)
        expect(interpret('a + 5')).toEqual(9)
        expect(interpret('a * a')).toEqual(16)
        expect(interpret('10 ** a')).toEqual(10000)
      })

      xit('throws on unknown ids', () => {
        expect(() => interpret('b + c + d')).toThrow()
      })
    })
    
    describe('funcalls', () => {
      xit('calls a global function', () => {
        expect(() => interpret('print(1+2)')).not.toThrow()
      })
    })

    test.todo('conditionals and booleans')
    test.todo('custom operators / mixfix')
  })
})
