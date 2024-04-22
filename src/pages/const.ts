import { BrowserProvider, Contract } from 'ethers'

export interface LayoutContext {
  provider: BrowserProvider | null
  contract: Contract | null
  openNotification: (type: NotificationType, message: string, description: string) => void
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error'
