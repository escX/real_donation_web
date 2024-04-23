import { Divider, Menu, Result, Typography, notification } from 'antd'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Contract, ethers } from 'ethers'
import { supportNetworks, useMetaMask } from '../utils'
import abi from '../abi'
import routes from '../routes'
import Header from '../components/Header'
import styles from './layout.module.scss'
import { NotificationType } from './const'
import CreateModal from '../components/CreateModal'
import { CreateData } from '../components/CreateModal/const'

export default function Index() {
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([])
  const [api, contextHolder] = notification.useNotification()
  const [createOpen, setCreateOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const {
    provider,
    signer,
    chainId,
    account,
    connet,
    changeNetwork,
  } = useMetaMask(supportNetworks)

  const isSupportNetwork = useMemo(() => {
    return chainId && supportNetworks.map(item => item.chainId).includes(chainId)
  }, [chainId])

  const contract = useMemo<Contract | null>(() => {
    const selectedNetwork = supportNetworks.find(item => item.chainId === chainId)
    if (!provider || !selectedNetwork) {
      return null
    }

    return new ethers.Contract(selectedNetwork.deployedAddress, abi, provider)
  }, [provider, chainId])

  useEffect(() => {
    setSelectedMenuKeys([location.pathname])
  }, [location.pathname])

  const handleSelect = ({ key }: { key: string }) => {
    navigate(key)
    setSelectedMenuKeys([key])
  }

  const handleConnet = async () => {
    await connet()
    if (!!chainId) {
      await changeNetwork(chainId)
    }
  }

  const handleSwitchNetwork = async (chainId: string) => {
    await changeNetwork(chainId)
  }

  const handleCreate = async ({ name, description }: CreateData) => {
    try {
      if (!!contract && !!signer) {
        await contract.connect(signer).getFunction('create')(name, description || '')

        openNotification('success', '已创建', '请在“我的项目”中查看')
        setCreateOpen(false)
      }
    } catch (error) {
      const { message: errorMsg } = error as Error
      openNotification('error', '交易失败', errorMsg)
    }
  }

  const openNotification = (type: NotificationType, message: string, description: string) => {
    api[type]({
      message,
      description,
    })
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Header
          chainId={chainId}
          account={account}
          onNetworkChange={handleSwitchNetwork}
          onConnect={handleConnet}
          onCreate={() => setCreateOpen(true)}
        />

        <Divider className={styles.divider} />
      </div>

      <div className={styles.main}>
        <div className={styles.sider}>
          <Menu
            onSelect={handleSelect}
            selectedKeys={selectedMenuKeys}
            mode="vertical"
            items={routes.map(route => ({
              key: route.path,
              icon: route.icon,
              label: route.name,
            }))}
          />
        </div>

        <div className={styles.content}>
          {isSupportNetwork ?
            <Suspense>
              <Outlet context={{
                provider,
                signer,
                account,
                contract,
                openNotification
              }} />
            </Suspense> :
            <Result status="warning" title="当前网络不支持" />
          }
        </div>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.footer}>
        <Typography.Text>
          Copyright&nbsp;&copy;&nbsp;{new Date().getFullYear()}&nbsp;
        </Typography.Text>
        <Typography.Link href="https://github.com/escX" target="_blank">
          escx
        </Typography.Link>
        <Typography.Text>
          .&nbsp;All Rights Reserved.
        </Typography.Text>
      </div>

      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {contextHolder}
    </div>
  )
}
