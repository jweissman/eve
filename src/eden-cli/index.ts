
import chalk from 'chalk'
import repl from 'repl'
import { EdenInterpreter } from '../eden/EdenInterpreter'
import { eveNull } from '../eve/vm/Constants'
// import { Executor } from '../eve/vm/Executor'
import { EveValue } from '../eve/vm/types'

type ReplCallback = (err: Error | null, result: unknown) => void

const prompt = chalk.white(`\n\n${chalk.greenBright('eden')} > `)
const interpreter = new EdenInterpreter()

class EdenCLI {
  static start(): void {
    repl.start({
      prompt,
      eval: EdenCLI.interpretEden
    })
  }

  static interpretEden: repl.REPLEval = (
    input: string,
    _ctx: unknown,
    _filename: unknown,
    cb: ReplCallback
  ) => {
    const userCode = input.trim()
    let eveResult: EveValue = eveNull
    try { eveResult = interpreter.evaluate(userCode) } catch (err) {
      console.error(chalk.red(err))
      // if (debug) {
      console.trace(err)
      // }
    }
    const result = eveResult.js
    cb(null, result)
  }
}

export { EdenCLI }
