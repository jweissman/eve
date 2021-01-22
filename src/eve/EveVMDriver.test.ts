import { EveVMDriver } from "./EveVMDriver"
import { VM } from "./types"

describe('eve vm driver', () => {
  it('throws on missing program', () => {
    let vm = {} as VM
    let driver = new EveVMDriver(vm)
    expect(() => driver.runUntilHalt('_fake')).toThrow('no such program _fake')
  })

  test.todo('optimizes gotos into jumps (static)')
})