import { useRecoilState } from 'recoil';
import { Storage, UiMode } from '../constants/enums';
import { uiMode } from '../recoil/atoms';
import { UiThemeStorage } from '../types/storage';
import useLocalStorage from './useLocalStorage';

const useUiMode = (): { mode: UiMode; toggleUiMode: (uiMode?: UiMode) => void } => {
  const [mode, setMode] = useRecoilState(uiMode)
  const [, setThemeStorage] = useLocalStorage<UiThemeStorage>(Storage.UI, undefined)

  const toggleUiMode = (uiMode?: UiMode | undefined) => {
    const theme = uiMode || (mode === UiMode.LIGHT ? UiMode.DARK : UiMode.LIGHT)
    if (theme === UiMode.DARK) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1E1E1E';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
    setMode(theme)
    setThemeStorage(theme)
  }

  return {
    mode,
    toggleUiMode,
  }
}

export default useUiMode
