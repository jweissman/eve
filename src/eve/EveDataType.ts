import { JSValue } from "./types";


export abstract class EveDataType {
  abstract get js(): JSValue;
}
