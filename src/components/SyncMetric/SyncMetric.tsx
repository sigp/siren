import {FC} from "react";
import Typography from "../Typography/Typography";
import ProgressCircle, {ProgressCircleProps} from "../ProgressCircle/ProgressCircle";
import {formatLocalCurrency} from "../../utilities/formatLocalCurrency";
import getPercentage from "../../utilities/getPercentage";

export interface SyncMetricProps extends ProgressCircleProps{
    total: number,
    amount: number,
    title: string,
    borderStyle?: string
}

const SyncMetric:FC<SyncMetricProps> = ({title, amount, total, borderStyle = 'border', ...props}) => {
  return (
      <div className={`flex w-40 h-14 max-h-full bg-white dark:bg-dark750 ${borderStyle} border-borderLight dark:border-dark900`}>
          <div className="p-1.5">
              <Typography type="text-tiny" family="font-roboto" darkMode="dark:text-white" isBold className="uppercase">{title}</Typography>
              <Typography type="text-caption1" family="font-roboto" color="text-dark400" isBold className="uppercase">Syncing — </Typography>
              <Typography type="text-tiny" family="font-roboto" color="text-dark400" isBold className="uppercase">
                  {formatLocalCurrency(amount, {specificity: 0})} / {formatLocalCurrency(total, {specificity: 0})}
              </Typography>
          </div>
          <div className="flex-1 flex items-center justify-center">
              <ProgressCircle {...props} percent={getPercentage(amount, total)} />
          </div>
      </div>
  )
}

export default SyncMetric;