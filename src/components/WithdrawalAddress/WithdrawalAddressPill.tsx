import {FC, memo} from "react";
import {useTranslation} from "react-i18next";
import formatEthAddress from "../../../utilities/formatEthAddress";
import PillText, {PillTextProps} from "../PillText/PillText";

export interface WithdrawalAddressPillProps extends Omit<PillTextProps, 'textPrefix' | 'toolTipText' | 'displayText'> {
  id: string
  address: string
}

const WithdrawalAddressPill:FC<WithdrawalAddressPillProps> = ({id, address, ...props}) => {
  const {t} = useTranslation()
  const formattedFullCredentialAddress = formatEthAddress(address, 4, 40)
  const formattedShortCredentialAddress = formatEthAddress(address, 4, 8)

  return (
    <PillText id={id} textPrefix={t('credentials')} toolTipText={formattedFullCredentialAddress} displayText={formattedShortCredentialAddress} {...props} />
  )
}

export default memo(WithdrawalAddressPill)