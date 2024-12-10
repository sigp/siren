import { motion } from 'framer-motion'
import { FC } from 'react'

export interface ProgressBarProps {
  total: number
  position: number
}

const ProgressBar: FC<ProgressBarProps> = ({ total, position }) => {
  const percentage = (position / total) * 100

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ delay: 0.2 }}
      className='overflow-hidden w-full h-1'
    >
      <div
        style={{ width: `${percentage}%` }}
        className='ease-in primary-gradient-l-r transition-all delay-100 duration-500 h-full'
      />
    </motion.div>
  )
}

export default ProgressBar
