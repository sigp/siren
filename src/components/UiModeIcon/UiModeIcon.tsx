import { UiMode } from '../../constants/enums'
import { ReactComponent as ToggleSun } from '../../assets/images/sun.svg'
import { ReactComponent as ToggleMoon } from '../../assets/images/moon.svg'
import { FC } from 'react'
import addClassString from '../../utilities/addClassString'

export interface UiModeIconProps {
  mode?: UiMode
  onClick?: () => void
  className?: string
}

const UiModeIcon: FC<UiModeIconProps> = ({ mode, onClick, className }) => {
  const classes = addClassString('w-4 h-4 cursor-pointer text-dark400', [className])
  return (
    <div onClick={onClick} className={classes}>
      {mode === UiMode.LIGHT ? <ToggleSun /> : <ToggleMoon />}
    </div>
  )
}

export default UiModeIcon
