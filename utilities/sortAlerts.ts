import { AlertMessage, StatusColor } from '../src/types'

const sortAlertMessagesBySeverity = (alertMessages: AlertMessage[]): AlertMessage[] => {
  const severityOrder: StatusColor[] = [
    StatusColor.ERROR,
    StatusColor.WARNING,
    StatusColor.SUCCESS,
    StatusColor.DARK,
  ]

  return alertMessages.sort((a, b) => {
    const aSeverityIndex = severityOrder.indexOf(a.severity)
    const bSeverityIndex = severityOrder.indexOf(b.severity)
    return aSeverityIndex - bSeverityIndex
  })
}

export default sortAlertMessagesBySeverity
