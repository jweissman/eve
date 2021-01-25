// table of mnemonics
export enum Opcode {
  NOOP = 0x00,

  LCONST_ZERO = 0x10,
  LCONST_ONE = 0x11,
  LCONST_TWO = 0x12,

  LCONST_IDX = 0x20,

  INT_ADD = 0xa1,
  INT_SUB = 0xa2,
  INT_MUL = 0xa3,
  INT_DIV = 0xa4,

  STR_JOIN = 0xb1,

  LSTORE = 0xc1,
  ASTORE = 0xc2,

  POP = 0xd1,
  POP2 = 0xd2,

  THROW = 0xe0,
  JUMP_Z = 0xe1,

  GOTO = 0xf0,
  JUMP = 0xf1,
}
