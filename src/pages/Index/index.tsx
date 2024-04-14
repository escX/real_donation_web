import { Contract, JsonRpcProvider, JsonRpcSigner, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Drawer, Tabs, TabsProps } from 'antd'
import abi from '../../abi'
import TableCease from './components/TableCease'
import TableCreate from './components/TableCreate'
import TableModifyDescription from './components/TableModifyDescription'
import TableDonate from './components/TableDonate'
import { ContractEvent } from './const'
import PanelProject from './components/PanelProject'

const jsonRpcUrl = 'http://localhost:8545'
const deployedAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default function Index() {
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null)
  const [accounts, setAccounts] = useState<JsonRpcSigner[]>([])
  const [contract, setContract] = useState<Contract | null>(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [activedTab, setActivedTab] = useState<ContractEvent>(ContractEvent.Create)
  const [queryHash, setQueryHash] = useState<string>()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(jsonRpcUrl)
    const contract = new ethers.Contract(deployedAddress, abi, provider)
    provider.listAccounts().then(accounts => {
      setAccounts(accounts)
    })

    setProvider(provider)
    setContract(contract)
  }, [jsonRpcUrl, deployedAddress])

  useEffect(() => {
    if (!!provider && !!contract) {
      contract.on('*', () => {
        provider.getBlockNumber().then(setBlockNumber)
      })
    }
  }, [provider, contract])

  const handleQueryHash = (hash: string) => {
    setQueryHash(hash)
    setDrawerOpen(true)
  }

  const items: TabsProps['items'] = [
    {
      key: ContractEvent.Create as unknown as string,
      label: '创建',
      children: <TableCreate blockNumber={activedTab === ContractEvent.Create ? blockNumber : 0} contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Donate as unknown as string,
      label: '捐赠',
      children: <TableDonate blockNumber={activedTab === ContractEvent.Donate ? blockNumber : 0} contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Cease as unknown as string,
      label: '终止',
      children: <TableCease blockNumber={activedTab === ContractEvent.Cease ? blockNumber : 0} contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Modify as unknown as string,
      label: '修改描述',
      children: <TableModifyDescription blockNumber={activedTab === ContractEvent.Modify ? blockNumber : 0} contract={contract} onQueryHash={handleQueryHash} />,
    },
  ]

  const hash = '0x6e34515122d75757fc67b51e6c45d9827b84032e33056c2f0793d185a4b5270e'
  const handleCreate = async () => {
    const response = await contract?.connect(accounts[0]).getFunction('create')('q', 'w')
    await response.wait()
    console.log('creat')
  }

  const handleCease = async () => {
    const response = await contract?.connect(accounts[0]).getFunction('cease')(hash)
    await response.wait()
    console.log('cease')
  }

  const handleModify = async () => {
    const response = await contract?.connect(accounts[0]).getFunction('modifyDescription')(hash, '修改了')
    await response.wait()
    console.log('modify')
  }

  const handleDonate = async () => {
    const response = await contract?.connect(accounts[1]).getFunction('donate')(hash, '我给你捐钱了', { value: 100 })
    await response.wait()
    console.log('donate')
  }

  const handleLog = async () => {
    const transferEvents = await contract?.queryFilter('Create', 0, 'latest')
    console.log('Logs:', transferEvents)
  }

  return (
    <>
      <Tabs
        items={items}
        activeKey={activedTab as unknown as string}
        onChange={value => setActivedTab(value as unknown as ContractEvent)}
      />

      <Drawer title="项目详情" width={700} onClose={() => setDrawerOpen(false)} open={drawerOpen}>
        {contract && queryHash && <PanelProject contract={contract} hash={queryHash} />}
      </Drawer>

      <div onClick={handleCreate}>Create</div>
      <div onClick={handleModify}>Modify</div>
      <div onClick={handleCease}>Cease</div>
      <div onClick={handleDonate}>Donate</div>
      <div onClick={handleLog}>Log</div>
    </>
  )
}
