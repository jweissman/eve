// import { ASTNode } from './ASTNode'
import { edenGrammar } from './EdenGrammar'
import { EdenInspector } from './EdenInspector'
import { EdenTree } from './EdenTree'

const semantics = edenGrammar.createSemantics()
semantics.addOperation('inspect', new EdenInspector())
semantics.addOperation('tree', new EdenTree())

export { semantics as edenSemantics }