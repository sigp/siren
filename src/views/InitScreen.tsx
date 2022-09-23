import Typography from '../components/Typography/Typography'
import useLocalStorage from '../hooks/useLocalStorage'
import { Endpoint } from '../forms/ConfigConnectionForm'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { appView } from '../recoil/atoms'
import { AppView } from '../constants/enums'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

const InitScreen = () => {
  const [step, setStep] = useState<number>(0)
  const setView = useSetRecoilState(appView)
  const [validatorClient] = useLocalStorage<Endpoint | undefined>('validatorClient', undefined)
  const [beaconNode] = useLocalStorage<Endpoint | undefined>('beaconNode', undefined)

  useEffect(() => {
    if (!validatorClient || !beaconNode) {
      setView(AppView.ONBOARD)
      return
    }

    setStep((prev) => prev++)
  }, [validatorClient, beaconNode])

  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <div className='absolute top-0 left-0 w-full h-full bg-cover bg-lighthouse' />
      <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
        <LoadingSpinner />
      </div>
      <div className='z-10 relative h-full pl-12 pb-12 pt-12 md:pt-32 md:pl-24 xl:pl-32 md:pb-32 flex flex-col justify-between'>
        <div className='space-y-4'>
          <Typography fontWeight='font-light' type='text-subtitle3' color='text-dark100'>
            Initializing...
          </Typography>
          <div className='opacity-40'>
            {step >= 0 && (
              <>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  Fetching saved api endpoints...
                </Typography>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  Attempting to connect to Beacon Node...
                </Typography>
                <Typography isBold type='text-tiny' color='text-dark100'>
                  Attempting to connect to Validator Client...
                </Typography>
              </>
            )}
            <Typography isBold type='text-tiny' color='text-dark100'>
              ---
            </Typography>
            <div className='animate-blink h-3 w-1 bg-white text-dark100' />
          </div>
        </div>
        <div className='flex items-center space-x-10 md:space-x-20'>
          <div>
            <Typography fontWeight='font-light' type='text-caption2' color='text-white'>
              Ethereum Lighthouse
            </Typography>
            <Typography fontWeight='font-light' type='text-caption2' color='text-white'>
              Validator Client --
            </Typography>
          </div>
          <div className='opacity-40'>
            <Typography fontWeight='font-light' type='text-caption2' color='text-dark100'>
              Developed & Secured By:
            </Typography>
            <Typography fontWeight='font-light' type='text-caption2' color='text-dark100'>
              Sigma Prime
            </Typography>
          </div>
          <div className='opacity-40'>
            <Typography fontWeight='font-light' type='text-caption2' color='text-dark100'>
              Built on:
            </Typography>
            <Typography fontWeight='font-light' type='text-caption2' color='text-dark100'>
              Rust Programming Language
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitScreen
