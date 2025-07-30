import { motion } from 'framer-motion'
import { FC } from 'react'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import Typography from '../Typography/Typography'

export interface EpochProgressBarProps {
  syncData: SyncData
  beaconSpec: BeaconNodeSpecResults
}

const EpochProgressBar: FC<EpochProgressBarProps> = ({ syncData, beaconSpec }) => {
  const {
    beaconSync: { headSlot, currentEpoch },
  } = syncData
  const { SLOTS_PER_EPOCH } = beaconSpec

  const currentSlotInEpoch = headSlot % SLOTS_PER_EPOCH
  const progressPercentage = (currentSlotInEpoch / SLOTS_PER_EPOCH) * 100

  return (
    <div className='w-full h-8 px-4 md:px-0 flex items-center space-x-3 border-b border-dark200 dark:border-dark500'>
      <div className='flex items-center space-x-2 min-w-0 flex-1'>
        <div className='flex-1 min-w-0'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className='overflow-hidden w-full h-2 bg-dark100 dark:bg-dark700 rounded-full'
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='primary-gradient-l-r h-full rounded-full'
            />
          </motion.div>
        </div>
        <div className='flex items-center space-x-2 whitespace-nowrap'>
          <Typography
            type='text-caption2'
            color='text-dark500'
            darkMode='dark:text-dark400'
            className='text-xs'
          >
            {currentSlotInEpoch}/{SLOTS_PER_EPOCH}
          </Typography>
          <Typography
            type='text-caption2'
            color='text-primary'
            darkMode='dark:text-primary'
            className='text-xs font-medium'
          >
            Epoch {currentEpoch}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default EpochProgressBar
