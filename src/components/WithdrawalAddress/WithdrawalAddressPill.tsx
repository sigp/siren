import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import PillText, { PillTextProps } from '../PillText/PillText'

export interface WithdrawalAddressPillProps
  extends Omit<PillTextProps, 'textPrefix' | 'toolTipText' | 'displayText'> {
  id: string
  address: string
  hasPadding?: boolean
}

const WithdrawalAddressPill: FC<WithdrawalAddressPillProps> = ({
  id,
  address,
  hasPadding,
  ...props
}) => {
  const { t } = useTranslation()
  const formattedFullCredentialAddress = hasPadding ? formatEthAddress(address, 4, 40) : address
  const formattedShortCredentialAddress = formatEthAddress(address, 4, 8)

  return (
    <PillText
      id={id}
      textPrefix={t('credentials')}
      toolTipText={formattedFullCredentialAddress}
      displayText={formattedShortCredentialAddress}
      {...props}
    />
  )
}

export default memo(WithdrawalAddressPill)
