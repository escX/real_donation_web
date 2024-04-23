import { BrowserProvider, Contract, EventLog, JsonRpcSigner, ethers } from 'ethers'
import { ContractEvent, ProjectLog, eventSignature } from './pages/Index/const'
import { useEffect, useState } from 'react'

export function ellipsisHash(hash: string, prefixLen = 7, suffixLen = 5) {
  const hashLen = hash.length

  if (hashLen <= prefixLen + suffixLen) {
    return hash
  }

  return `${hash.slice(0, prefixLen)}...${hash.slice(hashLen - suffixLen, hashLen)}`
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

export const supportNetworks = [
  { chainId: '0x7a69', chainName: 'Hardhat Localhost', deployedAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3' }, // 31337
  { chainId: '0xaa36a7', chainName: 'Sepolia Testnet', deployedAddress: '' }, // 11155111
  { chainId: '0x1', chainName: 'Ethereum Mainnet', deployedAddress: '' }, // 1
]

export function useMetaMask(networks: typeof supportNetworks) {
  const hasMetaMask = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask

  if (!hasMetaMask) {
    return {
      provider: null,
      signer: null,
      chainId: undefined,
      account: undefined,
      connet: async () => { },
      changeNetwork: async () => { },
    }
  }

  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<string>()
  const [accounts, setAccounts] = useState<string[]>([])

  useEffect(() => {
    setProvider(new BrowserProvider(window.ethereum))

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setAccounts(accounts)
    })

    window.ethereum.on('chainChanged', (chainId: string) => {
      setChainId(chainId)
    })
  }, [])

  useEffect(() => {
    if (!!provider) {
      provider.send('eth_chainId', []).then(chainId => {
        if (networks.map(item => item.chainId).includes(chainId)) {
          setChainId(chainId)
        } else {
          setChainId(networks[0].chainId)
        }
      })

      provider.send('eth_accounts', []).then(accounts => {
        setAccounts(accounts)
      })
    }
  }, [provider])

  useEffect(() => {
    if (!!provider && !!accounts[0]) {
      provider.getSigner().then(signer => {
        setSigner(signer)
      }).catch(() => {
        setSigner(null)
      })
    } else {
      setSigner(null)
    }
  }, [provider, accounts[0]])

  const connet = async () => {
    try {
      await provider?.send('eth_requestAccounts', [])
    } catch (error) {
      console.error(error)
    }
  }

  const changeNetwork = async (chainId: string) => {
    try {
      await provider?.send('wallet_switchEthereumChain', [{ chainId }])
    } catch (error) {
      console.error(error)
    }
  }

  return {
    provider,
    signer,
    chainId,
    account: accounts[0],
    connet,
    changeNetwork,
  }
}
