import { Divider, Menu, Typography } from 'antd'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './layout.module.scss'
import routes from '../routes'

export default function Index() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location.pathname])

  const handleSelect = ({ key }: { key: string }) => {
    navigate(key)
    setSelectedKeys([key])
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Typography.Title className={styles.title} level={4}>Real Donation</Typography.Title>
        {/* todo: 连接账户、github、部署地址 */}
        <Divider className={styles.divider} />
      </div>

      <div className={styles.main}>
        <div className={styles.sider}>
          <Menu
            onSelect={handleSelect}
            selectedKeys={selectedKeys}
            mode="vertical"
            items={routes.map(route => ({
              key: route.path,
              icon: route.icon,
              label: route.name,
            }))}
          />
        </div>

        <div className={styles.content}>
          <Suspense>
            <Outlet />
          </Suspense>
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
    </div>
  )
}
