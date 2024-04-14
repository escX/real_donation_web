import React from 'react'
import { ThunderboltOutlined, HeartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'

const Index = React.lazy(() => import('./pages/Index'))
const CreateProject = React.lazy(() => import('./pages/CreateProject'))
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
    path: '/create_project',
    element: <CreateProject />,
    name: '创建项目',
    icon: <ThunderboltOutlined />
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
