import { Action, ActionDict } from 'ohm-js';

export class SemanticOperation implements ActionDict {
  [index: string]: Action;
}
