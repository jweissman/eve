/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { EveInteger } from '../../data-types/EveInteger'
import { Operation } from '../../Operation'
import { VM } from '../../types'

export function constantFor(value: number): string | undefined {
  if (value === 0) { return 'load_const_zero'} 
  else if (value === 1) { return 'load_const_one'} 
  else if (value === 2) { return 'load_const_two'} 
  return undefined
  // else { throw new Error('no constant found for ' + value) }
}

export const verifyArithmetic = (vm: VM, method: Operation, left: number, right: number, result: number) => {
  const lhs = constantFor(left)
  const rhs = constantFor(right)

  if (lhs) { vm[lhs]() } else { 
    vm.constantPool = [new EveInteger(left)]
    vm.load_const_by_index({ operandOne: 0 })
  }
  if (rhs) { vm[rhs]() } else { 
    vm.constantPool = [new EveInteger(right)]
    vm.load_const_by_index({ operandOne: 0 })
  }

  vm[method]()
  expect(vm.top.js).toEqual(result)
}

