import { Opcode } from '../eve/vm/Opcode'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'
import { EdenCodeEngine } from './EdenCodeEngine'
import { CodeEngine } from './types'

describe(EdenCodeEngine, () => {
  let engine: CodeEngine
  beforeEach(() => { engine = new EdenCodeEngine() })

  describe('the empty program', () => {
    it('generates empty inst list', () => {
      expect(engine.emptyProgram({} as ASTNode)).toEqual([])
    })
  })

  describe('integer literals', () => {
    it('loads from constants', () => {
      // first constant gets zero slot
      expect(engine.integerLiteral({ kind: 'integerLiteral', numericValue: 100 } as ASTNode)).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 }
      ])
      // second constant gets one slot
      expect(engine.integerLiteral({ kind: 'integerLiteral', numericValue: 101 } as ASTNode)).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 } 
      ])
      // first const again gets zero slot
      expect(engine.integerLiteral({ kind: 'integerLiteral', numericValue: 100 } as ASTNode)).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 }
      ])
    })
  })

  describe('identifiers', () => {
    it('loads from registers', () => {
      // first local identifier reads from register zero
      expect(engine.identifier({ kind: 'identifier', name: 'theId' } as ASTNode)).toEqual([
        { opcode: Opcode.LSTORE, operandOne: 0 }
      ])

      // second local identifier reads from register one
      expect(engine.identifier({ kind: 'identifier', name: 'anotherId' } as ASTNode)).toEqual([
        { opcode: Opcode.LSTORE, operandOne: 1 }
      ])
    })
  })

  describe('assignments', () => {
    it('writes to registers', () => {
      expect(engine.assignment({
        kind: ASTNodeKind.Assignment,
        id: 'assignment',
        children: [
          { kind: 'identifier', name: 'theId' } as ASTNode,
          { kind: 'integerLiteral', numericValue: 1024 } as ASTNode
        ]
      })).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 0 },
        { opcode: Opcode.ASTORE, operandOne: 0 },
      ])

      expect(engine.assignment({
        kind: ASTNodeKind.Assignment,
        id: 'assignment',
        children: [
          { kind: ASTNodeKind.Identifier, name: 'anotherId' } as ASTNode,
          { kind: ASTNodeKind.IntLit, numericValue: 256 } as ASTNode
        ]
      })).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 },
        { opcode: Opcode.ASTORE, operandOne: 1 },
      ])

      expect(engine.assignment({
        kind: ASTNodeKind.Assignment,
        id: 'assignment',
        children: [
          { kind: ASTNodeKind.Identifier, name: 'theId' } as ASTNode,
          { kind: ASTNodeKind.IntLit, numericValue: 256 } as ASTNode
        ]
      })).toEqual([
        { opcode: Opcode.LCONST_IDX, operandOne: 1 },
        { opcode: Opcode.ASTORE, operandOne: 0 },
      ])
    })
  })
})