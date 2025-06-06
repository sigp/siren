import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MiningSvg from '../../../../../assets/images/smart-contract-full.svg'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { Status } from '../../../../../constants/enums'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { DepositData, TxHash, ValidatorCandidate } from '../../../../../types'
import { BeaconNodeSpecResults } from '../../../../../types/beacon'
import Button, { ButtonFace } from '../../../../Button/Button'
import Typography from '../../../../Typography/Typography'
import ValidatorDepositImport from '../../../../ValidatorDepositImport/ValidatorDepositImport'
import ValidatorDepositRow from '../../../../ValidatorDepositRow/ValidatorDepositRow'
import AcceptRisks from './AcceptRisks'

export interface MultiDepositsProps {
  candidates: ValidatorCandidate[]
  sharedKeystorePassword: string | undefined
  sharedWithdrawalCredentials: string | undefined
  sharedSuggestedFee: string | undefined
  beaconSpec: BeaconNodeSpecResults
  mnemonic: string
}

const MultiDeposits: FC<MultiDepositsProps> = ({
  candidates,
  mnemonic,
  sharedWithdrawalCredentials,
  sharedKeystorePassword,
  sharedSuggestedFee,
  beaconSpec,
}) => {
  const { t } = useTranslation()
  const { DEPOSIT_NETWORK_ID } = beaconSpec
  const [isAcknowledgeRisk, setIsAcknowledgeRisk] = useState(false)
  const [depositData, setDepositData] = useState<DepositData[]>([])

  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()
  const {
    parentRef: parentStatusRef,
    targetChildRef: childStatusRef,
    maxHeight: statusMaxHeight,
  } = useMaxHeight()

  const acknowledgeRisk = () => setIsAcknowledgeRisk(true)
  const storeDepositInfo = (data: DepositData) => {
    setDepositData((prev) => [data, ...prev])
  }

  const updateDepositInfoStatus = (pubKey: string, status: Status) => {
    setDepositData((prev) => {
      const index = prev.findIndex((deposit) => deposit.pubKey === pubKey)
      if (index === -1) return prev
      const updatedDeposits = [...prev]
      updatedDeposits[index] = {
        ...updatedDeposits[index],
        status,
      }
      return updatedDeposits
    })
  }

  const removeTransaction = (txHash: TxHash) => {
    setDepositData((prev) => prev.filter((data) => data.txHash !== txHash))
  }

  return (
    <div className='relative flex flex-col space-y-8 lg:space-y-0 lg:flex-row pt-8 w-full h-full'>
      <div ref={parentRef} className='flex-1 flex flex-col space-y-8'>
        <div>
          <Typography type='text-caption1'>
            {t('validatorManagement.signAndDeposit.title')} --
          </Typography>
          <Typography type='text-subtitle2' fontWeight='font-light'>
            {t('validatorManagement.signAndDeposit.subTitle')}
          </Typography>
        </div>
        <div
          ref={targetChildRef}
          style={{ maxHeight: maxHeight }}
          className='w-full lg:max-w-[80%] flex flex-col'
        >
          {isAcknowledgeRisk ? (
            <>
              <div className='w-full border-style border-b-0 flex items-center justify-between p-4 flex space-x-2'>
                <div className='w-[250px] border-r border-r-style pr-2 flex items-center space-x-2'>
                  <div className='w-4 h-4'>
                    <ValidatorLogo className='text-dark900 dark:text-dark200' />
                  </div>
                  <Typography type='text-caption1'>{t('validators')}</Typography>
                </div>
                <div className='border-r dark:border-r-primary pr-2'>
                  <Typography>{candidates.length}</Typography>
                </div>
              </div>
              <div className='w-full h-full overflow-auto border-style'>
                {candidates.map((validator) => (
                  <ValidatorDepositRow
                    key={validator.pubKey}
                    data={depositData.find((data) => data.mnemonicIndex === validator.index)}
                    beaconSpec={beaconSpec}
                    onDeposit={storeDepositInfo}
                    mnemonic={mnemonic}
                    candidate={{
                      ...validator,
                      keyStorePassword: sharedKeystorePassword || validator.keyStorePassword,
                      withdrawalCredentials:
                        sharedWithdrawalCredentials || validator.withdrawalCredentials,
                      suggestedFeeRecipient: sharedSuggestedFee || validator.suggestedFeeRecipient,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <AcceptRisks onAccept={acknowledgeRisk} beaconSpec={beaconSpec} />
          )}
        </div>
      </div>
      <div ref={parentStatusRef} className='w-full max-w-[500px] relative flex-1 flex flex-col'>
        <div className='w-full border-b-style pb-3'>
          <Typography>{t('validatorManagement.transactionStatus')}</Typography>
        </div>
        <div
          ref={childStatusRef}
          style={{ maxHeight: statusMaxHeight }}
          className='w-full flex flex-col'
        >
          {depositData.length ? (
            <>
              <div className='space-y-3 overflow-auto h-full w-full pt-3'>
                {depositData.map((data) => (
                  <ValidatorDepositImport
                    key={data.pubKey}
                    mnemonic={mnemonic}
                    onUpdateStatus={updateDepositInfoStatus}
                    onRetryTx={removeTransaction}
                    depositData={data}
                    depositNetworkId={Number(DEPOSIT_NETWORK_ID)}
                  />
                ))}
              </div>
              <Button
                className='mt-8 w-full'
                type={ButtonFace.SECONDARY}
                href='/dashboard/validators'
              >
                {t('validatorManagement.manageValidators')}
              </Button>
            </>
          ) : (
            <div className='w-full flex-1'>
              <div className='w-full h-full border-style flex items-center justify-center'>
                <MiningSvg className='ease-in duration-500 transition-colors w-[300px] h-[300px]' />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MultiDeposits
