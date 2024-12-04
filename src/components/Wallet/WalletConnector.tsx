import { Connector } from '@wagmi/core'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import useClickOutside from '../../hooks/useClickOutside'
import useWalletConnectors from '../../hooks/useWalletConnectors'
import { ToastType } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import WalletConnectorOption from '../WalletConnectorOption/WalletConnectorOption'

const WalletConnector = () => {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const { connectors, connect, error } = useWalletConnectors()
  const openConnectorMenu = () => setOpen(true)
  const connectWallet = (connector: Connector) => connect({ connector })
  const { ref } = useClickOutside(() => setOpen(false))

  useEffect(() => {
    if (error) {
      console.log(error)
      displayToast(t('unexpectedErrorWalletConnect'), ToastType.ERROR)
    }
  }, [error])

  return (
    <div ref={ref as any} className='relative h-full'>
      <div className='h-full flex items-center justify-center pr-4'>
        <Button onClick={openConnectorMenu} type={ButtonFace.TERTIARY}>
          {t('connectWallet')}
        </Button>
      </div>
      {isOpen ? (
        <div className='absolute w-[256px] top-full translate-y-1 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto'>
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='w-full bg-white dark:bg-dark750 shadow-2xl px-4 py-1'
          >
            {connectors.map((connector, index) => (
              <WalletConnectorOption
                key={index}
                index={index}
                connector={connector}
                onConnect={connectWallet}
              />
            ))}
          </motion.div>
        </div>
      ) : null}
    </div>
  )
}

export default WalletConnector
