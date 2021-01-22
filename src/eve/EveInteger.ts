import { EveDataType } from './EveDataType'


export class EveInteger implements EveDataType {
  private internalValue: number;
  constructor(value: number) { this.internalValue = Number(value) }
  get js(): number { return Number(this.internalValue) }
}
