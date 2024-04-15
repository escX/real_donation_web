import { Button, Flex, Select, Space, Typography } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { FC, useMemo } from 'react'
import { omitHash, supportNetworks } from '../../utils'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styles from './index.module.scss'

interface Props {
  chainId: string
  accounts: string[]
  onNetworkChange: (data: string) => void
  onConnect: () => void
}

const Index: FC<Props> = ({ chainId, accounts, onNetworkChange, onConnect }) => {
  const isSupportNetwork = useMemo(() => {
    return supportNetworks.map(item => item.chainId).includes(chainId)
  }, [chainId])

  return (
    <Flex className={styles.headContent} justify="space-between" align="center">
      <Typography.Title className={styles.headTitle} level={4}>Real Donation</Typography.Title>

      <Flex gap="middle" justify="space-between" align="center">
        <Typography.Link href="https://github.com/escX/RealDonation" target="_blank">
          <GithubOutlined style={{ fontSize: 20, color: '#000' }} />
        </Typography.Link>

        {window.ethereum ?
          <>
            <Select
              variant="borderless"
              fieldNames={{ label: 'chainName', value: 'chainId' }}
              options={supportNetworks}
              value={isSupportNetwork ? chainId : supportNetworks[0].chainId}
              onChange={onNetworkChange}
            />

            {accounts.length === 0 ?
              <Button onClick={onConnect}>连接MetaMask</Button> :
              <Space>
                <Jazzicon diameter={20} seed={jsNumberForAddress(accounts[0])} />
                <Typography.Text title={accounts[0]} copyable={{ text: accounts[0] }}>
                  {omitHash(accounts[0])}
                </Typography.Text>
              </Space>
            }
          </> :
          <Typography.Link href="https://home.metamask.io/" target="_blank">安装MetaMask</Typography.Link>
        }
      </Flex>
    </Flex>
  )
}

export default Index
