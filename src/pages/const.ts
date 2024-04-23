import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers'

export interface LayoutContext {
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  account: string | undefined
  contract: Contract | null
  openNotification: (type: NotificationType, message: string, description: string) => void
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error'
