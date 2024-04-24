import { useOutletContext } from "react-router-dom"
import { LayoutContext } from "../const"
import { EventLog, ethers } from "ethers"
import { ContractEvent, ProjectLog, eventSignature } from "../Index/const"
import { useEffect, useState } from "react"
import { EventDonateData } from "../Index/components/TableDonate/const"
import { Button, Drawer, Table, TableProps, Typography } from "antd"
import { HeartOutlined } from '@ant-design/icons'
import { blockTimeToStr, ellipsisHash, queryProjectLog } from "../../utils"
import { DonateData } from "../../components/DonateModal/const"
import PanelProject from "../Index/components/PanelProject"
import PanelTopDonator from "../Index/components/PanelTopDonator"
import DonateModal from "../../components/DonateModal"

export default function MyDonation() {
  const { contract, signer, account, openNotification } = useOutletContext<LayoutContext>()
  const [donateData, setDonateData] = useState<EventDonateData[]>([])
  const [projectLog, setProjectLog] = useState<ProjectLog | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)

  const handleQueryHash = (hash: string) => {
    if (!!contract) {
      queryProjectLog(contract, hash).then(setProjectLog)
      setDrawerOpen(true)
    }
  }

  useEffect(() => {
    if (!!contract && !!account) {
      const selectorSignature = ethers.id(eventSignature[ContractEvent.Donate])
      const donator = ethers.zeroPadValue(account, 32)

      contract.queryFilter([selectorSignature, null, donator]).then(logs => {
        setDonateData((logs as EventLog[]).map(item => ({
          blockHash: item.blockHash,
          hash: item.args[0],
          donator: item.args[1],
          name: item.args[3],
          amount: item.args[4],
          message: item.args[5],
          donateTime: item.args[6],
        })).reverse())
      })
    }
  }, [contract, account])

  const column: TableProps<EventDonateData>['columns'] = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目哈希',
      dataIndex: 'hash',
      render: value => <Typography.Link copyable={{ text: value }} onClick={() => handleQueryHash(value)}>
        {ellipsisHash(value)}
      </Typography.Link>
    },
    {
      title: '捐赠时间',
      dataIndex: 'donateTime',
      render: value => blockTimeToStr(value)
    },
    {
      title: '捐赠金额',
      dataIndex: 'amount',
      render: value => value.toString()
    },
    {
      title: '留言',
      dataIndex: 'message'
    }
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

  return (
    <>
      <Table
        rowKey="blockHash"
        columns={column}
        dataSource={donateData}
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
    </>
  )
}
