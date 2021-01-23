import fs from 'fs'
import ohm from 'ohm-js'
const contents = fs.readFileSync('src/eve/eden/Eden.ohm')
export const edenGrammar = ohm.grammar(contents as unknown as string)
