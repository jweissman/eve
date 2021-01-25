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

    describe('variables with integer values', () => {
      test.todo('assign a value to a local variable')
    })

    test.todo('conditionals and booleans')
  })
})