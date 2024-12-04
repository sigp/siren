import { Chain } from 'viem/types/chain'

export interface ChainWithIcon extends Chain {
  iconUrl?: string
  hasIcon?: boolean
}
