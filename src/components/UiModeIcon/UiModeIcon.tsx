import { UiMode } from '../../constants/enums'
import { ReactComponent as ToggleSun } from '../../assets/images/sun.svg'
import { ReactComponent as ToggleMoon } from '../../assets/images/moon.svg'
import { FC } from 'react'

export interface UiModeIconProps {
  mode?: UiMode
  onClick?: () => void
}

const UiModeIcon: FC<UiModeIconProps> = ({ mode, onClick }) => {
  return (
    <div onClick={onClick} className='w-4 h-4 cursor-pointer text-dark400'>
      {mode === UiMode.LIGHT ? <ToggleSun /> : <ToggleMoon />}
    </div>
  )
}

export default UiModeIcon
