import { Form, Input, InputNumber, Modal, Select } from "antd"
import { FC, useState } from "react"
import { DonateData, Unit, unitOptions } from "./const"
import { parseUnits } from "ethers"

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: DonateData) => Promise<void>
}

const Index: FC<Props> = ({open, onClose, onSubmit}) => {
  const [formRef] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [uint, setUint] = useState(Unit.Wei)

  const handleSubmit = async () => {
    try {
      const values = await formRef.validateFields()
      setConfirmLoading(true)
      await onSubmit({
        ...values,
        value: parseUnits(values.value.toString(), uint)
      })
      setConfirmLoading(false)
    } catch(error) {
      setConfirmLoading(false)
      console.error(error)
    }
  }

  return <Modal
    title="捐赠"
    destroyOnClose
    maskClosable={false}
    open={open}
    confirmLoading={confirmLoading}
    onCancel={onClose}
    onOk={handleSubmit}
  >
    <Form form={formRef} labelCol={{ span: 4 }} preserve={false}>
      <Form.Item
        label="捐赠金额"
        name="value"
        validateFirst
        rules={[
          { required: true, message: '捐赠金额不能为空！'}
        ]}
      >
        <InputNumber
          min={1}
          step={1}
          addonAfter={
            <Select options={unitOptions} value={uint} onChange={setUint} style={{width: 90}} />
          }
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="留言"
        name="message"
        validateFirst
        rules={[
          {
            validator(_, value) {
              const bytes = new TextEncoder().encode(value)
              if (bytes.length > 256) {
                return Promise.reject(new Error('留言超过允许的长度！'))
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
