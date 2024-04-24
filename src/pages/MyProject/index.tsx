import { useOutletContext } from "react-router-dom"
import { LayoutContext } from "../const"
import { Badge, Collapse, Descriptions, Flex, Modal, Space, Table, TableProps, Typography } from "antd"
import { ExclamationCircleFilled } from "@ant-design/icons"
import { Contract, EventLog, ethers } from "ethers"
import { ContractEvent, ProjectLog, eventSignature } from "../Index/const"
import { useEffect, useMemo, useState } from "react"
import { EventCreateData } from "../Index/components/TableCreate/const"
import { blockTimeToStr, ellipsisHash, queryProjectLog } from "../../utils"
import ModifyModal from "./ModifyModal"
import PanelTopDonator from "../Index/components/PanelTopDonator"

export default function MyProject() {
  const { contract, signer, account, openNotification } = useOutletContext<LayoutContext>()
  const [modal, contextHolder] = Modal.useModal()
  const [projectList, setProjectList] = useState<EventCreateData[]>([])
  const [projectLog, setProjectLog] = useState<ProjectLog[]>([])
  const [modifyOpen, setModifyOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState<string>()

  const loadLogData = async (contract: Contract, hashList: string[]) => {
    const methods = hashList.map(hash => queryProjectLog(contract, hash))
    const result = await Promise.all(methods)
    setProjectLog(result)
  }

  const projectData = useMemo(() => {
    if (projectList.length === 0 || projectLog.length === 0) {
      return []
    }

    return projectList.map(item => {
      const log = projectLog.find(log => log.hash === item.hash)
      if (!log) {
        return item
      }

      const modifyList = log.modifyList ?? []
      let description = item.description

      if (modifyList.length > 0) {
        description = modifyList[modifyList.length - 1].description
      }

      return {
        ...log,
        description,
      }
    })
  }, [projectList, projectLog])

  useEffect(() => {
    if (!!contract && !!account) {
      const selectorSignature = ethers.id(eventSignature[ContractEvent.Create])
      const creator = ethers.zeroPadValue(account, 32)

      contract.queryFilter([selectorSignature, null, creator]).then(logs => {
        setProjectList((logs as EventLog[]).map(item => ({
          blockHash: item.blockHash,
          hash: item.args[0],
          creator: item.args[1],
          name: item.args[2],
          description: item.args[3],
          createTime: item.args[4],
        })).reverse())

        const hashList = logs.map(item => (item as EventLog).args[0])
        loadLogData(contract, hashList)
      })
    }
  }, [contract, account])

  const columns: TableProps<any>['columns'] = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目哈希',
      dataIndex: 'hash',
      render: value => <Typography.Paragraph copyable={{ text: value }} style={{ margin: 0 }}>
        {ellipsisHash(value)}
      </Typography.Paragraph>
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '受赠金额',
      dataIndex: 'donateList',
      render: value => value.map((item: any) => item.amount).reduce((prev: bigint, curr: bigint) => Number(prev + curr))
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: value => blockTimeToStr(value)
    },
    {
      title: '状态',
      render: (_, record) => !!record.ceaseTime ? <Badge status="error" text="已终止" /> : <Badge status="success" text="运行中" />
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Typography.Link onClick={() => {
            setCurrentHash(record.hash)
            setModifyOpen(true)
          }} disabled={!!record.ceaseTime}>修改描述</Typography.Link>
          <Typography.Link onClick={() => handleCease(record.hash)} disabled={!!record.ceaseTime}>终止项目</Typography.Link>
        </Space>
      )
    }
  ]

  const handleModify = async (description?: string) => {
    try {
      if (!!contract && !!signer) {
        const tx = await contract.connect(signer).getFunction('modifyDescription')(currentHash, description ?? '')

        openNotification('success', '已修改描述', '')
        setModifyOpen(false)

        await tx.wait()
        loadLogData(contract, projectList.map(item => item.hash))
      }
    } catch (error) {
      const { message: errorMsg } = error as Error
      openNotification('error', '交易失败', errorMsg)
    }
  }

  const handleCease = (hash: string) => {
    modal.confirm({
      title: '终止项目',
      icon: <ExclamationCircleFilled />,
      content: '项目终止后将无法接受捐赠，确定终止？',
      okText: '终止',
      okType: 'danger',
      cancelText: '取消',
      onOk: async() => {
        try {
          if (!!contract && !!signer) {
            const tx = await contract.connect(signer).getFunction('cease')(hash)

            openNotification('success', '已终止项目', '')

            await tx.wait()
            loadLogData(contract, projectList.map(item => item.hash))
          }
        } catch (error) {
          const { message: errorMsg } = error as Error
          openNotification('error', '交易失败', errorMsg)
        }
      },
    })
  }

  return (
    <>
      <Table
        rowKey="hash"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            const donateCollapseItems = record.donateList.map((item: any, index: number) => ({
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

            return (
              <Flex gap="large" justify="space-between">
                <div style={{width: '50%', marginTop: '-25px'}}>
                  <Typography.Title level={5}>捐赠历史</Typography.Title>
                  <Collapse items={donateCollapseItems} bordered={false} ghost size="small" />
                </div>
                <div style={{width: '50%', marginTop: '-25px'}}>
                  <PanelTopDonator donateList={record.donateList} />
                </div>
              </Flex>
            )
          }
        }}
        dataSource={projectData}
      />

      <ModifyModal
        description={projectData.find(item => item.hash === currentHash)?.description}
        open={modifyOpen}
        onClose={() => setModifyOpen(false)}
        onSubmit={handleModify}
      />

      {contextHolder}
    </>
  )
}
