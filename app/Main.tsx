import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import useSWR from 'swr';
import { fetchBeaconVersion, fetchSyncStatus } from '../src/api/beacon';
import { fetchVersion } from '../src/api/lighthouse';
import AppDescription from '../src/components/AppDescription/AppDescription';
import InfoBox, { InfoBoxType } from '../src/components/InfoBox/InfoBox';
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner';
import RodalModal from '../src/components/RodalModal/RodalModal';
import Typography from '../src/components/Typography/Typography';
import { REQUIRED_VALIDATOR_VERSION } from '../src/constants/constants';
import { AppView, OnboardView } from '../src/constants/enums';
import useLocalStorage from '../src/hooks/useLocalStorage';
import {
  activeDevice,
  appView,
  beaconVersionData,
  deviceSettings,
  onBoardView,
  userName,
  validatorAliases,
  validatorVersionData
} from '../src/recoil/atoms';
import { DeviceSettings, ValAliases } from '../src/types';
import { DeviceKeyStorage, DeviceListStorage, UsernameStorage } from '../src/types/storage';
import formatSemanticVersion from '../utilities/formatSemanticVersion';
import isRequiredVersion from '../utilities/isRequiredVersion';

export interface InitProps {
  beaconNodeVersion?: string | undefined
  apiTokenPath?: string | undefined
}

const Main:FC<InitProps> = ({beaconNodeVersion, apiTokenPath}) => {
  const { t } = useTranslation()
  const fetcher = url => axios.get(url).then(res => res.data);
  const {data} = useSWR('/api/lighthouse-version', fetcher)

  console.log(data)
  const configError = !beaconNodeVersion || !apiTokenPath
  const { major, minor, patch } = REQUIRED_VALIDATOR_VERSION
  const vcVersion = beaconNodeVersion ? formatSemanticVersion(beaconNodeVersion as string) : undefined;
  const versionError = true
  // const isVersion = beaconNodeVersion && isRequiredVersion(beaconNodeVersion, REQUIRED_VALIDATOR_VERSION)
  const isVersion = false

  console.log(isVersion)



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

  // useEffect(() => {
  //   if (isReady) return
  //
  //   setAlias(aliases)
  //
  //   if (!storedDevice?.apiToken || !username || !devices) {
  //     moveToView(AppView.ONBOARD)
  //     return
  //   }
  //   setUserName(username)
  //   setDevices(devices)
  //   toggleAuthModal(true)
  // }, [aliases, storedDevice, devices, username, isReady])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <RodalModal isVisible={configError}>
        <div className="p-6">
          <InfoBox type={InfoBoxType.ERROR}>
            <div className="space-y-4">
              <Typography type="text-caption1" color="text-error">Configuration Error</Typography>
              <Typography type="text-caption1">Siren was unable to establish a successful connection to designated...Please review your configuration file and make appropriate adjustments. For additional information refer to the Lighthouse Book.</Typography>
              <div className="border-b border-error w-fit cursor-pointer">
                <Typography type="text-caption1" color="text-error">Learn about Siren configuration here</Typography>
              </div>
            </div>
          </InfoBox>
        </div>
      </RodalModal>

      {vcVersion && (
        <RodalModal isVisible={versionError}>
          <div className="p-6">
            <InfoBox type={InfoBoxType.WARNING}>
              <div className="space-y-4">
                {/* <Typography type="text-caption1" color="text-error">Version Requirement Error</Typography> */}
                <Typography type="text-caption1">
                  Lighthouse version {vcVersion.major}.{vcVersion.minor}.{vcVersion.patch} is currently detected. For Siren to function properly, a minimum version of {major}.{minor}.{patch} for Lighthouse is required. Please ensure your Lighthouse version meets or exceeds this requirement before proceeding.
                </Typography>
                <div className="border-b border-error w-fit cursor-pointer">
                  <Typography type="text-caption1" color="text-error">Upgrade to latest Lighthouse here</Typography>
                </div>
              </div>
            </InfoBox>
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
