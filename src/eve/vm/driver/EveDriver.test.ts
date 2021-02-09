import { EveDriver } from './EveDriver'
import { VM } from '../types'

describe('eve vm driver', () => {
  xit('throws on missing program', () => {
    const vm = {} as VM
    const driver = new EveDriver(vm)
    expect(() => driver.runUntilHalt()).toThrow('no program found')
  })

  test.todo('optimizes gotos into jumps (static)')

  // it()
})
