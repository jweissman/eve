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

    test.todo('parses simple sums')
  })

  test.todo('interprets eden code')
  // , () => {
  // expect(parser.parse)
  // expect(interpreter.evaluate("2+2")).toEqual(4)
  // expect(interpreter.evaluate("print('hello')"))
  // })

})