import useDeviceDiagnostics from './useDeviceDiagnostics'
import { useRecoilValue } from 'recoil'
import { validatorPeerCount } from '../recoil/atoms'
import { useMemo } from 'react'
import { Alert, StatusColor } from '../types'
import { useTranslation } from 'react-i18next'

const useDiagnosticAlerts = () => {
  const { t } = useTranslation()
  const { natOpen } = useDeviceDiagnostics()
  const peers = useRecoilValue(validatorPeerCount)

  const natAlert = useMemo<Alert | undefined>(() => {
    if (natOpen) return

    return {
      message: t('alert.natClosedStatus', { type: t('alert.type.network') }),
      subText: t('poor'),
      severity: StatusColor.ERROR,
    }
  }, [natOpen])

  const peerCountAlert = useMemo<Alert | undefined>(() => {
    if (!peers && peers !== 0) return undefined

    switch (true) {
      case peers < 20:
        return {
          message: t('alert.peerCountLow', { type: t('alert.type.nodeValidator') }),
          subText: t('poor'),
          severity: StatusColor.ERROR,
        }
      case peers > 20 && peers < 50:
        return {
          message: t('alert.peerCountMedium', { type: t('alert.type.nodeValidator') }),
          subText: t('fair'),
          severity: StatusColor.WARNING,
        }
      default:
        return undefined
    }
  }, [peers])

  return {
    natAlert,
    peerCountAlert,
  }
}

export default useDiagnosticAlerts
