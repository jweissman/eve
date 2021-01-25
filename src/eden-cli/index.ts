
import chalk from 'chalk'
import repl from 'repl'
import { EdenInterpreter } from '../eden/EdenInterpreter'
import { Executor } from '../eve/vm/Executor'
import { JSValue } from '../eve/vm/types'

const debug = true
Executor.debug = debug
const prompt = chalk.white(`\n\n${chalk.greenBright('eden')} > `)
const interpreter = new EdenInterpreter()
interpreter.config = { debug }

const interpretEden = (input: string, _ctx: any, _filename: any, cb: any) => {
  const userCode = input.trim()
  let result: JSValue = null
  try {
    result = interpreter.evaluate(userCode)
    console.log(`  ${chalk.green('#')} => ${result}`)
  } catch (err) {
    console.error(chalk.red(err))
    if (debug) {
      console.trace(err)
    }
  }
  cb()
}

repl.start({
  prompt,
  eval: interpretEden 
})