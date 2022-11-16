import Typography from '../Typography/Typography'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '../../hooks/useMediaQuery';

const LogsInfo = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 425px)')

  const size = isMobile ? 'health' : 'md';
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 md:border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('logInfo.logs')}
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          {t('viewAll')}
        </Typography>
      </div>
      <DiagnosticCard
        title={t('logInfo.criticalLogs')}
        maxHeight='flex-1'
        status='bg-success'
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('critical')}
        metric='0.01'
      />
      <DiagnosticCard
        isBackground={false}
        title={t('errors')}
        maxHeight='flex-1'
        status='bg-success'
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric='0.94 / HR'
      />
      <DiagnosticCard
        isBackground={false}
        title={t('logInfo.warnings')}
        maxHeight='flex-1'
        status='bg-success'
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric='0.33 / HR'
      />
    </div>
  )
}

export default LogsInfo
