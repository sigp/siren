import Typography from '../../../../../components/Typography/Typography'
import DeviceHealth from '../../../../../components/HealthCheck/DeviceHealth'
import { Suspense } from 'react'
import NetworkHealth from '../../../../../components/HealthCheck/NetworkHealth'

const HealthCheck = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='w-full max-w-6xl'>
        <div className='flex space-x-2 items-center'>
          <i className='text-caption2 bi-arrow-left' />
          <Typography type='text-caption2' className='uppercase'>
            Configure / <span className='font-bold'>health check</span>
          </Typography>
        </div>
        <Typography
          type='text-subtitle1'
          fontWeight='font-light'
          color='text-transparent'
          className='primary-gradient-text'
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
      </div>
    </div>
  )
}

export default HealthCheck
