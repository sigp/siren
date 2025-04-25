import { parseEther, parseUnits } from 'ethers'
import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import displayToast from '../../../../../../utilities/displayToast'
import { WalletPrefix } from '../../../../../constants/enums'
import { ToastType, ValidatorCandidate } from '../../../../../types'
import Typography from '../../../../Typography/Typography'
import StepOptions, { StepOptionsProps } from '../../StepOptions'
import ValSetupTable, { ValSetupTableProps } from './ValSetupTable'

export interface ValidatorSetupProps
  extends Pick<ValSetupTableProps, 'candidates'>,
    Pick<StepOptionsProps, 'onNextStep'> {
  onValidatorChange: (vals: ValidatorCandidate[]) => void
  minActivationBalance: bigint
}

const ValidatorSetup: FC<ValidatorSetupProps> = ({
  candidates,
  onValidatorChange,
  minActivationBalance,
  onNextStep,
}) => {
  const { t } = useTranslation()
  const getRandomId = () => uuidv4().toString()

  const baseDefaultValidator = {
    withdrawalPrefix: WalletPrefix.ONE,
    effectiveBalance: parseUnits(minActivationBalance.toString(), 'gwei'),
    index: undefined,
    keyStorePassword: undefined,
    name: undefined,
    withdrawalCredentials: '',
    suggestedFeeRecipient: '',
  }

  const isValidBalances = candidates.every(
    ({ effectiveBalance }) =>
      effectiveBalance >= parseEther('32') && effectiveBalance <= parseEther('2048'),
  )

  const addNewValidator = () =>
    onValidatorChange([
      ...candidates,
      {
        id: getRandomId(),
        ...baseDefaultValidator,
      },
    ])

  const removeLastValidator = () => onValidatorChange(candidates.slice(0, -1))

  const removeValidatorById = (_id: string) =>
    onValidatorChange(candidates.filter(({ id }) => id !== _id))

  const updateValidator = (id: string, data: ValidatorCandidate) => {
    const candidatesMap = new Map(candidates.map((item) => [item.id, item]))
    candidatesMap.set(id, data)
    onValidatorChange(Array.from(candidatesMap.values()))
  }

  const quickSetValidators = (e: ChangeEvent<HTMLInputElement>) => {
    const count = Number(e.target.value)

    if (isNaN(count) || count < 0) {
      return
    }

    if (count > 999) {
      displayToast(t('tooManyValidatorWarning'), ToastType.WARNING)
      return
    }

    onValidatorChange(
      Array.from({ length: Number(e.target.value) }, () => ({
        id: getRandomId(),
        ...baseDefaultValidator,
      })),
    )
  }

  return (
    <div className='w-full lg:h-full space-y-6'>
      <Typography type='text-caption1'>
        {t('validatorManagement.validatorSetup.title')} --
      </Typography>
      <div className='w-1/2 lg:w-1/3'>
        <Typography type='text-subtitle3' className='lg:text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.validatorSetup.subTitle')}
        </Typography>
      </div>
      <ValSetupTable
        candidates={candidates}
        minActivationBalance={minActivationBalance}
        onAddNewCandidate={addNewValidator}
        onRemoveCandidate={removeValidatorById}
        onUpdateCandidate={updateValidator}
        onQuickSetCandidates={quickSetValidators}
        onRemoveLastCandidate={removeLastValidator}
      />
      {candidates.length > 0 ? (
        <StepOptions isDisabledNext={!isValidBalances} onNextStep={onNextStep} />
      ) : null}
    </div>
  )
}

export default ValidatorSetup
