import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'

export interface ViewDisclosuresProps {
  onClick?: () => void
}

const ViewDisclosures: FC<ViewDisclosuresProps> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <div onClick={onClick} className='flex space-x-4 items-center cursor-pointer'>
      <i className='bi-info-circle text-caption1 text-primary' />
      <Typography
        isBold
        family='font-archivo'
        color='text-primary'
        type='text-caption1'
        isUpperCase
      >
        {t('viewDisclosures')}
      </Typography>
    </div>
  )
}

export default ViewDisclosures
