import { Divider, Menu, Typography } from 'antd'
import { useEffect, useState } from 'react'
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
          <Outlet />
        </div>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.footer}>
        Copyright © {new Date().getFullYear()} escx
      </div>
    </div>
  )
}
