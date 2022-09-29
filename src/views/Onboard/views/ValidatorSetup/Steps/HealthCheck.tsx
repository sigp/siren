import Typography from '../../../../../components/Typography/Typography';
import DeviceHealth from '../../../../../components/HealthCheck/DeviceHealth';
import { Suspense } from 'react';
import NetworkHealth from '../../../../../components/HealthCheck/NetworkHealth';
import HealthOverview from '../../../../../components/HealthCheck/HealthOverview';
import Button, { ButtonFace } from '../../../../../components/Button/Button';
import { useSetRecoilState } from 'recoil';
import { onBoardView, setupStep } from '../../../../../recoil/atoms';
import { OnboardView, SetupSteps } from '../../../../../constants/enums';
import useLocalStorage from '../../../../../hooks/useLocalStorage';
import { HealthCheckStorage } from '../../../../../types/storage';

const HealthCheck = () => {
  const setView = useSetRecoilState(onBoardView);
  const setStep = useSetRecoilState(setupStep);
  const [, setHealthChecked] = useLocalStorage<HealthCheckStorage>('health-check', undefined)

  const viewConfig = () => setView(OnboardView.CONFIGURE)
  const viewSync = () => {
    setHealthChecked(true)
    setStep(SetupSteps.SYNC)
  }

  return (
    <div className='w-full h-full py-12 px-6 overflow-scroll @1200:overflow-hidden @1200:py-0 @1200:px-0 @1024:flex @1024:items-center @1024:justify-center'>
      <div className='w-full max-w-1142'>
        <div onClick={viewConfig} className='cursor-pointer flex space-x-2 items-center'>
          <i className='text-caption2 bi-arrow-left' />
          <Typography type='text-caption2' className='uppercase'>
            Configure / <span className='font-bold'>health check</span>
          </Typography>
        </div>
        <Typography
          type='text-subtitle2'
          fontWeight='font-light'
          color='text-transparent'
          className='primary-gradient-text md:text-subtitle1'
        >
          Validator Health Check
        </Typography>
        <hr className='w-full h-px border-dark100 my-2' />
        <Suspense fallback={<div>Loading...</div>}>
          <DeviceHealth />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <NetworkHealth />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <HealthOverview />
        </Suspense>
        <Button onClick={viewSync} className="mt-4 h-8 w-32 space-x-4 p-0 items-center justify-center" type={ButtonFace.SECONDARY}>
          <Typography fontWeight="font-light" color="text-white">Continue</Typography>
          <i className="bi-arrow-right" />
        </Button>
      </div>
    </div>
  )
}

export default HealthCheck
