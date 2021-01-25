import { BinaryOperator } from './BinaryOperator'
import { EdenParser } from './EdenParser'

describe('parsing eden code', () => {
  const parser = new EdenParser()
  
  it('parses the empty program', () => {
    expect(parser.parse('')).toEqual({ kind: 'emptyProgram' })
  })

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
    expect(parser.parse('('))
  })
})
