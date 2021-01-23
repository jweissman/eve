import { BinaryOperator } from './BinaryOperator'
import { EdenInterpreter } from './EdenInterpreter'

describe('eden interpreter', () => {
  const interpreter = new EdenInterpreter()
  const { parser } = interpreter

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
  })

  it('interprets eden code', () => {
    expect(interpreter.evaluate('2+2')).toEqual(4)
  })

})