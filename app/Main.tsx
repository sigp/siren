import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWRMutation from 'swr/mutation';
import AlertIcon from '../src/components/AlertIcon/AlertIcon';
import AppDescription from '../src/components/AppDescription/AppDescription';
import Button, { ButtonFace } from '../src/components/Button/Button';
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner';
import RodalModal from '../src/components/RodalModal/RodalModal';
import Typography from '../src/components/Typography/Typography';
import { REQUIRED_VALIDATOR_VERSION } from '../src/constants/constants';
import formatSemanticVersion from '../utilities/formatSemanticVersion';
import isRequiredVersion from '../utilities/isRequiredVersion';
import { useRouter } from 'next/navigation'
import swrGetFetcher from '../utilities/swrGetFetcher';

export interface InitProps {
  beaconNodeVersion?: string | undefined
  apiTokenPath?: string | undefined
}

const Main:FC<InitProps> = ({beaconNodeVersion, apiTokenPath}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const {data, trigger} = useSWRMutation('/api/lighthouse-version', swrGetFetcher)
  const [isVersionError, setError] = useState(false)

  const configError = !beaconNodeVersion || !apiTokenPath
  const { major, minor, patch } = REQUIRED_VALIDATOR_VERSION
  const vcVersion = beaconNodeVersion ? formatSemanticVersion(beaconNodeVersion as string) : undefined;

  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    if(data) {
      const { version } = data.data

      if(!isRequiredVersion(version, REQUIRED_VALIDATOR_VERSION)) {
        setError(true)
        return
      }

      router.push('/setup/health-check')
    }
  }, [data])

  useEffect(() => {
    void trigger().then(() => setStep(2))
  }, [trigger, setStep])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <RodalModal styles={{ maxWidth: '500px' }} isVisible={configError}>
        <div className="p-6">
          <div className="pb-2 border-b mb-6 flex items-center space-x-4">
            <AlertIcon className="h-12 w-12" type="error"/>
            <Typography type="text-subtitle3" isUpperCase fontWeight="font-light">Configuration Error!</Typography>
          </div>
          <div className="space-y-4">
            <Typography type="text-caption1">Siren was unable to establish a successful connection to designated...Please review your configuration file and make appropriate adjustments. For additional information refer to the Lighthouse Book.</Typography>
          </div>
          <div className="w-full flex justify-end pt-8">
            <Button type={ButtonFace.SECONDARY}>
              <div className="flex items-center">
                <Typography color="text-white" isUpperCase type="text-caption1" family="font-roboto">Learn More</Typography>
                <i className="bi-box-arrow-up-right text-caption1 ml-2"/>
              </div>
            </Button>
          </div>
        </div>
      </RodalModal>
      {vcVersion && (
        <RodalModal styles={{ maxWidth: '500px' }} isVisible={isVersionError}>
          <div className="p-6">
            <div className="pb-2 border-b mb-6 flex items-center space-x-4">
              <AlertIcon className="h-8 w-8" type="warning"/>
              <Typography type="text-subtitle3" isUpperCase fontWeight="font-light">Version Update!</Typography>
            </div>
            <div className="space-y-4">
              <Typography type="text-caption1">
                Siren detected <span className="font-bold">Lighthouse v{vcVersion.major}.{vcVersion.minor}.{vcVersion.patch}</span>. To function properly, Siren requires a minimum of <span className="font-bold">Lighthouse v{major}.{minor}.{patch}</span>. Please ensure your Lighthouse version meets or exceeds this requirement in order to proceed.
              </Typography>
            </div>
            <div className="w-full flex justify-end pt-8">
              <Button type={ButtonFace.SECONDARY}>
                <div className="flex items-center">
                  <Typography color="text-white" isUpperCase type="text-caption1" family="font-roboto">Update Lighthouse</Typography>
                  <i className="bi-box-arrow-up-right text-caption1 ml-2"/>
                </div>
              </Button>
            </div>
          </div>
        </RodalModal>
      )}
      <div className='absolute top-0 left-0 w-full h-full bg-cover bg-lighthouse' />
      <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
        <LoadingSpinner />
      </div>
      <div className='z-10 relative h-full pl-12 pb-12 pt-12 md:pt-32 md:pl-24 xl:pl-32 md:pb-32 flex flex-col justify-between'>
        <div className='space-y-4'>
          <Typography fontWeight='font-light' type='text-subtitle3' color='text-dark100'>
            {`${t('initScreen.initializing')}...`}
          </Typography>
          <div className='opacity-40'>
            {step >= 0 && (
              <>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  {`${t('initScreen.fetchingEndpoints')}...`}
                </Typography>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  {`${t('initScreen.connectingBeacon')}...`}
                </Typography>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  {`${t('initScreen.connectingValidator')}...`}
                </Typography>
              </>
            )}
            {step > 1 && (
              <Typography isBold type='text-tiny' color='text-dark100'>
                {`${t('initScreen.fetchBeaconSync')}...`}
              </Typography>
            )}
            <Typography isBold type='text-tiny' color='text-dark100'>
              - - -
            </Typography>
            <div className='animate-blink h-3 w-1 bg-white text-dark100' />
          </div>
        </div>
        <AppDescription view='init' />
      </div>
    </div>
  )
}

export default Main
