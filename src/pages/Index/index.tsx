import { Contract, JsonRpcSigner, ethers } from 'ethers'
import { createRef, useEffect, useState } from 'react'
import { Tabs, TabsProps } from 'antd'
import abi from '../../abi'
import TableCease from './components/TableCease'
import TableCreate from './components/TableCreate'
import TableModifyDescription from './components/TableModifyDescription'
import TableDonate from './components/TableDonate'
import { ContractEvent, TableRefData } from './const'
import PanelProject from './components/PanelProject'
import styles from './index.module.scss'

const jsonRpcUrl = 'http://localhost:8545'
const deployedAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default function Index() {
  const [accounts, setAccounts] = useState<JsonRpcSigner[]>([])
  const [contract, setContract] = useState<Contract | null>(null)
  const [activedTab, setActivedTab] = useState<ContractEvent>(ContractEvent.Create)
  const [queryHash, setQueryHash] = useState<string>()

  const createTableRef = createRef<TableRefData>()
  const ceaseTableRef = createRef<TableRefData>()
  const donateTableRef = createRef<TableRefData>()
  const modifyDescriptionTableRef = createRef<TableRefData>()

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(jsonRpcUrl)
    const contract = new ethers.Contract(deployedAddress, abi, provider)
    provider.listAccounts().then(accounts => {
      setAccounts(accounts)
    })

    setContract(contract)
  }, [jsonRpcUrl, deployedAddress])

  useEffect(() => {
    if (!!contract) {
      contract.on('*', (event) => {
        switch (event.eventName) {
          case 'Create':
            createTableRef.current?.reload(contract)
            break
          case 'Donate':
            donateTableRef.current?.reload(contract)
            break
          case 'Cease':
            ceaseTableRef.current?.reload(contract)
            break
          case 'ModifyDescription':
            modifyDescriptionTableRef.current?.reload(contract)
            break
        }
      })
    }
  }, [contract])

  const items: TabsProps['items'] = [
    {
      key: ContractEvent.Create as unknown as string,
      label: '创建',
      children: <TableCreate ref={createTableRef} contract={contract} onQueryHash={setQueryHash} />,
    },
    {
      key: ContractEvent.Donate as unknown as string,
      label: '捐赠',
      children: <TableDonate ref={donateTableRef} contract={contract} onQueryHash={setQueryHash} />,
    },
    {
      key: ContractEvent.Cease as unknown as string,
      label: '终止',
      children: <TableCease ref={ceaseTableRef} contract={contract} onQueryHash={setQueryHash} />,
    },
    {
      key: ContractEvent.Modify as unknown as string,
      label: '修改描述',
      children: <TableModifyDescription ref={modifyDescriptionTableRef} contract={contract} onQueryHash={setQueryHash} />,
    },
  ]

  const handleCreate = async () => {
    const response = await contract?.connect(accounts[0]).getFunction('create')('q', 'w')
    await response.wait()
    console.log('creat')
  }

  const hash = '0xc697d1125c7b3061d25d508dd073a7752cabbebfe2a2a9311e9129b48e1003ba'

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
      <div className={styles.flex}>
        <div className={styles.logs}>
          <Tabs
            items={items}
            activeKey={activedTab as unknown as string}
            onChange={value => setActivedTab(value as unknown as ContractEvent)}
          />
        </div>
        {contract && queryHash && <div className={styles.details}>
          <PanelProject contract={contract} hash={queryHash} />
        </div>}
      </div>

      <div onClick={handleCreate}>Create</div>
      <div onClick={handleModify}>Modify</div>
      <div onClick={handleCease}>Cease</div>
      <div onClick={handleDonate}>Donate</div>
      <div onClick={handleLog}>Log</div>
    </>
  )
}
