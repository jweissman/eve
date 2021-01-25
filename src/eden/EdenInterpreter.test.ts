import { BinaryOperator } from './BinaryOperator'
import { EdenInterpreter } from './EdenInterpreter'

describe('eden interpreter', () => {
  const interpreter = new EdenInterpreter()
  const { parser } = interpreter
  beforeEach(() => {
    const debug = false
    interpreter.config = { debug }
  })

  describe('parsing eden code', () => {
    it('parses the empty program', () => {
      expect(parser.parse('')).toEqual({ kind: 'emptyProgram' })
    })

    it('parses simple numbers', () => {
      expect(parser.parse('0')).toEqual({ kind: 'integerLiteral', numericValue: 0 })
      expect(parser.parse('1')).toEqual({ kind: 'integerLiteral', numericValue: 1 })
      expect(parser.parse('2')).toEqual({ kind: 'integerLiteral', numericValue: 2 })
    })

    it('parses simple sums', () => {
      expect(parser.parse('0+1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Add, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses simple differences', () => {
      expect(parser.parse('0-1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Subtract, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses simple multiplications', () => {
      expect(parser.parse('0*1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Multiply, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })
  })

  describe('interprets eden code', () => {
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
      expect(interpreter.evaluate('2/3')).toEqual(2/3)
    })
  })

})