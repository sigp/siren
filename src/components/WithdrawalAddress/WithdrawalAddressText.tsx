import {CSSProperties, FC} from 'react'
import formatEthAddress from '../../../utilities/formatEthAddress'
import Tooltip from '../ToolTip/Tooltip'
import Typography, { TypographyProps } from '../Typography/Typography'

export interface WithdrawalAddressTextProps extends Omit<TypographyProps, 'children'> {
  withdrawalAddress: string | undefined
  id: string
  tooltipClasses?: string
  style?: CSSProperties
}

const WithdrawalAddressText: FC<WithdrawalAddressTextProps> = ({
  withdrawalAddress,
  tooltipClasses,
  id,
  style,
  ...props
}) => {
  return withdrawalAddress ? (
    <Tooltip
      className={tooltipClasses}
      positionStrategy='fixed'
      place='top-start'
      id={`${id}-withdrawalCreds`}
      style={style}
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
