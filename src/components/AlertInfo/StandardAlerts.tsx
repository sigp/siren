import { AnimatePresence } from 'framer-motion';
import { FC } from 'react';
import { AlertMessage, StatusColor } from '../../types';
import AlertCard from '../AlertCard/AlertCard';

export interface StandardAlertsProps {
  alerts: AlertMessage[]
  onDismiss: (alert: AlertMessage) => void
}

const StandardAlerts:FC<StandardAlertsProps> = ({alerts, onDismiss}) => {
  return (
    <AnimatePresence>
      {
        alerts.map((alert) => {
          const { severity, subText, message, id } = alert
          const count =
            severity === StatusColor.SUCCESS ? 1 : severity === StatusColor.WARNING ? 2 : 3
          return (
            <AlertCard
              key={id}
              status={severity}
              count={count}
              onClick={() => onDismiss(alert)}
              subText={subText}
              text={message}
            />
          )
        })
      }
    </AnimatePresence>
  )
}

export default StandardAlerts