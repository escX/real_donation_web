import { Contract } from 'ethers'
import { FC, useEffect, useMemo, useState } from 'react'
import { blockTimeToStr, omitHash, queryProjectLog } from '../../../../utils'
import { ProjectLog } from './const'
import { Badge, Collapse, Descriptions, DescriptionsProps, Typography } from 'antd'

interface Props {
  contract: Contract
  hash: string
}

const Index: FC<Props> = ({ contract, hash }) => {
  const [projectLog, setProjectLog] = useState<ProjectLog | null>(null)
  const currDescription = useMemo(() => {
    if (!projectLog) {
      return null
    }

    const modifyList = projectLog.modifyList
    if (modifyList.length === 0) {
      return projectLog.description
    }

    return modifyList[modifyList.length - 1].description
  }, [projectLog])

  const items = useMemo<DescriptionsProps['items']>(() => {
    if (!projectLog) {
      return []
    }

    const modifyCollapseItems = [
      ...projectLog.modifyList.map((item, index) => ({
        key: index,
        label: blockTimeToStr(item.modifyTime),
        children: `修改：${item.description}`
      })).reverse(),
      {
        key: -1,
        label: blockTimeToStr(projectLog.createTime),
        children: `初始：${projectLog.description}`
      }
    ]

    const donateCollapseItems = projectLog.donateList.map((item, index) => ({
      key: index,
      label: blockTimeToStr(item.donateTime),
      children: <Descriptions
        labelStyle={{ width: '90px' }}
        size="small"
        bordered
        column={2}
        items={[
          {
            label: '捐赠人',
            children: <Typography.Text copyable={{ text: item.donator }}>
              {omitHash(item.donator)}
            </Typography.Text>,
          },
          {
            label: '捐赠金额',
            children: item.amount.toString(),
          },
          {
            label: '留言',
            span: 2,
            children: item.message,
          },
        ]}
      />
    }))

    const stateItem = projectLog.ceaseTime ? [{
      label: '终止时间',
      children: blockTimeToStr(projectLog.ceaseTime)
    }] : []

    const modifyDescriptionItem = projectLog.modifyList.length === 0 ? [] : [{
      label: '修改描述',
      span: 2,
      children: <Collapse items={modifyCollapseItems} bordered={false} ghost size="small" />
    }]

    const donateItem = projectLog.donateList.length === 0 ? [] : [{
      label: '捐赠',
      span: 2,
      children: <Collapse items={donateCollapseItems} bordered={false} ghost size="small" />
    }]

    return [
      {
        label: '项目名称',
        children: projectLog.name
      },
      {
        label: '项目哈希',
        children: <Typography.Text copyable={{ text: projectLog.hash }}>
          {omitHash(projectLog.hash)}
        </Typography.Text>
      },
      {
        label: '创建者',
        children: <Typography.Text copyable={{ text: projectLog.creator }}>
          {omitHash(projectLog.creator)}
        </Typography.Text>
      },
      {
        label: '描述',
        children: currDescription
      },
      {
        label: '创建时间',
        children: blockTimeToStr(projectLog.createTime)
      },
      ...stateItem,
      {
        label: '状态',
        span: projectLog.ceaseTime ? 2 : 1,
        children: projectLog.ceaseTime ? <Badge status="error" text="已终止" /> : <Badge status="success" text="运行中" />
      },
      ...modifyDescriptionItem,
      ...donateItem
    ]
  }, [currDescription, projectLog])

  useEffect(() => {
    if (!!contract) {
      queryProjectLog(contract, hash).then(setProjectLog)
    }
  }, [contract, hash])

  return (
    <Descriptions
      title="项目详情"
      labelStyle={{ width: '110px' }}
      bordered
      column={2}
      items={items}
    />
  )
}

export default Index