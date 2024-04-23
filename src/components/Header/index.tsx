import { Button, Flex, Popover, Select, Typography } from 'antd'
import { GithubOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { ellipsisHash, supportNetworks } from '../../utils'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styles from './index.module.scss'

interface Props {
  chainId?: string
  account?: string
  onNetworkChange: (data: string) => void
  onConnect: () => void
  onCreate: () => void
}

const Index: FC<Props> = ({ chainId, account, onNetworkChange, onConnect, onCreate }) => {
  return (
    <Flex className={styles.headContent} justify="space-between" align="center">
      <Typography.Title className={styles.headTitle} level={4}>Real Donation</Typography.Title>

      <Flex gap="middle" justify="space-between" align="center">
        {!!account && <Button icon={<ThunderboltOutlined />} onClick={onCreate}>创建项目</Button>}

        <Typography.Link href="https://github.com/escX/RealDonation" target="_blank">
          <GithubOutlined style={{ fontSize: 20, color: '#000' }} />
        </Typography.Link>

        {window.ethereum ?
          <>
            <Select
              variant="borderless"
              fieldNames={{ label: 'chainName', value: 'chainId' }}
              options={supportNetworks}
              value={chainId}
              onChange={onNetworkChange}
            />

            {!!account ?
              <Popover content={(
                <Typography.Text title={account} copyable={{ text: account }}>
                  {ellipsisHash(account)}
                </Typography.Text>
              )}>
                <a onClick={e => e.preventDefault()}>
                  <Jazzicon diameter={22} seed={jsNumberForAddress(account)} />
                </a>
              </Popover> :
              <Button onClick={onConnect}>连接MetaMask</Button>
            }
          </> :
          <Typography.Link href="https://home.metamask.io/" target="_blank">安装MetaMask</Typography.Link>
        }
      </Flex>
    </Flex>
  )
}

export default Index
