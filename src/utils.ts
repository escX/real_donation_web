import { Contract, EventLog, ethers } from 'ethers'
import { ContractEvent, ProjectLog, eventSignature } from './pages/Index/const'

export function omitHash(hash: string) {
  if (!hash || hash.length <= 16) {
    return hash
  }

  const len = hash.length
  return `${hash.slice(0, 5)}...${hash.slice(len - 5, len)}`
}

export function blockTimeToStr(time: bigint) {
  const timestamp = Number(time) * 1000
  return new Date(timestamp).toLocaleString()
}

export async function queryProjectLog(contract: Contract, hash: string): Promise<ProjectLog> {
  const getCreateLogs = contract.queryFilter([ethers.id(eventSignature[ContractEvent.Create]), hash])
  const getModifyLogs = contract.queryFilter([ethers.id(eventSignature[ContractEvent.Modify]), hash])
  const getCeaseLogs = contract.queryFilter([ethers.id(eventSignature[ContractEvent.Cease]), hash])
  const getDonateLogs = contract.queryFilter([ethers.id(eventSignature[ContractEvent.Donate]), hash])

  const result = await Promise.all([getCreateLogs, getModifyLogs, getCeaseLogs, getDonateLogs])
  const createLogs = result[0] as EventLog[]
  const modifyLogs = result[1] as EventLog[]
  const ceaseLogs = result[2] as EventLog[]
  const DonateLogs = result[3] as EventLog[]

  return {
    hash,
    creator: createLogs[0].args[1],
    name: createLogs[0].args[2],
    description: createLogs[0].args[3],
    createTime: createLogs[0].args[4],
    ceaseTime: ceaseLogs[0]?.args[2] ?? null,
    modifyList: modifyLogs.map(item => ({
      description: item.args[2],
      modifyTime: item.args[3]
    })),
    donateList: DonateLogs.map(item => ({
      donator: item.args[1],
      amount: item.args[4],
      message: item.args[5],
      donateTime: item.args[6],
    }))
  }
}
