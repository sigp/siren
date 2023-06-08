import Typography from '../components/Typography/Typography'
import useLocalStorage from '../hooks/useLocalStorage'
import { Endpoint, ValAliases } from '../types'
import { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import {
  appView,
  userName,
  onBoardView,
  beaconNodeEndpoint,
  beaconVersionData,
  apiToken,
  validatorVersionData,
  validatorClientEndpoint,
  validatorAliases,
} from '../recoil/atoms'
import { AppView, OnboardView, UiMode } from '../constants/enums'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import { fetchVersion } from '../api/lighthouse'
import { fetchBeaconVersion, fetchSyncStatus } from '../api/beacon'
import { useTranslation } from 'react-i18next'
import { UsernameStorage } from '../types/storage'
import AppDescription from '../components/AppDescription/AppDescription'
import SessionAuthModal from '../components/SessionAuthModal/SessionAuthModal'
import isRequiredVersion from '../utilities/isRequiredVersion'
import { REQUIRED_VALIDATOR_VERSION } from '../constants/constants'
import formatEndpoint from '../utilities/formatEndpoint'

const InitScreen = () => {
  const { t } = useTranslation()
  const [isReady, setReady] = useState(false)
  const [step, setStep] = useState<number>(0)
  const setView = useSetRecoilState(appView)
  const [isAuthModal, toggleAuthModal] = useState(false)
  const setOnboardView = useSetRecoilState(onBoardView)
  const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  const setApiToken = useSetRecoilState(apiToken)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const setAlias = useSetRecoilState(validatorAliases)
  const [validatorClient] = useLocalStorage<Endpoint | undefined>('validatorClient', undefined)
  const [beaconNode] = useLocalStorage<Endpoint | undefined>('beaconNode', undefined)
  const [encryptedToken] = useLocalStorage<string | undefined>('api-token', undefined)
  const [username] = useLocalStorage<UsernameStorage>('username', undefined)
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})

  const moveToView = (view: AppView) => {
    setTimeout(() => {
      setView(view)
    }, 1000)
  }
  const moveToOnboard = () => moveToView(AppView.ONBOARD)

  const incrementStep = () => setStep((prev) => prev + 1)
  const setNodeInfo = async (validatorClient: Endpoint, beaconNode: Endpoint, token: string) => {
    const formattedVcEndpoint = formatEndpoint(validatorClient) as string
    const formattedBnEndpoint = formatEndpoint(beaconNode) as string
    try {
      incrementStep()

      const [vcResult, beaconResult] = await Promise.all([
        fetchVersion(formattedVcEndpoint, token),
        fetchBeaconVersion(formattedBnEndpoint),
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

        await checkSyncStatus(formattedBnEndpoint)
      }
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
      if (validatorClient && beaconNode && token) {
        toggleAuthModal(false)
        void setNodeInfo(validatorClient, beaconNode, token)
        setReady(true)
      }
    },
    [validatorClient, beaconNode, encryptedToken],
  )

  useEffect(() => {
    if (isReady) return

    setAlias(aliases)

    if (!validatorClient || !beaconNode || !encryptedToken || !username) {
      moveToView(AppView.ONBOARD)
      return
    }
    setUserName(username)
    toggleAuthModal(true)
  }, [validatorClient, beaconNode, encryptedToken, aliases])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <SessionAuthModal mode={UiMode.LIGHT} onSuccess={finishInit} isOpen={isAuthModal} />
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
