import Typography from '../Typography/Typography';
import { useTranslation } from 'react-i18next';
import useValidatorEarnings from '../../hooks/useValidatorEarnings';
import { FC, useEffect, useState } from 'react';
import { slotsInDay } from '../../constants/constants';
import { ValidatorInfo } from '../../types/validator';

export interface ValidatorIncomeSummaryProps {
  className?: string,
  validators: ValidatorInfo[]
}

const ValidatorIncomeSummary:FC<ValidatorIncomeSummaryProps> = ({className, validators}) => {
  const {t} = useTranslation()

  const { fetchHistory } = useValidatorEarnings(validators);
  const [income, setIncome] = useState('0')

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
    <div className={className}>
      <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.totalIncome')}</Typography>
      <div className="flex items-center justify-between">
        <Typography color="text-dark300" type="text-caption1">{t('validatorManagement.day')}</Typography>
        <div className="flex items-center space-x-1">
          <i className={`text-sm ${Number(income) > 0 ? 'bi-chevron-up text-success' : 'bi-chevron-down text-error'}`}/>
          <Typography isBold type="text-caption1">{income} ETH</Typography>
        </div>
      </div>
    </div>
  )
}

export default ValidatorIncomeSummary;