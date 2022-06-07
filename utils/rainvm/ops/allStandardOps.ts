export enum AllStandardOps {
  CONSTANT,
  STACK,
  CONTEXT,
  STORAGE,
  ZIPMAP,
  DEBUG,
  ERC20_BALANCE_OF,
  ERC20_TOTAL_SUPPLY,
  ERC20_SNAPSHOT_BALANCE_OF_AT,
  ERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
  BLOCK_NUMBER,
  BLOCK_TIMESTAMP,
  SENDER,
  THIS_ADDRESS,
  SCALE18_MUL,
  SCALE18_DIV,
  SCALE18,
  SCALEN,
  SCALE_BY,
  ADD,
  SATURATING_ADD,
  SUB,
  SATURATING_SUB,
  MUL,
  SATURATING_MUL,
  DIV,
  MOD,
  EXP,
  MIN,
  MAX,
  ISZERO,
  EAGER_IF,
  EQUAL_TO,
  LESS_THAN,
  GREATER_THAN,
  EVERY,
  ANY,
  REPORT,
  REPORT_TIME_FOR_TIER,
  SATURATING_DIFF,
  SELECT_LTE,
  UPDATE_TIMES_FOR_TIER_RANGE,
  IERC721_BALANCE_OF,
  IERC721_OWNER_OF,
  IERC1155_BALANCE_OF,
  IERC1155_BALANCE_OF_BATCH,
  length,
}
