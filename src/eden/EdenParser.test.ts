import { assignment, binaryExpression, identifier, integerLiteral } from './ASTNode'
import { BinaryOperator } from './BinaryOperator'
import { EdenParser } from './EdenParser'

const parser = new EdenParser()

const expectParsesIdentifier = (input: string) =>
  expect(parser.parse(input)).toEqual(identifier(input))

const expectParsesArithmetic = (input: string, operator: BinaryOperator, left = 0, right = 1) =>
  expect(parser.parse(input)).toEqual(
    binaryExpression(operator, integerLiteral(left), integerLiteral(right))
  )

describe('parsing eden code', () => {
  it('parses the empty program', () => {
    expect(()=>parser.parse('')).not.toThrow()
  })

  it('parses an incomplete program', () => {
    expect(()=>parser.parse('1+')).toThrow()
  })

  describe('integer arithmetic', () => {
    it('parses numbers', () => {
      ['0', '1', '2', '3', '10', '100', '1024'].forEach(value => {
        expect(parser.parse(value)).toEqual(integerLiteral(Number(value)))
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
        expectParsesArithmetic(test, op) // BinaryOperator.Add)
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
              children: []
            },
            {
              kind: 'integerLiteral',
              numericValue: 2,
              children: []
            },
          ],
        },
        {
          kind: 'integerLiteral',
          numericValue: 3,
          children: []
        }],
      })
    })
  })

  describe('identifiers', () => {
    const singleLetterIds = ['a', 'b', 'c', 'd', 'e', 'x', 'y', 'z', '_']
    const multipleLetterIds = ['abacus', 'bacteria', 'cactus', 'xylophone', '_underbar']
    it('parses single-letter identifiers', () => {
      singleLetterIds.forEach((identifier) => expectParsesIdentifier(identifier))
    })
    it('parses multi-letter identifiers', () => {
      multipleLetterIds.forEach((identifier) => expectParsesIdentifier(identifier))
    })
  })

  describe('assignment', () => {
    it('parses an assignment expression', () => {
      expect(parser.parse('a = b')).toEqual(
        assignment(identifier('a'), identifier('b'))
      )
    })
  })
})
