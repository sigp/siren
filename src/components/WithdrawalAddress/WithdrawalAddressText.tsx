import { FC } from 'react'
import formatEthAddress from '../../../utilities/formatEthAddress'
import Tooltip from '../ToolTip/Tooltip'
import Typography, { TypographyProps } from '../Typography/Typography'

export interface WithdrawalAddressTextProps extends Omit<TypographyProps, 'children'> {
  withdrawalAddress: string | undefined
  id: string
  tooltipClasses?: string
}

const WithdrawalAddressText: FC<WithdrawalAddressTextProps> = ({
  withdrawalAddress,
  tooltipClasses,
  id,
  ...props
}) => {
  return withdrawalAddress ? (
    <Tooltip
      className={tooltipClasses}
      positionStrategy='fixed'
      place='top-start'
      id={`${id}-withdrawalCreds`}
      text={formatEthAddress(withdrawalAddress, 4, 40)}
    >
      <Typography {...props}>{formatEthAddress(withdrawalAddress, 4, 6)}</Typography>
    </Tooltip>
  ) : (
    <Typography color='text-dark500' type='text-caption1'>
      --
    </Typography>
  )
}

export default WithdrawalAddressText
