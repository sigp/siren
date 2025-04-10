import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import NotFound from '../../assets/images/no-results.png'
import Typography from '../Typography/Typography'

const NoEligibleValidatorsFound = () => {
  const { t } = useTranslation()

  return (
    <div className='p-12 bg-dark10 dark:bg-dark700 flex flex-col items-center justify-center space-y-2'>
      <Typography>{t('emptyState.consolidationList.noEligibleFound')}</Typography>
      <Image className='opacity-70' alt='noEligibleFound' src={NotFound} width={64} height={64} />
      <Typography className='text-center w-1/2' type='text-caption1'>
        {t('emptyState.consolidationList.reviewValidators')}
      </Typography>
    </div>
  )
}

export default NoEligibleValidatorsFound
