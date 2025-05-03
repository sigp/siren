import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import { Status } from '../../constants/enums'
import Typography from '../Typography/Typography'

export interface StatusTagProps {
  status: Status
  pendingText?: string
  successText?: string
  errorText?: string
}

const StatusTag: FC<StatusTagProps> = ({ status, pendingText, successText, errorText }) => {
  const { t } = useTranslation()
  const isPending = status === Status.PENDING
  const isSuccess = status === Status.SUCCESS

  const validClasses = addClassString('w-fit p-2 border rounded', [
    isPending
      ? 'border-style'
      : isSuccess
        ? 'border-success bg-success100'
        : 'border-error bg-error100',
  ])

  return (
    <div className={validClasses}>
      <Typography
        color={isPending ? 'text-dark900' : isSuccess ? 'text-success' : 'text-error'}
        isCapitalize
        darkMode={
          isPending ? 'dark:text-dark400' : isSuccess ? 'dark:text-success' : 'dark:text-error'
        }
        className='whitespace-nowrap'
        type='text-caption1'
      >
        {isPending
          ? `${pendingText || t('pending')}...`
          : isSuccess
            ? successText || t('available')
            : errorText || t('inUse')}
      </Typography>
    </div>
  )
}

export default StatusTag
