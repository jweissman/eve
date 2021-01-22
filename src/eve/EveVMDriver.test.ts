import { EveVMDriver } from './EveVMDriver'
import { VM } from './types'

describe('eve vm driver', () => {
  it('throws on missing program', () => {
    const vm = {} as VM
    const driver = new EveVMDriver(vm)
    expect(() => driver.runUntilHalt('_fake')).toThrow('no such program _fake')
  })

  test.todo('optimizes gotos into jumps (static)')
})