import { useRecoilValue } from 'recoil';
import { selectValidatorInfos } from '../../recoil/selectors/selectValidatorInfos';
import Typography from '../Typography/Typography';
import { useEffect, useMemo, useState } from 'react';
import Status from '../Status/Status';
import useValidatorEarnings from '../../hooks/useValidatorEarnings';
import { slotsInDay } from '../../constants/constants';
import { useTranslation } from 'react-i18next';

const ValidatorSummary = () => {
  const { t } = useTranslation()
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
    <div className="w-full max-w-850 flex flex-col lg:space-x-4 shadow lg:flex-row lg:divide-x divide-y lg:divide-y-0 dark:divide-dark600 dark:border dark:border-dark600">
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validators')}</Typography>
        <div className="flex space-x-8">
          <Typography color="text-dark300" type="text-caption1" isCapitalize>{t('validatorManagement.summary.active')}</Typography>
          <Typography isBold type="text-caption1">{validators.length}</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.totalBalance')}</Typography>
        <div className="flex space-x-8">
          <Typography color="text-dark300" type="text-caption1">{t('validatorManagement.summary.locked')}</Typography>
          <Typography isBold type="text-caption1">{totalBalance.toFixed(3)} ETH</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.totalIncome')}</Typography>
        <div className="flex items-center space-x-6">
          <Typography color="text-dark300" type="text-caption1">{t('validatorManagement.day')}</Typography>
          <div className="flex items-center space-x-1">
            <i className={`text-sm ${Number(income) > 0 ? 'bi-chevron-up text-success' : 'bi-chevron-down text-error'}`}/>
            <Typography isBold type="text-caption1">{income} ETH</Typography>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.avgEffectiveness')}</Typography>
        <div className="flex space-x-8">
          <Status status="bg-success"/>
          <Typography isBold type="text-caption1">100%</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.networkValidators')}</Typography>
        <div className="flex space-x-2">
          <Typography color="text-dark300" type="text-caption1">{t('validatorManagement.summary.active')}</Typography>
          <Typography isBold type="text-caption1">138,847</Typography>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.queue')}</Typography>
        <Typography isBold type="text-caption1">0</Typography>
      </div>
    </div>
  )
}

export default ValidatorSummary;