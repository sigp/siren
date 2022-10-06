import Typography from '../Typography/Typography'
import AlertCard from '../AlertCard/AlertCard'
import { useTranslation } from 'react-i18next';

const AlertInfo = () => {
  const {t} = useTranslation()
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('alertInfo.alerts')}
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          {t('viewAll')}
        </Typography>
      </div>
      <AlertCard
        status='bg-success'
        count={3}
        subText={t('good')}
        text={t('alertInfo.participation', {percent: 66})}
      />
      <AlertCard
        status='bg-warning'
        count={1}
        subText={t('fair')}
        text={t('alertInfo.process', {status: 'Process Down'})}
      />
      <AlertCard status='bg-success' count={3} subText={t('good')} text={t('alertInfo.peerCount', {count: 32})} />
      <AlertCard
        status='bg-success'
        count={3}
        subText={t('good')}
        text={t('alertInfo.participation', {percent: 68})}
      />
      <div className='flex-1 border-l-0 border-t-0 border-style500 flex items-center justify-center'>
        <i className='bi bi-lightning-fill text-primary text-h3 opacity-20' />
      </div>
    </div>
  )
}

export default AlertInfo
