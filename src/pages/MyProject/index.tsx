import { useOutletContext } from "react-router-dom"
import { LayoutContext } from "../const"
import { Result } from "antd"
import { ethers } from "ethers"
import { ContractEvent, eventSignature } from "../Index/const"
import { useEffect } from "react"

export default function MyProject() {
  const { contract, account } = useOutletContext<LayoutContext>()

  useEffect(() => {
    if (!!contract && !!account) {
      contract.queryFilter([ethers.id(eventSignature[ContractEvent.Create]), null, ethers.zeroPadValue(account, 32)]).then(logs => {
        console.log(logs)
      })
    }
  }, [contract, account])

  if (!contract) {
    return <Result status="warning" title="请先连接钱包，并切换到支持的网络" />
  }

  return <>my project</>
}
