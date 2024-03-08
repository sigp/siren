import { TypographyColor } from '../src/components/Typography/Typography'

const formatBalanceColor = (amount?: number): TypographyColor => {
  return amount === 0 || !amount ? 'text-dark500' : amount > 0 ? 'text-success' : 'text-error'
}

export default formatBalanceColor
