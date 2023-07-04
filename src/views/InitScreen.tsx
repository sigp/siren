import Typography from '../components/Typography/Typography'
import useLocalStorage from '../hooks/useLocalStorage'
import { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import {
  appView,
  userName,
  onBoardView,
  beaconVersionData,
  validatorVersionData,
  activeDevice,
  deviceSettings,
  validatorAliases,
} from '../recoil/atoms'
import { AppView, OnboardView, UiMode } from '../constants/enums'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import { fetchVersion } from '../api/lighthouse'
import { fetchBeaconVersion, fetchSyncStatus } from '../api/beacon'
import { useTranslation } from 'react-i18next'
import { DeviceKeyStorage, DeviceListStorage, UsernameStorage } from '../types/storage'
import AppDescription from '../components/AppDescription/AppDescription'
import SessionAuthModal from '../components/SessionAuthModal/SessionAuthModal'
import isRequiredVersion from '../utilities/isRequiredVersion'
import { REQUIRED_VALIDATOR_VERSION } from '../constants/constants'
import { DeviceSettings, ValAliases } from '../types'

const InitScreen = () => {
  const { t } = useTranslation()
  const [isReady, setReady] = useState(false)
  const [step, setStep] = useState<number>(0)
  const setView = useSetRecoilState(appView)
  const [isAuthModal, toggleAuthModal] = useState(false)
  const setOnboardView = useSetRecoilState(onBoardView)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setActiveDevice = useSetRecoilState(activeDevice)
  const setDevices = useSetRecoilState(deviceSettings)
  const [deviceKey] = useLocalStorage<DeviceKeyStorage>('deviceKey', undefined)
  const [devices] = useLocalStorage<DeviceListStorage>('deviceList', undefined)
  const setAlias = useSetRecoilState(validatorAliases)
  const [username] = useLocalStorage<UsernameStorage>('username', undefined)
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})

  const storedDevice = devices?.[deviceKey || '']
  const moveToView = (view: AppView) => {
    setTimeout(() => {
      setView(view)
    }, 1000)
  }
  const moveToOnboard = () => moveToView(AppView.ONBOARD)

  const incrementStep = () => setStep((prev) => prev + 1)

  const fetchAndValidateVersion = async (
    device: DeviceSettings,
    apiToken: string,
  ): Promise<boolean> => {
    const { validatorUrl, beaconUrl } = device
    const [vcResult, beaconResult] = await Promise.all([
      fetchVersion(validatorUrl, apiToken),
      fetchBeaconVersion(beaconUrl),
    ])

    const vcVersion = vcResult.data.data.version

    setBeaconVersion(beaconResult.data.data.version)
    setValidatorVersion(vcVersion)

    return isRequiredVersion(vcVersion, REQUIRED_VALIDATOR_VERSION)
  }

  const setNodeInfo = async (device: DeviceSettings, token: string) => {
    try {
      incrementStep()

      const isValidVersion = await fetchAndValidateVersion(device, token)

      if (!isValidVersion) {
        setOnboardView(OnboardView.CONFIGURE)
        moveToOnboard()
        return
      }

      setActiveDevice({
        ...device,
        apiToken: token,
      })

      await checkSyncStatus(device.beaconUrl)
    } catch (e) {
      moveToOnboard()
    }
  }
  const checkSyncStatus = async (beaconNode: string) => {
    try {
      incrementStep()

      const { data } = await fetchSyncStatus(beaconNode)

      if (data.is_syncing) {
        setOnboardView(OnboardView.SETUP)
        moveToOnboard()
        return
      }

      moveToView(AppView.DASHBOARD)
    } catch (e) {
      moveToOnboard()
    }
  }
  const finishInit = useCallback(
    (token?: string) => {
      if (storedDevice && token) {
        toggleAuthModal(false)
        void setNodeInfo(storedDevice, token)
        setReady(true)
      }
    },
    [storedDevice],
  )

  const closeModal = () => {
    toggleAuthModal(false)
    moveToView(AppView.ONBOARD)
  }

  useEffect(() => {
    if (isReady) return

    setAlias(aliases)

    if (!storedDevice?.apiToken || !username || !devices) {
      moveToView(AppView.ONBOARD)
      return
    }
    setUserName(username)
    setDevices(devices)
    toggleAuthModal(true)
  }, [aliases, storedDevice, devices, username, isReady])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <SessionAuthModal
        mode={UiMode.LIGHT}
        onClose={closeModal}
        onSuccess={finishInit}
        encryptedToken={storedDevice?.apiToken}
        isOpen={isAuthModal}
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

export default InitScreen
