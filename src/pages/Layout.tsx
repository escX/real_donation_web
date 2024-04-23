import { Divider, Menu, Result, Typography, notification } from 'antd'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BrowserProvider, Contract, ethers } from 'ethers'
import { supportNetworks } from '../utils'
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

  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const [chainId, setChainId] = useState<string>(supportNetworks[0].chainId)
  const [accounts, setAccounts] = useState<string[]>([])

  const isSupportNetwork = useMemo(() => {
    return supportNetworks.map(item => item.chainId).includes(chainId)
  }, [chainId])

  useEffect(() => {
    setSelectedMenuKeys([location.pathname])
  }, [location.pathname])

  const handleSelect = ({ key }: { key: string }) => {
    navigate(key)
    setSelectedMenuKeys([key])
  }

  useEffect(() => {
    if (!!window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccounts(accounts)
      })

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId)
      })
    }
  }, [])

  useEffect(() => {
    if (!!provider) {
      provider.send('eth_chainId', []).then(chainId => {
        setChainId(chainId)
      })

      provider.send('eth_accounts', []).then(accounts => {
        setAccounts(accounts)
      })
    }
  }, [provider])

  useEffect(() => {
    if (!!provider && !!chainId) {
      const selectedNetwork = supportNetworks.find(item => item.chainId === chainId)
      const deployedAddress = !!selectedNetwork ? selectedNetwork.deployedAddress : supportNetworks[0].deployedAddress
      const contract = new ethers.Contract(deployedAddress, abi, provider)
      setContract(contract)
    }
  }, [provider, chainId])

  const handleConnet = async () => {
    if (!!provider) {
      await provider.send('eth_requestAccounts', [])
      handleSwitchNetwork(chainId)
    }
  }

  const handleCreate = async ({name, description}: CreateData) => {
    try {
      const signer = await provider?.getSigner()!
      await contract?.connect(signer).getFunction('create')(name, description || '')

      openNotification('success', '已捐赠', '感谢您的支持！')
      setCreateOpen(false)
    } catch(error) {
      const { message: errorMsg } = error as Error
      openNotification('error', '交易失败', errorMsg)
    }
  }

  const handleSwitchNetwork = async (chainId: string) => {
    if (!!provider) {
      await provider.send('wallet_switchEthereumChain', [{ chainId }])
    }
  }

  const openNotification = (type: NotificationType, message: string, description: string) => {
    api[type]({
      message,
      description,
    });
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Header
          chainId={chainId}
          accounts={accounts}
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
