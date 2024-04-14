import { Contract, EventLog } from 'ethers'
import { Table, TableProps, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { blockTimeToStr, omitHash } from '../../../../utils'
import { EventModifyDescriptionData } from './const'

interface Props {
  blockNumber: number
  contract: Contract | null
  onQueryHash: (data: string) => void
}

const Index: FC<Props> = ({ blockNumber, contract, onQueryHash }) => {
  const [sourceData, setSourceData] = useState<EventModifyDescriptionData[]>([])

  useEffect(() => {
    if (!!contract && !!blockNumber) {
      loadData(contract)
    }
  }, [contract, blockNumber])

  const loadData = async (contract: Contract) => {
    contract.queryFilter('ModifyDescription').then((data: any) => {
      setSourceData(data.map((item: EventLog) => ({
        blockHash: item.blockHash,
        hash: item.args[0],
        name: item.args[1],
        description: item.args[2],
        modifyTime: item.args[3],
      })).reverse())
    })
  }

  const column: TableProps<EventModifyDescriptionData>['columns'] = [
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
      title: '修改描述',
      dataIndex: 'description'
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
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
