import { BinaryOperator } from './BinaryOperator'
import { EdenParser } from './EdenParser'

const parser = new EdenParser()

const verifyParseId = (input: string) => {
  expect(parser.parse(input)).toEqual({ kind: 'identifier', name: input })
}

const verifyParseArithmetic = (input: string, operator: BinaryOperator, left = 0, right = 1) => {
  expect(parser.parse(input)).toEqual(
    {
      kind: 'binaryExpression', operator: operator, children: [
        { kind: 'integerLiteral', numericValue: left },
        { kind: 'integerLiteral', numericValue: right }
      ]
    }
  )
}

describe('parsing eden code', () => {
  xit('parses the empty program', () => {
    expect(parser.parse('')).toEqual({ kind: 'emptyProgram' })
  })

  describe('integer arithmetic', () => {
    it('parses numbers', () => {
      ['0', '1', '2', '3', '10', '100', '1024'].forEach(value => {
        expect(parser.parse(value)).toEqual({ kind: 'integerLiteral', numericValue: Number(value) })
      })
    })

    it('parses binary operators', () => {
      const binaryOperatorCases = {
        '0+1': BinaryOperator.Add,
        '0-1': BinaryOperator.Subtract,
        '0*1': BinaryOperator.Multiply,
        '0/1': BinaryOperator.Divide,
        '0%1': BinaryOperator.Modulus,
        '0**1': BinaryOperator.Power,
      }
      Object.entries(binaryOperatorCases).forEach(([test, op]) => {
        verifyParseArithmetic(test, op) // BinaryOperator.Add)
      })
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
    const singleLetterIds = ['a', 'b', 'c', 'd', 'e', 'x', 'y', 'z', '_']
    const multipleLetterIds = ['abacus', 'bacteria', 'cactus', 'xylophone', '_underbar']
    it('parses single-letter identifiers', () => {
      singleLetterIds.forEach((identifier) => verifyParseId(identifier))
    })
    it('parses multi-letter identifiers', () => {
      multipleLetterIds.forEach((identifier) => verifyParseId(identifier))
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
