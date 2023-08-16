import Spinner from '../components/Spinner/Spinner'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { appView, uiMode } from '../recoil/atoms'
import { AppView, UiMode } from '../constants/enums'
import { useLayoutEffect } from 'react'
import addClassString from '../utilities/addClassString'

const ChangeScreen = () => {
  const mode = useRecoilValue(uiMode)
  const className = addClassString('w-screen h-screen flex items-center justify-center', [
    mode === UiMode.DARK && 'dark',
  ])
  const setAppView = useSetRecoilState(appView)

  useLayoutEffect(() => {
    setAppView(AppView.INIT)
  }, [])

  return (
    <div className={className}>
      <div className='bg-white dark:bg-darkPrimary w-screen h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    </div>
  )
}

export default ChangeScreen
