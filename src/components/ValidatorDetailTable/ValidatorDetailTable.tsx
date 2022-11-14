import Typography from '../Typography/Typography';
import { FC } from 'react';
import { ValidatorInfo } from '../../types/validator';
import formatBalanceColor from '../../utilities/formatBalanceColor';
import { useTranslation } from 'react-i18next';

export interface ValidatorDetailTableProps {
  validator: ValidatorInfo
}

export const ValidatorDetailTable:FC<ValidatorDetailTableProps> = ({validator}) => {
  const {t} = useTranslation()
  const { balance } = validator;
  const income = balance ? balance - 32 : 0
  const incomeColor = formatBalanceColor(income);
  return (
    <>
      <div className="w-full lg:hidden">
        <div className="border-t-style100 w-full">
          <div className="w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('balance')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('income')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('proposed')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('attested')}</Typography>
            </div>
          </div>
          <div className="border-t-style100 w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">{balance?.toFixed(4)}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1" color={income > 0 ? 'text-success' : 'text-error'}>{income.toFixed(4)}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">0</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">0</Typography>
            </div>
          </div>
        </div>
        <div className="border-t-style100 w-full">
          <div className="w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('aggregated')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('in')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('effectiveness')}</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Apr</Typography>
            </div>
          </div>
          <div className="border-t-style100 w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">0</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">0</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">100%</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption1">10%</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block border-t-style100 w-full">
        <div className="w-full flex">
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('balance')}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('income')}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('proposed')}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('attested')}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('aggregated')}</Typography>
          </div>
          <div className="w-12 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('in')}</Typography>
          </div>
          <div className="w-24 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>{t('effectiveness')}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Apr</Typography>
          </div>
        </div>
        <div className="border-t-style100 w-full flex">
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">{balance?.toFixed(4)}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1" color={incomeColor} darkMode={incomeColor}>{income.toFixed(4)}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">0</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">0</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">0</Typography>
          </div>
          <div className="w-12 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">0</Typography>
          </div>
          <div className="w-24 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">100%</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography color="text-dark400" type="text-caption1">10%</Typography>
          </div>
        </div>
      </div>
    </>
  )
}

export default ValidatorDetailTable;