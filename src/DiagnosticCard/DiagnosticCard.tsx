import {FC} from "react";
import Typography from "../Typography/Typography";
import network from '../../assets/images/network.svg'
import Status, {StatusType} from "../Status/Status";

export interface DiagnosticCardProps {
    status: StatusType
    title: string
    metric: string
    subTitle: string,
    size?: 'lg' | 'md' | 'sm'
}

const DiagnosticCard:FC<DiagnosticCardProps> = ({
    title,
    metric,
    subTitle,
    status,
    size = 'md'
}) => {
  const isSmall = size === 'sm';
  const getContainerSize = () => {
      switch (size) {
          case 'lg':
              return 'max-w-xs max-h-60 py-3 px-4';
          case 'sm':
              return 'max-h-11 max-w-tiny p-1'
          default:
              return 'max-w-xs max-h-24 py-3 px-4'
      }
  }

  return (
      <div className={`w-full h-full ${getContainerSize()} relative flex flex-col justify-between border border-dark200 `}>
          <img className="w-full absolute left-0 top-1/2 transform -translate-y-1/2" src={network} alt="network"/>
          <div className="w-full z-10 flex justify-between">
              <Typography type={isSmall ? 'text-tiny' : 'text-body'}>{title}</Typography>
              <Typography type={isSmall ? 'text-tiny' : 'text-subtitle2'}>{metric}</Typography>
          </div>
          <div className="w-full z-10 flex items-center justify-between">
              <Typography type={isSmall ? 'text-tiny' : 'text-caption1'}>{subTitle}</Typography>
              <Status status={status} />
          </div>
      </div>
  )
}

export default DiagnosticCard;