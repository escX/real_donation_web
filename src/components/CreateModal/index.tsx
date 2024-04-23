import { Form, Input, Modal } from "antd"
import { FC, useState } from "react"
import { CreateData } from "./const"

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateData) => Promise<void>
}

const Index: FC<Props> = ({open, onClose, onSubmit}) => {
  const [formRef] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      const values = await formRef.validateFields()
      setConfirmLoading(true)
      await onSubmit(values)
      setConfirmLoading(false)
    } catch(error) {
      setConfirmLoading(false)
      console.error(error)
    }
  }

  return <Modal
    title="创建项目"
    destroyOnClose
    maskClosable={false}
    open={open}
    confirmLoading={confirmLoading}
    onCancel={onClose}
    onOk={handleSubmit}
  >
    <Form form={formRef} labelCol={{ span: 4 }} preserve={false}>
      <Form.Item
        label="项目名称"
        name="name"
        rules={[
          { required: true, message: '项目名称不能为空！'},
          {
            validator(_, value) {
              const bytes = new TextEncoder().encode(value)
              if (bytes.length > 64 || bytes.length < 1) {
                return Promise.reject(new Error('项目名称超过允许的长度！'))
              }

              return Promise.resolve()
            },
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="描述"
        name="description"
        rules={[
          {
            validator(_, value) {
              const bytes = new TextEncoder().encode(value)
              if (bytes.length > 1024) {
                return Promise.reject(new Error('描述超过允许的长度！'))
              }

              return Promise.resolve()
            },
          }
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  </Modal>
}

export default Index
