import { FC, useMemo } from 'react'
import { ProjectLog } from '../../const'
import { Table, Typography } from 'antd'
import { ellipsisHash } from '../../../../utils'

interface Props {
  donateList: ProjectLog['donateList']
}

const Index: FC<Props> = ({ donateList }) => {
  const donatorSorted = useMemo(() => {
    const donatorToAmount: Record<string, bigint> = {}

    donateList.forEach(item => {
      if (donatorToAmount[item.donator] === undefined) {
        donatorToAmount[item.donator] = item.amount
      } else {
        donatorToAmount[item.donator] += item.amount
      }
    })

    const donatorList = Object.keys(donatorToAmount).map(item => ({
      donator: item,
      amount: Number(donatorToAmount[item])
    }))

    return donatorList.sort((a, b) => b.amount - a.amount)
  }, [donateList])

  const column = [
    {
      title: '捐赠人',
      dataIndex: 'donator',
      render: (value: string) => <Typography.Text copyable={{ text: value }}>
        {ellipsisHash(value)}
      </Typography.Text>
    },
    {
      title: '捐赠总额',
      dataIndex: 'amount'
    }
  ]

  return (
    <>
      <Typography.Title level={5}>捐赠金额 Top5</Typography.Title>

      <Table
        rowKey="donator"
        pagination={false}
        columns={column}
        dataSource={donatorSorted.slice(0, 5)}
      />
    </>
  )
}

export default Index
