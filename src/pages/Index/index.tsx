import { useState } from 'react'
import { Button, Drawer, Tabs, TabsProps } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import TableCease from './components/TableCease'
import TableCreate from './components/TableCreate'
import TableModifyDescription from './components/TableModifyDescription'
import TableDonate from './components/TableDonate'
import { ContractEvent, ProjectLog } from './const'
import PanelProject from './components/PanelProject'
import { queryProjectLog } from '../../utils'
import PanelTopDonator from './components/PanelTopDonator'
import { useOutletContext } from 'react-router-dom'
import { LayoutContext } from '../const'
import DonateModal from '../../components/DonateModal'
import { DonateData } from '../../components/DonateModal/const'

export default function Index() {
  const { signer, contract, openNotification } = useOutletContext<LayoutContext>()
  const [activedTab, setActivedTab] = useState<ContractEvent>(ContractEvent.Create)
  const [projectLog, setProjectLog] = useState<ProjectLog | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)

  const handleQueryHash = (hash: string) => {
    if (!!contract) {
      queryProjectLog(contract, hash).then(setProjectLog)
      setDrawerOpen(true)
    }
  }

  const items: TabsProps['items'] = [
    {
      key: ContractEvent.Create as unknown as string,
      label: '创建',
      children: <TableCreate contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Donate as unknown as string,
      label: '捐赠',
      children: <TableDonate contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Cease as unknown as string,
      label: '终止',
      children: <TableCease contract={contract} onQueryHash={handleQueryHash} />,
    },
    {
      key: ContractEvent.Modify as unknown as string,
      label: '修改描述',
      children: <TableModifyDescription contract={contract} onQueryHash={handleQueryHash} />,
    },
  ]

  const handleDonate = async ({ message, value }: DonateData) => {
    try {
      if (!!projectLog?.hash && !!contract && !!signer) {
        await contract.connect(signer).getFunction('donate')(projectLog.hash, message ?? '', { value: value })

        openNotification('success', '已捐赠', '感谢您的支持！')
        setDonateOpen(false)
      }
    } catch (error) {
      const { message: errorMsg } = error as Error
      openNotification('error', '交易失败', errorMsg)
    }
  }

  // 测试代码，未来会删除
  // 记得更新列表和详情捐赠后数据
  // 记得try catch await-function
  const hash = '0x4ac29dde26ba0969861d43dfe33159407438424be36f22dcf865871f0d84434b'

  const handleCease = async () => {
    const response = await contract?.connect(signer).getFunction('cease')(hash)
    await response.wait()
    console.log('cease')
  }

  const handleModify = async () => {
    const response = await contract?.connect(signer).getFunction('modifyDescription')(hash, '修改了')
    await response.wait()
    console.log('modify')
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

      <Drawer
        title="项目详情"
        width={700}
        onClose={() => setDrawerOpen(false)} open={drawerOpen}
        extra={
          <>
            {!projectLog?.ceaseTime && <Button type="primary" icon={<HeartOutlined />} onClick={() => setDonateOpen(true)}>
              捐赠一笔
            </Button>}
          </>
        }
      >
        <PanelProject projectLog={projectLog} />
        {projectLog?.donateList && projectLog?.donateList.length > 0 && <PanelTopDonator donateList={projectLog.donateList} />}
      </Drawer>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} onSubmit={handleDonate} />

      <div onClick={handleModify}>Modify</div>
      <div onClick={handleCease}>Cease</div>
      <div onClick={handleLog}>Log</div>
    </>
  )
}
