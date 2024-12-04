import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MiningSvg from '../../../../../assets/images/smart-contract-full.svg'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { KeyStoreData } from '../../../../../hooks/useLodestarDepositData'
import { DepositData, TxHash, TxStatus, ValidatorCandidate } from '../../../../../types'
import { BeaconNodeSpecResults } from '../../../../../types/beacon'
import FlexedOverflow from '../../../../FlexedOverflow/FlexedOverflow'
import Typography from '../../../../Typography/Typography'
import ValidatorDepositImport from '../../../../ValidatorDepositImport/ValidatorDepositImport'
import ValidatorDepositRow from '../../../../ValidatorDepositRow/ValidatorDepositRow'
import AcceptRisks from './AcceptRisks'

export interface MultiDepositsProps {
  candidates: ValidatorCandidate[]
  sharedKeystorePassword: string | undefined
  sharedWithdrawalCredentials: string | undefined
  beaconSpec: BeaconNodeSpecResults
  mnemonic: string
}

const MultiDeposits: FC<MultiDepositsProps> = ({
  candidates,
  mnemonic,
  sharedWithdrawalCredentials,
  sharedKeystorePassword,
  beaconSpec,
}) => {
  const { t } = useTranslation()
  const { DEPOSIT_NETWORK_ID } = beaconSpec
  const [isAcknowledgeRisk, setIsAcknowledgeRisk] = useState(false)
  const [depositData, setDepositData] = useState<DepositData[]>([])

  const acknowledgeRisk = () => setIsAcknowledgeRisk(true)
  const storeDepositInfo = (
    txHash: TxHash,
    keyStore: KeyStoreData,
    pubKey: string,
    mnemonicIndex: number,
  ) => {
    setDepositData((prev) => [
      ...prev,
      { txHash, keyStore, pubKey, mnemonicIndex, status: 'pending' },
    ])
  }

  const updateDepositInfoStatus = (pubKey: string, status: TxStatus) => {
    const index = depositData.findIndex((deposit) => deposit.pubKey === pubKey)
    if (index !== -1) {
      const updatedDeposits = [...depositData]
      updatedDeposits[index] = {
        ...updatedDeposits[index],
        status,
      }
      setDepositData(updatedDeposits)
    }
  }

  const removeTransaction = (txHash: TxHash) => {
    setDepositData((prev) => prev.filter((data) => data.txHash !== txHash))
  }

  return (
    <div className='relative flex pt-8 w-full h-full'>
      <div className='flex-1 flex flex-col space-y-8'>
        <div>
          <Typography type='text-caption1'>
            {t('validatorManagement.signAndDeposit.title')} --
          </Typography>
          <Typography type='text-subtitle2' fontWeight='font-light'>
            {t('validatorManagement.signAndDeposit.subTitle')}
          </Typography>
        </div>
        <div className='max-w-[80%] flex-1 flex flex-col'>
          {isAcknowledgeRisk ? (
            <>
              <div className='w-full border-style flex items-center justify-between p-4 flex space-x-2'>
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
              <FlexedOverflow className='border-b-style'>
                {candidates.map((validator, index) => (
                  <ValidatorDepositRow
                    key={index}
                    data={depositData.find((data) => data.mnemonicIndex === validator.index)}
                    beaconSpec={beaconSpec}
                    onDeposit={storeDepositInfo}
                    mnemonic={mnemonic}
                    candidate={{
                      ...validator,
                      keyStorePassword: sharedKeystorePassword || validator.keyStorePassword,
                      withdrawalCredentials:
                        sharedWithdrawalCredentials || validator.withdrawalCredentials,
                    }}
                  />
                ))}
              </FlexedOverflow>
            </>
          ) : (
            <AcceptRisks onAccept={acknowledgeRisk} beaconSpec={beaconSpec} />
          )}
        </div>
      </div>
      <div className='w-[500px] relative h-full flex flex-col'>
        <div className='w-full border-b-style pb-3'>
          <Typography>{t('validatorManagement.transactionStatus')}</Typography>
        </div>
        {depositData.length ? (
          <FlexedOverflow isAutoScroll className='space-y-3 pt-3'>
            {depositData.map((data, index) => (
              <ValidatorDepositImport
                key={index}
                onUpdateStatus={updateDepositInfoStatus}
                onRetryTx={removeTransaction}
                depositData={data}
                depositNetworkId={DEPOSIT_NETWORK_ID}
              />
            ))}
          </FlexedOverflow>
        ) : (
          <div className='w-full flex-1'>
            <div className='w-full h-full border-style flex items-center justify-center'>
              <MiningSvg className='ease-in duration-500 transition-colors w-[300px] h-[300px]' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiDeposits
