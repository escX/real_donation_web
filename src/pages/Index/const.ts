import { Contract } from 'ethers'

export enum ContractEvent {
  Create,
  Donate,
  Cease,
  Modify
}

export const eventSignature = {
  [ContractEvent.Create]: 'Create(bytes32,address,string,string,uint256)',
  [ContractEvent.Donate]: 'Donate(bytes32,address,address,string,uint256,string,uint256)',
  [ContractEvent.Cease]: 'Cease(bytes32,string,uint256)',
  [ContractEvent.Modify]: 'ModifyDescription(bytes32,string,string,uint256)',
}

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
