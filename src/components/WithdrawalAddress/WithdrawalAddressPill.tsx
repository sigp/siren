import { FC, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import copyToClipboard from '../../../utilities/copyToClipboard'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { PillTextProps } from '../PillText/PillText'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

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
  className,
  containerClassName,
  ...props
}) => {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState(false)
  const fullAddress = address
  const formattedShortCredentialAddress = formatEthAddress(address, 4, 8)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const success = await copyToClipboard(fullAddress)
      if (success) {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const content = (
    <div
      className={`py-1 px-2 rounded flex items-center space-x-2 bg-dark100 dark:bg-dark700 ${containerClassName || ''}`}
    >
      <Typography type='text-caption1.5'>{t('credentials')}:</Typography>
      <Typography type='text-caption1.5'>{formattedShortCredentialAddress}</Typography>
      <i
        className='bi bi-subtract text-caption1 text-dark400 hover:scale-90 cursor-pointer ml-1'
        onClick={handleCopy}
        title='Copy to clipboard'
      />
    </div>
  )

  return (
    <Tooltip
      className={className}
      place='top-start'
      style={{ fontSize: '11px' }}
      id={id}
      positionStrategy='fixed'
      text={isCopied ? t('copied') : fullAddress}
    >
      {content}
    </Tooltip>
  )
}

export default memo(WithdrawalAddressPill)
