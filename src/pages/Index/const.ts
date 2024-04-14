import { Contract } from 'ethers'

export interface EventCreateData {
  hash: string
  creator: string
  name: string
  createTime: bigint
  blockHash: string
}

export interface EventModifyDescriptionData {
  hash: string
  description: string
  modifyTime: bigint
  blockHash: string
}

export interface EventCeaseData {
  hash: string
  ceaseTime: bigint
  blockHash: string
}

export interface EventDonateData {
  hash: string
  donator: string
  receiver: string
  name: string
  amount: bigint
  message: string
  donateTime: bigint
  blockHash: string
}

export enum ContractEvent {
  Create,
  Donate,
  Cease,
  Modify
}

export const eventSignature = {
  [ContractEvent.Create]: 'Create(bytes32,address,string,string,uint256)',
  [ContractEvent.Donate]: 'Donate(bytes32,address,address,string,uint256,string,uint256)',
  [ContractEvent.Cease]: 'Cease(bytes32,uint256)',
  [ContractEvent.Modify]: 'ModifyDescription(bytes32,string,uint256)',
}

export interface TableRefData {
  reload: (contract: Contract) => Promise<void>
}
