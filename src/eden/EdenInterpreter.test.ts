import { EdenInterpreter } from './EdenInterpreter'

describe('eden interpreter', () => {
  const interpreter = new EdenInterpreter()

  beforeEach(() => {
    const debug = false
    interpreter.config = { debug }
  })

  describe('interprets basic eden code', () => {
    describe('core integer math operations', () => {
      it('add/subtract', () => {
        expect(interpreter.evaluate('2+2')).toEqual(4)
        expect(interpreter.evaluate('2+3')).toEqual(5)
        expect(interpreter.evaluate('2-2')).toEqual(0)
        expect(interpreter.evaluate('2-3')).toEqual(-1)
      })

      it('multiply/divide', () => {
        expect(interpreter.evaluate('2*2')).toEqual(4)
        expect(interpreter.evaluate('2*3')).toEqual(6)
        expect(interpreter.evaluate('2/2')).toEqual(1)
        expect(interpreter.evaluate('2/3')).toEqual(2 / 3)
      })

      it('exponent', () => {
        expect(interpreter.evaluate('2**3')).toEqual(8)
        expect(interpreter.evaluate('2**4')).toEqual(16)
        expect(interpreter.evaluate('2**5')).toEqual(32)
      })

      it('modulus', () => {
        expect(interpreter.evaluate('10%3')).toEqual(1)
        expect(interpreter.evaluate('10%4')).toEqual(2)
        expect(interpreter.evaluate('10%5')).toEqual(0)
      })

      it('precedence/parens', () => {
        expect(interpreter.evaluate('1+2/3')).toEqual(1 + 2 / 3)
        expect(interpreter.evaluate('(1+2)/3')).toEqual(1)
      })
    })

    it('handles spaces', () => {
      expect(interpreter.evaluate('4 + 3')).toEqual(7)
    })

    describe('variables with integer values', () => {
      xit('assign a value to a local variable', () => {
        expect(interpreter.evaluate('a = 4')).toEqual(4)
        expect(interpreter.evaluate('a + 5')).toEqual(9)
        expect(interpreter.evaluate('a * a')).toEqual(16)
        expect(interpreter.evaluate('10 ** a')).toEqual(10000)
      })
    })

    test.todo('conditionals and booleans')
  })
})