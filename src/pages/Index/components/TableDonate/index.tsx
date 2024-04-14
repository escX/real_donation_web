import { Contract, EventLog } from 'ethers'
import { Table, TableProps, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { blockTimeToStr, omitHash } from '../../../../utils'
import { EventDonateData } from './const'

interface Props {
  blockNumber: number
  contract: Contract | null
  onQueryHash: (data: string) => void
}

const Index: FC<Props> = ({ blockNumber, contract, onQueryHash }) => {
  const [sourceData, setSourceData] = useState<EventDonateData[]>([])

  useEffect(() => {
    if (!!contract && !!blockNumber) {
      loadData(contract)
    }
  }, [contract, blockNumber])

  const loadData = async (contract: Contract) => {
    contract.queryFilter('Donate').then((data: any) => {
      setSourceData(data.map((item: EventLog) => ({
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

  const column: TableProps<EventDonateData>['columns'] = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目哈希',
      dataIndex: 'hash',
      render: value => <Typography.Link copyable={{ text: value }} onClick={() => onQueryHash(value)}>
        {omitHash(value)}
      </Typography.Link>
    },
    {
      title: '区块哈希',
      dataIndex: 'blockHash',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {omitHash(value)}
      </Typography.Paragraph>
    },
    {
      title: '捐赠人',
      dataIndex: 'donator',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {omitHash(value)}
      </Typography.Paragraph>
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
