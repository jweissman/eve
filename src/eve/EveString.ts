import { EveDataType } from "./EveDataType";


export class EveString implements EveDataType {
  private internalValue: string;
  constructor(value: any) { this.internalValue = String(value); }
  get js(): string { return String(this.internalValue); }
}
