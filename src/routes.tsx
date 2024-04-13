import Index from './pages/Index'
import CreateProject from './pages/CreateProject'
import MyProject from './pages/MyProject'
import MyDonation from './pages/MyDonation'
import { ThunderboltOutlined, HeartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'

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
