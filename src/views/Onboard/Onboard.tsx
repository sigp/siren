import { useRecoilState } from 'recoil'
import { onBoardView } from '../../recoil/atoms'
import { OnboardView } from '../../constants/enums'
import SelectProvider from './views/SelectProvider'
import ConfigureConnection from './views/ConfigureConnection'
import ValidatorSetup from './views/ValidatorSetup/ValidatorSetup'
import SessionConfig from './views/SessionConfig'
import { useEffect } from 'react'

const Onboard = () => {
  const [view, setView] = useRecoilState(onBoardView)

  useEffect(() => {
    return () => {
      setView(OnboardView.CONFIGURE)
    }
  }, [])

  const renderView = () => {
    switch (view) {
      case OnboardView.CONFIGURE:
        return <ConfigureConnection />
      case OnboardView.SETUP:
        return <ValidatorSetup />
      case OnboardView.SESSION:
        return <SessionConfig />
      default:
        return <SelectProvider />
    }
  }

  return <div className='relative h-screen w-screen overflow-hidden flex'>{renderView()}</div>
}

export default Onboard
