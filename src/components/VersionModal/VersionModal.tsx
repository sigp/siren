import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { REQUIRED_VALIDATOR_VERSION } from '../../constants/constants';
import { SemanticVersion } from '../../types';
import AlertIcon from '../AlertIcon/AlertIcon';
import Button, { ButtonFace } from '../Button/Button';
import RodalModal from '../RodalModal/RodalModal';
import Typography from '../Typography/Typography';

export interface VersionModalProps {
  isVisible: boolean
  currentVersion: SemanticVersion
}

const VersionModal:FC<VersionModalProps> = ({isVisible, currentVersion}) => {
  const {t} = useTranslation()
  const { major, minor, patch } = REQUIRED_VALIDATOR_VERSION
  const { major: vcMajor, minor: vcMinor, patch: vcPatch } = currentVersion

  return (
    <RodalModal styles={{ maxWidth: '500px' }} isVisible={isVisible}>
      <div className='p-6'>
        <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
          <AlertIcon className='h-8 w-8' type='warning' />
          <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
            {t('versionModal.title')}
          </Typography>
        </div>
        <div className='space-y-4'>
          <Typography type='text-caption1'>
            <Trans
              i18nKey="versionModal.message"
              values={{ version: `${vcMajor}.${vcMinor}.${vcPatch}`, requirement:  `${major}.${minor}.${patch}`}}
            >
              <span className='font-bold' />
              <span className='font-bold' />
            </Trans>
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
                {t('versionModal.update')}
              </Typography>
              <i className='bi-box-arrow-up-right text-caption1 ml-2' />
            </div>
          </Button>
        </div>
      </div>
    </RodalModal>
  )
}

export default VersionModal