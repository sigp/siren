import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import displayToast from '../../../../../../utilities/displayToast'
import { ToastType, ValidatorCandidate } from '../../../../../types'
import Typography from '../../../../Typography/Typography'
import StepOptions, { StepOptionsProps } from '../../StepOptions'
import ValSetupTable, { ValSetupTableProps } from './ValSetupTable'

export interface ValidatorSetupProps
  extends Pick<ValSetupTableProps, 'candidates'>,
    Pick<StepOptionsProps, 'onNextStep'> {
  onValidatorChange: (vals: ValidatorCandidate[]) => void
}

const ValidatorSetup: FC<ValidatorSetupProps> = ({ candidates, onValidatorChange, onNextStep }) => {
  const { t } = useTranslation()
  const getRandomId = () => uuidv4().toString()

  const addNewValidator = () =>
    onValidatorChange([
      ...candidates,
      {
        id: getRandomId(),
        index: undefined,
        keyStorePassword: undefined,
        name: undefined,
        withdrawalCredentials: undefined,
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
        index: undefined,
        keyStorePassword: undefined,
        name: undefined,
        withdrawalCredentials: undefined,
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
        onAddNewCandidate={addNewValidator}
        onRemoveCandidate={removeValidatorById}
        onUpdateCandidate={updateValidator}
        onQuickSetCandidates={quickSetValidators}
        onRemoveLastCandidate={removeLastValidator}
      />
      {candidates.length > 0 ? <StepOptions onNextStep={onNextStep} /> : null}
    </div>
  )
}

export default ValidatorSetup
