'use client'

import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppDescription from '../src/components/AppDescription/AppDescription'
import AuthPrompt from '../src/components/AuthPrompt/AuthPrompt'
import ConfigModal from '../src/components/ConfigModal/ConfigModal'
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner'
import Typography from '../src/components/Typography/Typography'
import VersionModal from '../src/components/VersionModal/VersionModal'
import { REQUIRED_VALIDATOR_VERSION } from '../src/constants/constants'
import { UiMode } from '../src/constants/enums'
import useLocalStorage from '../src/hooks/useLocalStorage'
import { ToastType } from '../src/types'
import displayToast from '../utilities/displayToast'
import formatSemanticVersion from '../utilities/formatSemanticVersion'
import isRequiredVersion from '../utilities/isRequiredVersion'

const Main = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [isLoading, setLoading] = useState(false)
  const [step] = useState<number>(1)
  const [isReady, setReady] = useState(false)
  const [isVersionError, setVersionError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [, setUsername] = useLocalStorage<string>('username', 'Keeper')
  const [healthCheck] = useLocalStorage<boolean>('health-check', false)

  const [beaconNodeVersion, setBeaconVersion] = useState('')
  const [lighthouseVersion, setLighthouseVersion] = useState('')

  const fetchNodeVersion = async () => {
    try {
      const [beaconResults, lightResults] = await Promise.all([
        axios.get('/api/beacon-version'),
        axios.get('/api/lighthouse-version'),
      ])

      setBeaconVersion(beaconResults.data.version)
      setLighthouseVersion(lightResults.data.version)
      setIsAuthenticated(true)
    } catch (e) {
      console.error(e)
    } finally {
      setReady(true)
    }
  }

  useEffect(() => {
    void fetchNodeVersion()
  }, [])

  useEffect(() => {
    if (beaconNodeVersion && lighthouseVersion) {
      if (!isRequiredVersion(lighthouseVersion, REQUIRED_VALIDATOR_VERSION)) {
        setVersionError(true)
        return
      }

      let nextRoute = '/setup/health-check'

      if (healthCheck) {
        nextRoute = '/dashboard'
      }

      router.push(redirect || nextRoute)
    }
  }, [beaconNodeVersion, lighthouseVersion, router, redirect])

  const configError = !beaconNodeVersion || !lighthouseVersion
  const vcVersion = beaconNodeVersion
    ? formatSemanticVersion(beaconNodeVersion as string)
    : undefined

  const storeSessionCookie = async (password: string, username: string) => {
    try {
      setLoading(true)
      setUsername(username)
      const { status } = await axios.post('/api/authenticate', { password })

      if (status === 200) {
        await fetchNodeVersion()
      }
    } catch (e: any) {
      displayToast(t(e.response.data.error as string), ToastType.ERROR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <ConfigModal
        isReady={isReady && configError && isAuthenticated}
        beaconNodeVersion={beaconNodeVersion}
        lighthouseVersion={lighthouseVersion}
      />
      {vcVersion && (
        <VersionModal currentVersion={vcVersion} isVisible={isReady && isVersionError} />
      )}
      <AuthPrompt
        isNamePrompt
        mode={UiMode.LIGHT}
        isLoading={isLoading}
        isVisible={isReady && !isAuthenticated}
        onSubmit={storeSessionCookie}
      />
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
