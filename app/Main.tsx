'use client'

import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppDescription from '../src/components/AppDescription/AppDescription'
import AuthPrompt from '../src/components/AuthPrompt/AuthPrompt'
import ConfigModal from '../src/components/ConfigModal/ConfigModal'
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner'
import Typography from '../src/components/Typography/Typography'
import VersionModal from '../src/components/VersionModal/VersionModal'
import {
  REQUIRED_VALIDATOR_VERSION,
  VERSION_FETCH_RETRY_INTERVAL,
  MINIMUM_ERROR_DISPLAY_TIME,
} from '../src/constants/constants'
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
  const [isReady, setReady] = useState(false)
  const [isVersionError, setVersionError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [healthCheck] = useLocalStorage<boolean>('health-check', false)

  const [beaconNodeVersion, setBeaconVersion] = useState('')
  const [lighthouseVersion, setLighthouseVersion] = useState('')
  const [beaconError, setBeaconError] = useState(false)
  const [validatorError, setValidatorError] = useState(false)
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null)
  const errorTimestampRef = useRef<number | null>(null)

  const fetchNodeVersion = async (isRetry: boolean = false) => {
    try {
      const results = await Promise.allSettled([
        axios.get('/api/beacon-version', { timeout: 10000 }),
        axios.get('/api/lighthouse-version', { timeout: 10000 }),
      ])

      const beaconResult = results[0]
      const validatorResult = results[1]

      if (beaconResult.status === 'fulfilled') {
        setBeaconVersion(beaconResult.value.data.version)
        setBeaconError(false)
      } else {
        console.error('Failed to fetch beacon version:', beaconResult.reason)
        setBeaconError(true)
        if (!errorTimestampRef.current) {
          errorTimestampRef.current = Date.now()
        }
      }

      if (validatorResult.status === 'fulfilled') {
        setLighthouseVersion(validatorResult.value.data.version)
        setValidatorError(false)
      } else {
        console.error('Failed to fetch validator version:', validatorResult.reason)
        setValidatorError(true)
        if (!errorTimestampRef.current) {
          errorTimestampRef.current = Date.now()
        }
      }

      if (beaconResult.status === 'rejected' || validatorResult.status === 'rejected') {
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current)
        }
        retryTimerRef.current = setTimeout(() => {
          fetchNodeVersion(true)
        }, VERSION_FETCH_RETRY_INTERVAL)
      } else if (isRetry && errorTimestampRef.current) {
        const errorDuration = Date.now() - errorTimestampRef.current
        const remainingTime = Math.max(0, MINIMUM_ERROR_DISPLAY_TIME - errorDuration)

        if (remainingTime > 0) {
          setTimeout(() => {
            errorTimestampRef.current = null
          }, remainingTime)
        } else {
          errorTimestampRef.current = null
        }
      }
    } catch (e) {
      console.error('Unexpected error fetching node versions:', e)
      setBeaconError(true)
      setValidatorError(true)
      if (!errorTimestampRef.current) {
        errorTimestampRef.current = Date.now()
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
      retryTimerRef.current = setTimeout(() => {
        fetchNodeVersion(true)
      }, VERSION_FETCH_RETRY_INTERVAL)
    }
  }

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (beaconNodeVersion && lighthouseVersion && !errorTimestampRef.current) {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }

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
  }, [beaconNodeVersion, lighthouseVersion, router, redirect, healthCheck])

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const configError = (!beaconNodeVersion || !lighthouseVersion) && (beaconError || validatorError)
  const vcVersion = beaconNodeVersion
    ? formatSemanticVersion(beaconNodeVersion as string)
    : undefined

  const storeSessionCookie = async (password: string) => {
    try {
      setLoading(true)
      const { status } = await axios.post('/api/authenticate', { password })

      if (status === 200) {
        setIsAuthenticated(true)
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
        isBeaconError={beaconError}
        isValidatorError={validatorError}
      />
      {vcVersion && (
        <VersionModal currentVersion={vcVersion} isVisible={isReady && isVersionError} />
      )}
      <AuthPrompt
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
            <Typography isBold type='text-tiny' color='text-dark100'>
              {`${t('initScreen.fetchingEndpoints')}...`}
            </Typography>
            <Typography isBold type='text-tiny' color='text-dark100'>
              {`${t('initScreen.connectingBeacon')}...`}
            </Typography>
            <Typography isBold type='text-tiny' color='text-dark100'>
              {`${t('initScreen.connectingValidator')}...`}
            </Typography>
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
