import { Connector } from '@wagmi/core'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { FC } from 'react'
import Typography from '../Typography/Typography'

export interface WalletConnectorOptionProps {
  onConnect: (connector: Connector) => void
  connector: Connector
  index: number
}

const WalletConnectorOption: FC<WalletConnectorOptionProps> = ({ onConnect, connector, index }) => {
  const connect = () => onConnect(connector)

  return (
    <div
      onClick={connect}
      className='cursor-pointer px-2 py-4 group border-b-style last:border-none flex items-center'
    >
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 * index }}
        className='w-full flex space-x-2 items-center rounded-lg group-hover:bg-dark600 p-1'
      >
        {connector.icon ? (
          <Image width={16} height={16} src={connector.icon} alt='icon' />
        ) : (
          <div className='w-4 h-4 rounded-full bg-gradient-to-r from-primary to-tertiary' />
        )}
        <Typography type='text-caption'>{connector.name}</Typography>
      </motion.div>
    </div>
  )
}

export default WalletConnectorOption
