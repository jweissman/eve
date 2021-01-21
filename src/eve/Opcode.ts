// table of mnemonics
export enum Opcode {
  NOOP = 0xfe,
  LCONST_ZERO = 0x00,
  LCONST_ONE = 0x01,
  LCONST_TWO = 0x02,
  LCONST_IDX = 0x10,

  INT_ADD = 0xa1,

  STR_JOIN = 0xb1,

  LSTORE = 0xc1,
  ASTORE = 0xc2,

  POP  = 0xd1,
  POP2 = 0xd2,
}
