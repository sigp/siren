import Typography from '../components/Typography/Typography'
import useLocalStorage from '../hooks/useLocalStorage'
import { Endpoint } from '../types'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import {
  apiToken,
  appView,
  beaconNodeEndpoint,
  beaconVersionData,
  isAppLockdown,
  onBoardView,
  userName,
  validatorClientEndpoint,
  validatorVersionData,
} from '../recoil/atoms'
import { AppView, OnboardView } from '../constants/enums'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import { fetchVersion } from '../api/lighthouse'
import { fetchBeaconVersion, fetchSyncStatus } from '../api/beacon'
import { useTranslation } from 'react-i18next'
import { UsernameStorage } from '../types/storage'
import AppDescription from '../components/AppDescription/AppDescription'
import isRequiredVersion from '../utilities/isRequiredVersion'
import { REQUIRED_VALIDATOR_VERSION } from '../constants/constants'
import CryptoJS from 'crypto-js'
import { ENCRYPT_KEY } from '../constants/window'

const InitScreen = () => {
  const { t } = useTranslation()
  const [isReady, setReady] = useState(false)
  const [step, setStep] = useState<number>(0)
  const setView = useSetRecoilState(appView)
  const setOnboardView = useSetRecoilState(onBoardView)
  const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  const setApiToken = useSetRecoilState(apiToken)
  const setAppLockdown = useSetRecoilState(isAppLockdown)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const [validatorClient] = useLocalStorage<Endpoint | undefined>('validatorClient', undefined)
  const [beaconNode] = useLocalStorage<Endpoint | undefined>('beaconNode', undefined)
  const [encryptedToken] = useLocalStorage<string | undefined>('api-token', undefined)
  const [username] = useLocalStorage<UsernameStorage>('username', undefined)

  const moveToView = (view: AppView) => {
    setTimeout(() => {
      setView(view)
    }, 1000)
  }

  const moveToOnboard = () => moveToView(AppView.ONBOARD)

  const incrementStep = () => setStep((prev) => prev + 1)
  const setNodeInfo = async (validatorClient: Endpoint, beaconNode: Endpoint, token: string) => {
    try {
      incrementStep()

      const [vcResult, beaconResult] = await Promise.all([
        fetchVersion(validatorClient, token),
        fetchBeaconVersion(beaconNode),
      ])

      const vcVersion = vcResult.data.data.version

      if (vcResult.status === 200 && beaconResult.status === 200) {
        if (!isRequiredVersion(vcVersion, REQUIRED_VALIDATOR_VERSION)) {
          setOnboardView(OnboardView.CONFIGURE)
          moveToOnboard()
          return
        }

        setBeaconVersion(beaconResult.data.data.version)
        setValidatorVersion(vcVersion)
        setBeaconNode(beaconNode)
        setValidatorClient(validatorClient)
        setApiToken(token)
        setAppLockdown(true)

        await checkSyncStatus(beaconNode)
      }
    } catch (e) {
      moveToOnboard()
    }
  }
  const checkSyncStatus = async (beaconNode: Endpoint) => {
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

  useEffect(() => {
    if (isReady) return

    if (!validatorClient || !beaconNode || !encryptedToken || !username) {
      moveToView(AppView.ONBOARD)
      return
    }
    setUserName(username)
    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, ENCRYPT_KEY).toString(
      CryptoJS.enc.Utf8,
    )
    void setNodeInfo(validatorClient, beaconNode, decryptedToken)
    setReady(true)
  }, [validatorClient, beaconNode, encryptedToken, isReady])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
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
