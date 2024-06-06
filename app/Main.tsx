'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertIcon from '../src/components/AlertIcon/AlertIcon';
import AppDescription from '../src/components/AppDescription/AppDescription';
import AuthPrompt from '../src/components/AuthPrompt/AuthPrompt';
import Button, { ButtonFace } from '../src/components/Button/Button';
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner';
import RodalModal from '../src/components/RodalModal/RodalModal';
import Typography from '../src/components/Typography/Typography';
import { REQUIRED_VALIDATOR_VERSION } from '../src/constants/constants';
import { UiMode } from '../src/constants/enums';
import { ToastType } from '../src/types';
import displayToast from '../utilities/displayToast';
import formatSemanticVersion from '../utilities/formatSemanticVersion';
import isExpiredToken from '../utilities/isExpiredToken';
import isRequiredVersion from '../utilities/isRequiredVersion';

const Main = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [isLoading, setLoading] = useState(false)
  const [step] = useState<number>(1)
  const [isReady, setReady] = useState(false)
  const [isVersionError, setVersionError] = useState(false)
  const [sessionToken, setToken] = useState(Cookies.get('session-token'))

  const [beaconNodeVersion, setBeaconVersion] = useState('')
  const [lighthouseVersion, setLighthouseVersion] = useState('')

  useEffect(() => {
    if(sessionToken) {
      if(isExpiredToken(sessionToken)) {
        setToken(undefined)
        return
      }

      (async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${sessionToken}`
            }
          }

          const [beaconResults, lightResults] = await Promise.all([
            axios.get('/api/beacon-version', config),
            axios.get('/api/lighthouse-version', config)
          ])

          setBeaconVersion(beaconResults.data.version)
          setLighthouseVersion(lightResults.data.version)

          setReady(true)

        } catch (e) {
          setReady(true)
          console.error(e)
        }
      })()
    }
  }, [sessionToken])

  useEffect(() => {
    if(beaconNodeVersion && lighthouseVersion) {

      if (!isRequiredVersion(lighthouseVersion, REQUIRED_VALIDATOR_VERSION)) {
        setVersionError(true)
        return
      }

      router.push(redirect || '/setup/health-check')
    }
  }, [beaconNodeVersion, lighthouseVersion, router, redirect])

  const configError = !beaconNodeVersion || !lighthouseVersion
  const { major, minor, patch } = REQUIRED_VALIDATOR_VERSION
  const vcVersion = beaconNodeVersion
    ? formatSemanticVersion(beaconNodeVersion as string)
    : undefined

  const storeSessionCookie = async (password: string) => {
    try {
      setLoading(true)
      const {status, data} = await axios.post('/api/authenticate', {password})
      const token = data.token;
      setLoading(false)

      if(status === 200) {
        setToken(token)
        Cookies.set('session-token', token)
      }

    } catch (e) {
      setLoading(false)
      displayToast(t('authPrompt.authError'), ToastType.ERROR)
    }
  }

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <RodalModal styles={{ maxWidth: '500px' }} isVisible={isReady && configError && !!sessionToken}>
        <div className='p-6'>
          <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
            <AlertIcon className='h-12 w-12' type='error' />
            <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
              Configuration Error!
            </Typography>
          </div>
          <div className='space-y-4'>
            <Typography type='text-caption1'>
              Siren was unable to establish a successful connection to designated{' '}
              {!beaconNodeVersion ? 'Beacon' : ''}{' '}
              {!beaconNodeVersion && !lighthouseVersion ? 'and' : ''}{' '}
              {!lighthouseVersion ? 'Validator' : ''} node...Please review your configuration file
              and make appropriate adjustments. For additional information refer to the Lighthouse
              Book.
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
                  Learn More
                </Typography>
                <i className='bi-box-arrow-up-right text-caption1 ml-2' />
              </div>
            </Button>
          </div>
        </div>
      </RodalModal>
      {vcVersion && (
        <RodalModal styles={{ maxWidth: '500px' }} isVisible={isReady && isVersionError}>
          <div className='p-6'>
            <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
              <AlertIcon className='h-8 w-8' type='warning' />
              <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
                Version Update!
              </Typography>
            </div>
            <div className='space-y-4'>
              <Typography type='text-caption1'>
                Siren detected{' '}
                <span className='font-bold'>
                  Lighthouse v{vcVersion.major}.{vcVersion.minor}.{vcVersion.patch}
                </span>
                . To function properly, Siren requires a minimum of{' '}
                <span className='font-bold'>
                  Lighthouse v{major}.{minor}.{patch}
                </span>
                . Please ensure your Lighthouse version meets or exceeds this requirement in order
                to proceed.
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
                    Update Lighthouse
                  </Typography>
                  <i className='bi-box-arrow-up-right text-caption1 ml-2' />
                </div>
              </Button>
            </div>
          </div>
        </RodalModal>
      )}
      <AuthPrompt mode={UiMode.LIGHT} isLoading={isLoading} isVisible={!sessionToken} onSubmit={storeSessionCookie}/>
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
