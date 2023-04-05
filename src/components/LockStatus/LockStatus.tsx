import addClassString from '../../utilities/addClassString'
import { FC } from 'react'

export interface LockStatusProps {
  status: boolean
  onClick?: () => void
}

const LockStatus: FC<LockStatusProps> = ({ status, onClick }) => {
  const classes = addClassString('bi text-dark400 cursor-pointer', [
    status && 'bi-lock-fill',
    !status && 'bi-unlock-fill',
  ])

  return <i onClick={onClick} className={classes} />
}

export default LockStatus
