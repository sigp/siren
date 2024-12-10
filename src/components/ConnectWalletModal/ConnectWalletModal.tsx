import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import { Connector } from 'wagmi'
import useDivDimensions from '../../hooks/useDivDimensions'
import useWalletConnectors from '../../hooks/useWalletConnectors'
import { isWalletConnectModal } from '../../recoil/atoms'
import RodalModal from '../RodalModal/RodalModal'
import TopographyCanvas from '../Topography/Topography'
import Typography from '../Typography/Typography'
import WalletConnectorOption from '../WalletConnectorOption/WalletConnectorOption'

const ConnectWalletModal = () => {
  const { t } = useTranslation()
  const { connectors, connect, isSuccess } = useWalletConnectors()
  const { ref, dimensions, measure } = useDivDimensions()
  const [isOpen, setIsOpen] = useRecoilState(isWalletConnectModal)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isReady) {
      measure()
    }
  }, [isReady])

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false)
    }
  }, [isSuccess])

  const finishAnim = () => setIsReady(true)

  const closeModal = () => setIsOpen(false)

  const connectWallet = (connector: Connector) => connect({ connector })

  return (
    <RodalModal
      onAnimationEnd={finishAnim as any}
      isVisible={isOpen}
      onClose={closeModal}
      styles={{ maxWidth: '600px' }}
    >
      <div ref={ref} className='w-full flex'>
        <div className='flex-1 overflow-hidden bg-gradient-to-b from-primary via-secondary to-tertiary relative'>
          <div className='absolute w-3/4 top-1/2 left-1/2 bg-primary80 rounded-lg -translate-y-1/2 p-2 -translate-x-1/2'>
            <Typography color='text-primary' className='text-center' darkMode='dark:text-primary'>
              {t('connectWallet')}
            </Typography>
          </div>
          {dimensions && isOpen && (
            <div className='opacity-30 h-full w-full'>
              <TopographyCanvas
                height={dimensions.height}
                width={dimensions.width}
                name='connectWallet'
                animate
              />
            </div>
          )}
        </div>
        <div className='w-[400px] p-4'>
          {isOpen &&
            connectors.map((connector, index) => (
              <WalletConnectorOption
                key={index}
                index={index}
                onConnect={connectWallet}
                connector={connector}
              />
            ))}
        </div>
      </div>
    </RodalModal>
  )
}

export default ConnectWalletModal
