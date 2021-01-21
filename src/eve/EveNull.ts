import { EveDataType } from "./EveDataType";


export class EveNull implements EveDataType {
  get js(): null { return null; }
}
