import { Button, Result, Typography } from 'antd'
import { useNavigate, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  const error: any = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <Result
        status="error"
        title="Oops!"
        subTitle="Sorry, an unexpected error has occurred."
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/')}>
            Back Home
          </Button>
        ]}
      >
        <Typography.Paragraph>
          <Typography.Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            <i>{error.statusText || error.message}</i>
          </Typography.Text>
        </Typography.Paragraph>
      </Result>
    </div>
  )
}
