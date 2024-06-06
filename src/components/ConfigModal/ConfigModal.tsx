import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AlertIcon from '../AlertIcon/AlertIcon';
import Button, { ButtonFace } from '../Button/Button';
import RodalModal from '../RodalModal/RodalModal';
import Typography from '../Typography/Typography';

export interface ConfigModalProps {
  isReady: boolean
  beaconNodeVersion: string
  lighthouseVersion: string
}

const ConfigModal:FC<ConfigModalProps> = ({isReady, beaconNodeVersion, lighthouseVersion}) => {
  const {t} = useTranslation()


  return (
    <RodalModal styles={{ maxWidth: '500px' }} isVisible={isReady}>
      <div className='p-6'>
        <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
          <AlertIcon className='h-12 w-12' type='error' />
          <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
            {t('configModal.title')}
          </Typography>
        </div>
        <div className='space-y-4'>
          <Typography type='text-caption1'>
            {t('configModal.description', {subject: `${!beaconNodeVersion ? 'Beacon' : ''}${!beaconNodeVersion && !lighthouseVersion ? ' and ' : ''}${!lighthouseVersion ? 'Validator' : ''}`.trim()})}
          </Typography>
        </div>
        <div className='w-full flex justify-end pt-8'>
          <Button type={ButtonFace.SECONDARY}>
            <div className='flex items-center'>
              <Typography
                color='text-white'
                isUpperCase
                type='text-caption1'
                family='font-roboto'
              >
                {t('configModal.learnMore')}
              </Typography>
              <i className='bi-box-arrow-up-right text-caption1 ml-2' />
            </div>
          </Button>
        </div>
      </div>
    </RodalModal>
  )
}

export default ConfigModal