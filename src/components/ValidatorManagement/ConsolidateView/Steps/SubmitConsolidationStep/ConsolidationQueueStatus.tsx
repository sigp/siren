import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'

export interface ConsolidationQueueStatusProps {
  queueLength?: BigInt | undefined
  className?: string
}

const ConsolidationQueueStatus: FC<ConsolidationQueueStatusProps> = ({
  queueLength,
  className,
}) => {
  const { t } = useTranslation()
  const classes = addClassString('w-full', [className])

  const getText = (queue: BigInt) => {
    const baseLocale = 'validatorManagement.consolidateView.signAndSubmit'
    const length = Number(queue)
    switch (true) {
      case length > 50:
        return t(`${baseLocale}.highFees`)
      case length > 10 && length < 50:
        return t(`${baseLocale}.mediumFees`)
      default:
        return t(`${baseLocale}.lowFees`)
    }
  }

  const getStatus = (queue: BigInt) => {
    const length = Number(queue)
    switch (true) {
      case length > 50:
        return InfoBoxType.ERROR
      case length > 10 && length < 50:
        return InfoBoxType.WARNING
      default:
        return InfoBoxType.NOTICE
    }
  }

  const statusWarning = useMemo<{ text: string; type: InfoBoxType } | undefined>(() => {
    if (!queueLength) return

    return {
      text: getText(queueLength),
      type: getStatus(queueLength),
    }
  }, [queueLength])

  return statusWarning ? (
    <div className={classes}>
      <InfoBox type={statusWarning.type} text={statusWarning.text} />
    </div>
  ) : null
}

export default ConsolidationQueueStatus
