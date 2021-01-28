import { BinaryOperator } from './BinaryOperator'
import { EdenParser } from './EdenParser'

describe('parsing eden code', () => {
  const parser = new EdenParser()

  it('parses the empty program', () => {
    expect(parser.parse('')).toEqual({ kind: 'emptyProgram' })
  })

  describe('integer arithmetic', () => {
    it('parses numbers', () => {
      expect(parser.parse('0')).toEqual({ kind: 'integerLiteral', numericValue: 0 })
      expect(parser.parse('1')).toEqual({ kind: 'integerLiteral', numericValue: 1 })
      expect(parser.parse('2')).toEqual({ kind: 'integerLiteral', numericValue: 2 })
    })

    it('parses sums', () => {
      expect(parser.parse('0+1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Add, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses differences', () => {
      expect(parser.parse('0-1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Subtract, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses multiplications', () => {
      expect(parser.parse('0*1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Multiply, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses divisions', () => {
      expect(parser.parse('0/1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Divide, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses expontentiations', () => {
      expect(parser.parse('0**1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Power, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses modulus', () => {
      expect(parser.parse('0%1')).toEqual(
        {
          kind: 'binaryExpression', operator: BinaryOperator.Modulus, children: [
            { kind: 'integerLiteral', numericValue: 0 },
            { kind: 'integerLiteral', numericValue: 1 }
          ]
        }
      )
    })

    it('parses parens', () => {
      expect(parser.parse('(1+2)*3')).toEqual({
        kind: 'binaryExpression',
        operator: '*',
        children: [{
          kind: 'binaryExpression',
          operator: '+',
          children: [
            {
              kind: 'integerLiteral',
              numericValue: 1,
            },
            {
              kind: 'integerLiteral',
              numericValue: 2,
            },
          ],
        },
        {
          kind: 'integerLiteral',
          numericValue: 3,
        }],
      })
    })
  })

  describe('identifiers', () => {
    it('parses a one-letter identifier', () => {
      expect(parser.parse('a')).toEqual({ kind: 'identifier', name: 'a' })
      expect(parser.parse('x')).toEqual({ kind: 'identifier', name: 'x' })
    })

    it('parses a multi-letter identifier', () => {
      expect(parser.parse('abc')).toEqual({ kind: 'identifier', name: 'abc' })
      expect(parser.parse('xyz')).toEqual({ kind: 'identifier', name: 'xyz' })
    })
  })

  describe('assignment', () => {
    it('parses an assignment expression', () => {
      expect(parser.parse('a = b')).toEqual({
        kind: 'assignment',
        children: [
          { kind: 'identifier', name: 'a' }, 
          { kind: 'identifier', name: 'b' }, 
        ]
      })
    })
  })
})
