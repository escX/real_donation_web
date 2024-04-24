import { Form, Input, Modal } from "antd"
import { FC, useEffect, useState } from "react"

interface Props {
  description?: string
  open: boolean
  onClose: () => void
  onSubmit: (description?: string) => Promise<void>
}

const Index: FC<Props> = ({description, open, onClose, onSubmit}) => {
  const [formRef] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    open && formRef.setFieldsValue({ description })
  }, [open, description])

  const handleSubmit = async () => {
    try {
      const values = await formRef.validateFields()
      setConfirmLoading(true)
      await onSubmit(values.description)
      setConfirmLoading(false)
    } catch(error) {
      setConfirmLoading(false)
      console.error(error)
    }
  }

  return <Modal
    title="修改项目描述"
    destroyOnClose
    maskClosable={false}
    open={open}
    confirmLoading={confirmLoading}
    onCancel={onClose}
    onOk={handleSubmit}
  >
    <Form form={formRef} labelCol={{ span: 4 }} preserve={false}>
      <Form.Item
        label="描述"
        name="description"
        validateFirst
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
