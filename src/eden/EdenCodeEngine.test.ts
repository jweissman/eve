import { Opcode } from '../eve/vm/Opcode'
import { assignment, ASTNode, identifier, integerLiteral } from './ASTNode'
// import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { CodeEngine } from './types'

describe(EdenCodeEngine, () => {
  let engine: CodeEngine
  beforeEach(() => { engine = new EdenCodeEngine() })

  describe('error handling', () => {
    it('should throw on invalid instruction', () => {
      const kinds = ['integerLiteral', 'identifier', 'assignment']
      kinds.forEach(nodeKind => {
        expect(() => engine[nodeKind]({} as ASTNode)).toThrow()
      })
    })
  })

  describe('the empty program', () => {
    it('generates empty inst list', () => {
      expect(engine.emptyProgram({} as ASTNode)).toEqual([])
    })
  })

  describe('integer literals', () => {
    const integerConstExamples = [
      Opcode.LCONST_ZERO,
      Opcode.LCONST_ONE,
      Opcode.LCONST_TWO,
    ]
    it('uses integer constants when available', () => {
      (integerConstExamples).forEach((opcode, value) => {
        const result = engine.integerLiteral(integerLiteral(value))
        expect(result).toEqual([{ opcode: opcode }])
      })
    })

    it('loads from constant pool', () => {
      // first constant gets zero slot
      expect(engine.integerLiteral(integerLiteral(100))).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 }
      ])
      // second constant gets one slot
      expect(engine.integerLiteral(integerLiteral(101))).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 } 
      ])
      // first const again gets zero slot
      expect(engine.integerLiteral(integerLiteral(100))).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 }
      ])
    })
  })

  describe('identifiers', () => {
    it('loads from registers', () => {
      // first local identifier reads from register zero?
      // wait, how does it know this...?
      expect(engine.identifier(identifier('theId'))).toEqual([
        { opcode: Opcode.LSTORE, operandOne: 0 }
      ])

      // second local identifier reads from register one
      expect(engine.identifier(identifier('anotherId'))).toEqual([
        { opcode: Opcode.LSTORE, operandOne: 1 }
      ])
    })
  })

  describe('assignments', () => {
    it('writes to registers', () => {
      expect(engine.assignment(
        assignment(identifier('theId'), integerLiteral(1024))
      )).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 },
        { opcode: Opcode.ASTORE, operandOne: 0 },
      ])

      expect(engine.assignment(
        assignment(identifier('anotherId'), integerLiteral(256))
      )).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 },
        { opcode: Opcode.ASTORE, operandOne: 1 },
      ])

      expect(engine.assignment(
        assignment(identifier('theId'), integerLiteral(256))
      )).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 },
        { opcode: Opcode.ASTORE, operandOne: 0 },
      ])
    })
  })
})