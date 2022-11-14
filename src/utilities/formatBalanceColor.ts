import { TypographyColor } from '../components/Typography/Typography';

const formatBalanceColor = (amount: number) : TypographyColor => {
  return amount > 0 ? 'text-success' : 'text-error'
}

export default formatBalanceColor;