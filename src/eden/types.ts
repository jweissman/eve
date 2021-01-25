import { Instruction, ConstantPool } from '../eve/vm/types'
import { ASTNode } from './ASTNode'
import { ASTNodeKind } from './ASTNodeKind'

type TreeGenerator<T> = (ast: ASTNode) => T
export type TreeInspector = { [key in ASTNodeKind]: TreeGenerator<string> }

type IxGenerator = TreeGenerator<Instruction[]>
export type CodeEngine = { [key in ASTNodeKind]: IxGenerator }
                & { constants: ConstantPool}


