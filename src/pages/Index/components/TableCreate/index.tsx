import { Contract, EventLog } from 'ethers'
import { Table, TableProps, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { blockTimeToStr, ellipsisHash } from '../../../../utils'
import { EventCreateData } from './const'
import { reloadDelay } from '../../const'

interface Props {
  contract: Contract | null
  onQueryHash: (data: string) => void
}

const Index: FC<Props> = ({ contract, onQueryHash }) => {
  const [sourceData, setSourceData] = useState<EventCreateData[]>([])

  useEffect(() => {
    if (!!contract) {
      loadData(contract)
    }
  }, [contract])

  const loadData = async (contract: Contract) => {
    try {
      const logs = await contract.queryFilter('Create') as EventLog[]
      setSourceData(logs.map(item => ({
        blockHash: item.blockHash,
        hash: item.args[0],
        creator: item.args[1],
        name: item.args[2],
        description: item.args[3],
        createTime: item.args[4],
      })).reverse())
    } catch (error) { }

    setTimeout(() => {
      loadData(contract)
    }, reloadDelay)
  }

  const column: TableProps<EventCreateData>['columns'] = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目哈希',
      dataIndex: 'hash',
      render: value => <Typography.Link copyable={{ text: value }} onClick={() => onQueryHash(value)}>
        {ellipsisHash(value)}
      </Typography.Link>
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {ellipsisHash(value)}
      </Typography.Paragraph>
    },
    {
      title: '区块哈希',
      dataIndex: 'blockHash',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {ellipsisHash(value)}
      </Typography.Paragraph>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: value => blockTimeToStr(value)
    },
  ]

  return (
    <Table
      rowKey="blockHash"
      columns={column}
      dataSource={sourceData}
      pagination={false}
    />
  )
}

export default Index
