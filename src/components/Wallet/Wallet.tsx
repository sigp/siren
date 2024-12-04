import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDisconnect, useSwitchChain } from 'wagmi'
import copyToClipboard from '../../../utilities/copyToClipboard'
import formatChainId from '../../../utilities/formatChainId'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import WalletDefault from '../../assets/images/wallet.svg'
import { BalanceReturn } from '../../hooks/useAccountBalance'
import useClickOutside from '../../hooks/useClickOutside'
import { BeaconNodeSpecResults } from '../../types/beacon'
import { ChainWithIcon } from '../../types/wallet'
import Typography from '../Typography/Typography'

export interface WalletProps {
  beaconSpec: BeaconNodeSpecResults
  balanceData: BalanceReturn
  chain: ChainWithIcon
  address: string
  currency: {
    prefix: string
    rate: number | undefined
  }
}

const Wallet: FC<WalletProps> = ({ currency, beaconSpec, chain, address, balanceData }) => {
  const { t } = useTranslation()
  const { rate, prefix } = currency
  const { formatted, symbol } = balanceData
  const { id, iconUrl, hasIcon, name } = chain
  const ethRate = Math.round(rate || 0) * (Number(formatted) || 0)
  const [isOpen, setOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { DEPOSIT_NETWORK_ID } = beaconSpec
  const { ref } = useClickOutside(() => setOpen(false))
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const chainId = formatChainId(String(id))
  const formattedAddress = formatEthAddress(address, 4)

  const disconnectWallet = () => disconnect()

  const copyAddress = async () => {
    try {
      const isCopied = await copyToClipboard(address)

      if (isCopied) {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const chevron = {
    up: {
      rotate: 180,
      transition: {
        type: 'spring',
        duration: 0.2,
      },
    },
    down: {
      rotate: 0,
    },
  }

  const isValidNetwork = Number(DEPOSIT_NETWORK_ID) === id

  const openWallet = () => setOpen(true)

  const switchNetwork = () => switchChain({ chainId: Number(DEPOSIT_NETWORK_ID) })

  return (
    <div ref={ref as any} className='z-10 h-full relative'>
      <div
        onClick={openWallet}
        className='relative z-20 flex items-center space-x-4 justify-between w-52 h-full py-2 px-4 cursor-pointer max-h-full border-l-style'
      >
        <div className='relative'>
          <WalletDefault className='h-10 w-10 rounded-full' />
          {!isValidNetwork && (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className='transition-all duration-300 ease-in w-4 h-4 bg-red-600 border border-white rounded-full absolute top-0 -right-1'
            />
          )}
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div>
            <Typography isUpperCase isBold type='text-tiny' family='font-roboto'>
              {chainId}
            </Typography>
            <Typography isBold type='text-caption1' color='text-dark500' family='font-roboto'>
              {formattedAddress}
            </Typography>
          </div>
          <motion.div
            animate={isOpen ? 'up' : 'down'}
            initial='down'
            exit='down'
            variants={chevron}
          >
            <i className='bi bi-chevron-down text-caption1 dark:text-dark300' />
          </motion.div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute w-[256px] top-full translate-y-1 left-1/2 -translate-x-1/2'>
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='w-full bg-white dark:bg-dark750 shadow-2xl px-4 py-1'
          >
            <div className='cursor-pointer px-2 py-4 group border-b-style last:border-none flex items-center space-x-2'>
              <div className='w-2 h-2 bg-success rounded-full' />
              <div className='flex group items-center space-x-2' onClick={copyAddress}>
                <Typography isBold type='text-caption1' color='text-dark500' family='font-roboto'>
                  {formattedAddress}
                </Typography>
                <i className='bi bi-subtract group-hover:scale-90 text-caption1 text-dark400' />
                {isCopied && (
                  <Typography isBold type='text-tiny' color='text-dark500' family='font-roboto'>
                    {t('copied')}
                  </Typography>
                )}
              </div>
            </div>
            <div className='cursor-pointer px-2 py-4 group border-b-style last:border-none flex items-center space-x-1'>
              {isValidNetwork ? (
                <>
                  {hasIcon && iconUrl && (
                    <Image
                      alt={name ?? 'Chain icon'}
                      src={iconUrl}
                      style={{ width: 12, height: 12 }}
                    />
                  )}
                  <div className='flex space-x-2'>
                    <Typography
                      isBold
                      type='text-caption1'
                      color='text-dark500'
                      darkMode='dark:text-dark100'
                      family='font-roboto'
                    >
                      {`${Number(formatted).toFixed(2)} ${symbol}`}
                    </Typography>
                    <Typography
                      isBold
                      type='text-caption1'
                      color='text-dark300'
                      darkMode='dark:text-dark500'
                      family='font-roboto'
                    >
                      {`${prefix} ${formatLocalCurrency(ethRate.toFixed(2))}`}
                    </Typography>
                  </div>
                </>
              ) : (
                <div onClick={switchNetwork} className='w-full flex items-center space-x-3'>
                  <div className='w-7 h-7 flex-none bg-red-50 flex items-center justify-center rounded-full'>
                    <i className='text-error text-caption1 bi-exclamation-triangle-fill' />
                  </div>
                  <Typography type='text-caption1.5' color='text-error' darkMode='dark:text-error'>
                    {t('wrongNetwork')}
                  </Typography>
                </div>
              )}
            </div>
            <div
              onClick={disconnectWallet}
              className='cursor-pointer hover:scale-95 transition duration-200 ease-in-out space-x-2 px-2 py-4 group border-b-style last:border-none flex items-center'
            >
              <i className='bi bi-box-arrow-right text-dark500' />
              <Typography isBold type='text-caption1' color='text-dark500' family='font-roboto'>
                {t('disconnect')}
              </Typography>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Wallet
