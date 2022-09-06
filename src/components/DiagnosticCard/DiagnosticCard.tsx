import {FC} from "react";
import Typography from "../Typography/Typography";
import network from '../../../assets/images/network.svg'
import darkNetwork from '../../../assets/images/darkNetwork.svg'
import Status, {StatusType} from "../Status/Status";

export interface DiagnosticCardProps {
    status: StatusType
    title: string
    metric: string
    subTitle: string
    border?: string,
    size?: 'lg' | 'md' | 'sm'
}

const DiagnosticCard:FC<DiagnosticCardProps> = ({
    title,
    metric,
    subTitle,
    status,
    border = 'border border-dark200',
    size = 'md'
}) => {
  const isSmall = size === 'sm';
  const getContainerSize = () => {
      switch (size) {
          case 'lg':
              return 'max-w-xs max-h-60 py-3 px-4 dark:border-dark500';
          case 'sm':
              return 'max-h-11 max-w-tiny p-1 dark:border-none px-1.5'
          default:
              return 'max-w-xs max-h-24 py-3 px-4 dark:border-dark500'
      }
  }

  return (
      <div className={`w-full h-full ${getContainerSize()} ${border} relative flex flex-col dark:bg-dark900 justify-between`}>
          {size !== 'sm' && (
              <>
                  <img className="w-full absolute dark:hidden left-0 top-1/2 transform -translate-y-1/2" src={network} alt="network"/>
                  <img className="w-full absolute hidden dark:block left-0 top-1/2 transform -translate-y-1/2" src={darkNetwork} alt="network"/>
              </>
          )}
          <div className="w-full z-10 space-x-8 flex justify-between">
              <Typography type={isSmall ? 'text-tiny' : 'text-body'}>{title}</Typography>
              <Typography type={isSmall ? 'text-tiny' : 'text-subtitle2'}>{metric}</Typography>
          </div>
          <div className="w-full z-10 space-x-8 flex items-center justify-between">
              <Typography type={isSmall ? 'text-tiny' : 'text-caption1'}>{subTitle}</Typography>
              <Status status={status} />
          </div>
      </div>
  )
}

export default DiagnosticCard;