import { BrowserProvider, Contract } from 'ethers'

export interface LayoutContext {
  provider: BrowserProvider | null
  contract: Contract | null
}
