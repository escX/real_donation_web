import { Contract, EventLog } from 'ethers'
import { Table, TableProps, Typography } from 'antd'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { EventCreateData, TableRefData } from '../../const'
import { blockTimeToStr, omitHash } from '../../../../utils'

interface Props {
  contract: Contract | null
  onQueryHash: (data: string) => void
}

const Index = ({ contract, onQueryHash }: Props, ref: ForwardedRef<TableRefData>) => {
  const [sourceData, setSourceData] = useState<EventCreateData[]>([])

  useEffect(() => {
    if (!!contract) {
      loadData(contract)
    }
  }, [contract])

  useImperativeHandle(ref, () => ({
    reload: loadData
  }), [contract])

  const loadData = async (contract: Contract) => {
    contract.queryFilter('Create').then((data: any) => {
      setSourceData(data.map((item: EventLog) => ({
        blockHash: item.blockHash,
        hash: item.args[0],
        creator: item.args[1],
        name: item.args[2],
        createTime: item.args[4],
      })).reverse())
    })
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
        {omitHash(value)}
      </Typography.Link>
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {omitHash(value)}
      </Typography.Paragraph>
    },
    {
      title: '区块哈希',
      dataIndex: 'blockHash',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {omitHash(value)}
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
      rowKey="hash"
      columns={column}
      dataSource={sourceData}
      pagination={{
        total: sourceData.length
      }}
    />
  )
}

export default forwardRef(Index)
