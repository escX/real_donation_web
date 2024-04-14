export interface ProjectLog {
  hash: string,
  creator: string,
  name: string,
  description: string,
  createTime: bigint,
  ceaseTime: bigint | null,
  modifyList: {
    description: string,
    modifyTime: bigint,
  }[],
  donateList: {
    donator: string,
    amount: bigint,
    message: string,
    donateTime: bigint,
  }[]
}
