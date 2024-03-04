import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { OnboardView } from '../../constants/enums'
import { onBoardView } from '../../recoil/atoms'
import ConfigureConnection from './views/ConfigureConnection'
import SelectProvider from './views/SelectProvider'
import SessionConfig from './views/SessionConfig'
import ValidatorSetup from './views/ValidatorSetup/ValidatorSetup'

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
