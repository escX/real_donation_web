import { FC, useMemo } from 'react'
import { blockTimeToStr, ellipsisHash } from '../../../../utils'
import { Badge, Collapse, Descriptions, DescriptionsProps, Typography } from 'antd'
import { ProjectLog } from '../../const'

interface Props {
  projectLog: ProjectLog | null
}

const Index: FC<Props> = ({ projectLog }) => {
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

  const DescriptionItems = useMemo<DescriptionsProps['items']>(() => {
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
              {ellipsisHash(item.donator)}
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
    })).reverse()

    let totalRecieved = 0
    projectLog.donateList.forEach(item => {
      totalRecieved += Number(item.amount)
    })

    const stateItem = projectLog.ceaseTime ? [{
      label: '终止时间',
      children: blockTimeToStr(projectLog.ceaseTime)
    }] : []

    const modifyDescriptionItem = projectLog.modifyList.length === 0 ? [] : [{
      label: '修改描述',
      span: 2,
      children: <Collapse items={modifyCollapseItems} bordered={false} ghost size="small" />
    }]

    const recievedItem = projectLog.donateList.length === 0 ? [] : [
      {
        label: '受赠金额',
        span: 2,
        children: totalRecieved
      }
    ]

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
          {ellipsisHash(projectLog.hash, 5)}
        </Typography.Text>
      },
      {
        label: '创建人',
        children: <Typography.Text copyable={{ text: projectLog.creator }}>
          {ellipsisHash(projectLog.creator)}
        </Typography.Text>
      },
      {
        label: '创建时间',
        children: blockTimeToStr(projectLog.createTime)
      },
      {
        label: '状态',
        span: projectLog.ceaseTime ? 1 : 2,
        children: projectLog.ceaseTime ? <Badge status="error" text="已终止" /> : <Badge status="success" text="运行中" />
      },
      ...stateItem,
      {
        label: '描述',
        span: 2,
        children: currDescription
      },
      ...modifyDescriptionItem,
      ...recievedItem,
      ...donateItem
    ]
  }, [currDescription, projectLog])

  return (
    <Descriptions
      labelStyle={{ width: '110px' }}
      bordered
      column={2}
      items={DescriptionItems}
    />
  )
}

export default Index
