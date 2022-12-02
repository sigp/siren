import { useRecoilState } from 'recoil'
import { uiMode } from '../recoil/atoms'
import useLocalStorage from './useLocalStorage'
import { UiThemeStorage } from '../types/storage'
import { Storage, UiMode } from '../constants/enums'

const useUiMode = (): { mode: UiMode; toggleUiMode: () => void } => {
  const [mode, setMode] = useRecoilState(uiMode)
  const [, setThemeStorage] = useLocalStorage<UiThemeStorage>(Storage.UI, undefined)

  const toggleUiMode = () => {
    const theme = mode === UiMode.LIGHT ? UiMode.DARK : UiMode.LIGHT
    setMode(theme)
    setThemeStorage(theme)
  }

  return {
    mode,
    toggleUiMode,
  }
}

export default useUiMode
