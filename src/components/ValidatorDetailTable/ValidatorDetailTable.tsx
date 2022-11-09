import Typography from '../Typography/Typography';
import { FC } from 'react';
import { ValidatorInfo } from '../../types/validator';

export interface ValidatorDetailTableProps {
  validator: ValidatorInfo
}

export const ValidatorDetailTable:FC<ValidatorDetailTableProps> = ({validator}) => {
  const { balance } = validator;
  const income = balance ? balance - 32 : 0
  return (
    <>
      <div className="w-full lg:hidden">
        <div className="border-t w-full">
          <div className="w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Balance</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Income</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Proposed</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Attested</Typography>
            </div>
          </div>
          <div className="border-t w-full flex">
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
        <div className="border-t w-full">
          <div className="w-full flex">
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Aggregated</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>In</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Effectiveness</Typography>
            </div>
            <div className="flex-1 py-2 px-2 md:py-4 md:px-6">
              <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Apr</Typography>
            </div>
          </div>
          <div className="border-t w-full flex">
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
      <div className="hidden lg:block border-t w-full">
        <div className="w-full flex">
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Balance</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Income</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Proposed</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Attested</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Aggregated</Typography>
          </div>
          <div className="w-12 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>In</Typography>
          </div>
          <div className="w-24 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Effectiveness</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption2" color="text-dark500" isBold isUpperCase>Apr</Typography>
          </div>
        </div>
        <div className="border-t w-full flex">
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">{balance?.toFixed(4)}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1" color={income > 0 ? 'text-success' : 'text-error'}>{income.toFixed(4)}</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">0</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">0</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">0</Typography>
          </div>
          <div className="w-12 py-4 px-6">
            <Typography type="text-caption1">0</Typography>
          </div>
          <div className="w-24 py-4 px-6">
            <Typography type="text-caption1">100%</Typography>
          </div>
          <div className="w-20 py-4 px-6">
            <Typography type="text-caption1">10%</Typography>
          </div>
        </div>
      </div>
    </>
  )
}

export default ValidatorDetailTable;