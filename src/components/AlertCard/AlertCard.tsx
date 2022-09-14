import StatusBar, {StatusBarProps} from "../StatusBar/StatusBar";
import Typography from "../Typography/Typography";
import {FC} from "react";
export interface AlertCardProps extends StatusBarProps {
    text: string,
    subText: string
}

const AlertCard:FC<AlertCardProps> = ({text, subText, ...props}) => {
  return (
      <div className="w-full h-14 border-t-0 border-l-0 border-style500 flex justify-between items-center space-x-2 p-2">
          <StatusBar {...props} />
          <div className="w-full max-w-tiny">
              <Typography type="text-caption2">{text}</Typography>
              <Typography type="text-caption2" className="uppercase">{subText}</Typography>
          </div>
          <i className="bi-info-circle-fill text-dark200 dark:text-dark300"/>
      </div>
  )
}

export default AlertCard;