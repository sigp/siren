import { useRecoilState } from 'recoil'
import { alertLogs } from '../recoil/atoms'
import { AlertMessage } from '../types'
import { useMemo } from 'react'

const useDiagnosticAlerts = () => {
  const [alerts, setAlerts] = useRecoilState(alertLogs)

  const storeAlert = (alert: AlertMessage) => {
    if (alerts.filter(({ id }) => id === alert.id).length <= 0) {
      setAlerts((prev) => {
        const list = prev.filter(({ id }) => id !== alert.id)

        return [...list, alert]
      })
    }
  }

  const updateAlert = (alert: AlertMessage) => {
    if (alerts.filter(({ id, isDismissed }) => id === alert.id && isDismissed).length <= 0) {
      removeAlert(alert.id)
      storeAlert(alert)
    }
  }

  const dismissAlert = (alert: AlertMessage) => {
    const loggedAlert = alerts.find(({ id }) => id === alert.id)

    if (loggedAlert) {
      setAlerts((prev) => {
        const list = prev.filter(({ id }) => id !== loggedAlert.id)

        return [...list, { ...loggedAlert, isDismissed: true }]
      })
    }
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => id !== alert.id))
  }

  const resetDismissed = () => {
    alerts.forEach(({ isDismissed, id }) => {
      if (isDismissed) {
        removeAlert(id)
      }
    })
  }

  const formattedList = useMemo(() => {
    return alerts.filter(({ isDismissed }) => isDismissed !== true)
  }, [alerts])

  return {
    alerts: formattedList,
    storeAlert,
    updateAlert,
    dismissAlert,
    removeAlert,
    resetDismissed,
  }
}

export default useDiagnosticAlerts
