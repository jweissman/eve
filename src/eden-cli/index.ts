
import repl from 'repl'
import { EdenInterpreter } from '../eden/EdenInterpreter'

console.log('Hello from eden cli')
const myEval = (input: string) => new EdenInterpreter().evaluate(input.trim())
repl.start({
  prompt: 'eden> ',
  eval: myEval 
})