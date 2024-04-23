import { Contract, EventLog } from 'ethers'
import { Table, TableProps, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { blockTimeToStr, ellipsisHash } from '../../../../utils'
import { EventCeaseData } from './const'
import { reloadDelay } from '../../const'

interface Props {
  contract: Contract | null
  onQueryHash: (data: string) => void
}

const Index: FC<Props> = ({ contract, onQueryHash }) => {
  const [sourceData, setSourceData] = useState<EventCeaseData[]>([])

  useEffect(() => {
    if (!!contract) {
      loadData(contract)
    }
  }, [contract])

  const loadData = async (contract: Contract) => {
    try {
      const log = await contract.queryFilter('Cease') as EventLog[]
      setSourceData(log.map((item: EventLog) => ({
        blockHash: item.blockHash,
        hash: item.args[0],
        name: item.args[1],
        ceaseTime: item.args[2],
      })).reverse())
    } catch (error) { }

    setTimeout(() => {
      loadData(contract)
    }, reloadDelay)
  }

  const column: TableProps<EventCeaseData>['columns'] = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目哈希',
      dataIndex: 'hash',
      render: value => <Typography.Link copyable={{ text: value }} onClick={() => onQueryHash(value)}>
        {ellipsisHash(value, 5)}
      </Typography.Link>
    },
    {
      title: '区块哈希',
      dataIndex: 'blockHash',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {ellipsisHash(value, 5)}
      </Typography.Paragraph>
    },
    {
      title: '终止时间',
      dataIndex: 'ceaseTime',
      render: value => blockTimeToStr(value)
    },
  ]

  return (
    <Table
      rowKey="blockHash"
      columns={column}
      dataSource={sourceData}
      pagination={{
        total: sourceData.length
      }}
    />
  )
}

export default Index
