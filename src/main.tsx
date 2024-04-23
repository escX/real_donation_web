import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import ErrorPage from './error-page'
import Layout from './pages/Layout'
import routes from './routes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: routes,
  },
])

ReactDOM.createRoot(document.getElementById('app')!).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      "token": {
        "colorPrimary": "#000000",
        "colorInfo": "#000000",
        "colorSuccess": "#009298",
        "colorWarning": "#d59b00",
        "colorError": "#c50023",
      },
      components: {
        "Menu": {
          "itemSelectedColor": "rgb(255, 255, 255)"
        },
        "Select": {
          "optionSelectedColor": "rgb(255, 255, 255)"
        },
        "Typography": {
          "colorLinkActive": "rgb(0, 107, 115)",
          "colorLinkHover": "rgb(27, 166, 166)",
          "colorLink": "rgb(0, 146, 152)"
        },
        "Button": {
          "colorLink": "rgb(0, 146, 152)",
          "colorLinkActive": "rgb(0, 107, 115)",
          "colorLinkHover": "rgb(27, 166, 166)",
          "defaultGhostBorderColor": "rgba(0, 0, 0, 0.88)",
          "defaultGhostColor": "rgba(0, 0, 0, 0.88)"
        }
      }
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
)
