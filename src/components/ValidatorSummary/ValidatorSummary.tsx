import { useRecoilValue } from 'recoil';
import { selectValidatorInfos } from '../../recoil/selectors/selectValidatorInfos';
import Typography from '../Typography/Typography';
import { useEffect, useMemo, useState } from 'react';
import Status from '../Status/Status';
import useValidatorEarnings from '../../hooks/useValidatorEarnings';
import { slotsInDay } from '../../constants/constants';

const ValidatorSummary = () => {
  const validators = useRecoilValue(selectValidatorInfos)
  const { fetchHistory } = useValidatorEarnings();
  const [income, setIncome] = useState('0')

  const totalBalance = useMemo(() => {
    return validators.map(validator => validator.balance).reduce((a,b) => a + b, 0)
  }, [validators])

  const fetchIncome = async (time: number) => {
    const earnings = await fetchHistory(time);

    if(earnings) {
      setIncome(earnings.toFixed(3))
    }
  }

  useEffect(() => {
    void fetchIncome(slotsInDay)
  }, [])

  return (
    <div className="w-full max-w-800 flex flex-col lg:space-x-4 shadow lg:flex-row lg:divide-x divide-y lg:divide-y-0 dark:divide-dark600 dark:border dark:border-dark600">
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>Validators</Typography>
        <div className="flex space-x-8">
          <Typography color="text-dark300" type="text-caption1">Active</Typography>
          <Typography isBold type="text-caption1">{validators.length}</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>Total Balance</Typography>
        <div className="flex space-x-8">
          <Typography color="text-dark300" type="text-caption1">Locked</Typography>
          <Typography isBold type="text-caption1">{totalBalance.toFixed(3)} ETH</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>Total Income</Typography>
        <div className="flex items-center space-x-2">
          <Typography color="text-dark300" type="text-caption1">Day</Typography>
          <div className="flex items-center space-x-1">
            <i className={`text-sm ${Number(income) > 0 ? 'bi-chevron-up text-success' : 'bi-chevron-down text-error'}`}/>
            <Typography isBold type="text-caption1">{income} ETH</Typography>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>AVG EFFECTIVENESS</Typography>
        <div className="flex space-x-8">
          <Status status="bg-success"/>
          <Typography isBold type="text-caption1">100%</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>Network Validators</Typography>
        <div className="flex space-x-2">
          <Typography color="text-dark300" type="text-caption1">Active</Typography>
          <Typography isBold type="text-caption1">138,847</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold>Queue</Typography>
        <Typography isBold type="text-caption1">0</Typography>
      </div>
    </div>
  )
}

export default ValidatorSummary;