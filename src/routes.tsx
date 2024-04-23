import React from 'react'
import { HeartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'

const Index = React.lazy(() => import('./pages/Index'))
const MyProject = React.lazy(() => import('./pages/MyProject'))
const MyDonation = React.lazy(() => import('./pages/MyDonation'))

export default [
  {
    path: '/',
    element: <Index />,
    name: '首页',
    icon: <FireOutlined />
  },
  {
    path: '/my_project',
    element: <MyProject />,
    name: '我的项目',
    icon: <StarOutlined />
  },
  {
    path: '/my_donation',
    element: <MyDonation />,
    name: '我的捐赠',
    icon: <HeartOutlined />
  },
]
