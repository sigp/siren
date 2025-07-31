import { useRouter } from 'next/navigation'
import { FC, useEffect, useState, MouseEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import formatBalanceColor from '../../../utilities/formatBalanceColor'
import formatEthAddress from '../../../utilities/formatEthAddress'
import isBlsAddress from '../../../utilities/isBlsAddress'
import ValidatorLogo from '../../assets/images/validators.svg'
import { ValidatorModalView } from '../../constants/enums'
import { useAliasMigration } from '../../hooks/useAliasMigration'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useValidatorAliases } from '../../hooks/useValidatorAliases'
import useValidatorName from '../../hooks/useValidatorName'
import {
  activeValidatorId,
  isEditValidator,
  isValidatorDetail,
  processingBlsValidators,
} from '../../recoil/atoms'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import { ValAliases } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import StatusIcon from '../StatusIcon/StatusIcon'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import WithdrawalAddressText from '../WithdrawalAddress/WithdrawalAddressText'
import { TableView } from './ValidatorTable'

export interface ValidatorRowProps {
  validator: ValidatorInfo
  view?: TableView | undefined
}

const ValidatorRow: FC<ValidatorRowProps> = ({ validator, view }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isReady, setReady] = useState(false)
  const processingValidators = useRecoilValue(processingBlsValidators)
  const setActiveValidatorId = useSetRecoilState(activeValidatorId)
  const setIsEditValidator = useSetRecoilState(isEditValidator)
  const setValDetail = useSetRecoilState(isValidatorDetail)
  const { pubKey, index, balance, rewards, status, withdrawalAddress, name } = validator
  const rewardColor = formatBalanceColor(rewards)
  const baseBeaconChaUrl = useRecoilValue(selectBeaconChaBaseUrl)
  const valHrefBase = `/dashboard/validators?id=${index}`
  const detailHref = `${valHrefBase}&modal=${ValidatorModalView.DETAILS.toLowerCase()}`
  const editHref = `${valHrefBase}&modal=${ValidatorModalView.EDIT.toLowerCase()}`
  const { aliases } = useValidatorAliases()
  const [localAliases] = useLocalStorage<ValAliases>('val-aliases', {})
  useAliasMigration()
  const hasIndex = index !== undefined

  const validatorDetailBtnClass = addClassString(
    'cursor-pointer w-8 h-8 border border-primary100 dark:border-primary bg-dark25 dark:bg-dark750 rounded-full flex items-center justify-center',
    [!hasIndex && 'opacity-30 pointer-events-none'],
  )

  const editValidatorBtnClass = addClassString('w-full flex justify-center', [
    !hasIndex && 'opacity-30 pointer-events-none',
  ])

  const validatorIconClass = addClassString('px-2', [index ? 'cursor-pointer' : ''])

  useEffect(() => {
    setReady(true)
  }, [])

  // Use API aliases if available, fallback to localStorage for migration
  const currentAliases = aliases || localAliases
  const valName = useValidatorName(validator, currentAliases)
  const validatorName = isReady ? valName : name

  const isConversionRequired = withdrawalAddress ? isBlsAddress(withdrawalAddress) : false
  const isValidatorProcessing =
    processingValidators && processingValidators.includes(validator.index.toString())

  const editValidator = () => {
    setActiveValidatorId(index)
    setIsEditValidator(true)
    router.push(editHref)
  }

  const viewDetail = (e: MouseEvent<HTMLTableRowElement>) => {
    if (e.target instanceof Element && e.target.closest('button')) {
      return
    }

    if (view === 'full') {
      setActiveValidatorId(index)
      setValDetail(true)
      router.push(detailHref)
      return
    }

    window.location.href = detailHref
  }

  const renderAvatar = useMemo(() => {
    if (isConversionRequired) {
      return (
        <Tooltip id={`blsTransfer-${pubKey}`} maxWidth={300} text={t('blsExecution.tooltip')}>
          <div className='relative'>
            <IdenticonIcon size={32} type='CIRCULAR' hash={pubKey} />
            {isConversionRequired && !isValidatorProcessing && (
              <i className='bi-exclamation text-3xl text-error absolute z-10 -top-2.5 -right-3.5' />
            )}
          </div>
        </Tooltip>
      )
    }

    return <IdenticonIcon size={32} type='CIRCULAR' hash={pubKey} />
  }, [isConversionRequired, isValidatorProcessing, pubKey])

  return (
    <tr onClick={viewDetail} className='w-full cursor-pointer border-t-style500 h-12'>
      <th className={validatorIconClass}>
        <div className='w-full flex justify-center'>{renderAvatar}</div>
      </th>
      <th className='w-28 cursor-pointer'>
        <Typography className='text-left' color='text-dark500' type='text-caption2'>
          {validatorName}
        </Typography>
      </th>
      <th className='border-r-style500 px-2'>
        <Typography color='text-dark500' type='text-caption1'>
          {index}
        </Typography>
      </th>
      <th className='px-2'>
        <Tooltip id={pubKey} place='top-start' style={{ fontSize: '12px' }} text={pubKey}>
          <Typography color='text-dark500' type='text-caption1' className='text-left w-fit'>
            {formatEthAddress(pubKey)}
          </Typography>
        </Tooltip>
      </th>
      <th className='px-2'>
        <Typography type='text-caption1' className='text-left' darkMode='dark:text-white' isBold>
          {balance?.toFixed(4)}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography
          color={rewardColor}
          darkMode={rewardColor}
          type='text-caption1'
          className='uppercase'
        >
          {rewards?.toFixed(4)}
        </Typography>
      </th>
      <th className='px-1'>
        <WithdrawalAddressText
          tooltipClasses='mx-auto'
          color='text-dark500'
          type='text-caption1'
          className='whitespace-nowrap'
          withdrawalAddress={withdrawalAddress}
          id={pubKey}
        />
      </th>
      <th className='border-r-style500 px-4'>
        <div className='flex items-center mx-auto justify-between flex-wrap w-full max-w-[100px]'>
          <Typography color='text-dark500' type='text-tiny' className='uppercase'>
            {t(`validatorStatus.${status}`)}
          </Typography>
          <StatusIcon status={status} />
        </div>
      </th>
      {view === 'full' && (
        <>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  size='text-xs'
                  border='border border-error'
                  icon='bi-x-lg'
                  color='text-error'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  border='border border-primary100 dark:border-primary'
                  icon='bi-key-fill'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <div className={editValidatorBtnClass}>
              <ValidatorActionIcon
                onClick={editValidator}
                border='border border-primary100 dark:border-primary'
                icon='bi-pencil-square'
              />
            </div>
          </th>
        </>
      )}
      <th className='border-r-style500 px-2'>
        <div className='w-full flex justify-center'>
          <a target='_blank' rel='noreferrer' href={`${baseBeaconChaUrl}/${index || pubKey}`}>
            <ValidatorActionIcon icon='bi-box-arrow-in-up-right' />
          </a>
        </div>
      </th>
      <th className='px-2'>
        <div className='w-full flex justify-center'>
          <div className={validatorDetailBtnClass}>
            <div className='w-4 h-4'>
              <ValidatorLogo className='text-primary' />
            </div>
          </div>
        </div>
      </th>
    </tr>
  )
}

export default ValidatorRow
