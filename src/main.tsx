import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
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
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          "colorPrimary": "#363636",
          "colorInfo": "#363636",
          "colorSuccess": "#009298",
          "colorWarning": "#d59b00",
          "colorError": "#c50023",
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
