export enum Operation {
  NoOperation = 'noop',
  LoadConstantZero = 'load_const_zero',
  LoadConstantOne = 'load_const_one',
  LoadConstantTwo = 'load_const_two',
  LoadConstantByIndex = 'load_const_by_index',
  IntegerAdd = 'add_integers',
  StringJoin = 'join_strings',
  LoadFromStore = 'load_from_store',
  AddToStore = 'add_to_store',
  Pop = 'pop',
  PopTwo = 'pop_two',
  JumpIfZero = 'jump_if_zero',
  Jump = 'jump',
  Throw = 'throw',
  Goto = 'goto',
}