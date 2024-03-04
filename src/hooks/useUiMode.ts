import { useRecoilState } from 'recoil'
import { Storage, UiMode } from '../constants/enums'
import { uiMode } from '../recoil/atoms'
import { UiThemeStorage } from '../types/storage'
import useLocalStorage from './useLocalStorage'

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
