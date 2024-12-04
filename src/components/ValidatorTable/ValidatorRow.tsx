import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import formatBalanceColor from '../../../utilities/formatBalanceColor'
import formatEthAddress from '../../../utilities/formatEthAddress'
import isBlsAddress from '../../../utilities/isBlsAddress'
import ValidatorLogo from '../../assets/images/validators.svg'
import useLocalStorage from '../../hooks/useLocalStorage'
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
  const detailHref = `${valHrefBase}&view=detail`
  const editHref = `${valHrefBase}&view=edit`
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})
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

  const valName = useValidatorName(validator, aliases)
  const validatorName = isReady ? valName : name

  const isConversionRequired = withdrawalAddress ? isBlsAddress(withdrawalAddress) : false
  const isValidatorProcessing =
    processingValidators && processingValidators.includes(validator.index.toString())

  const editValidator = () => {
    setActiveValidatorId(index)
    setIsEditValidator(true)
    router.push(editHref)
  }

  const viewDetail = () => {
    setActiveValidatorId(index)
    setValDetail(true)
    router.push(detailHref)
  }

  const renderAvatar = useCallback(() => {
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
    <tr className='w-full border-t-style500 h-12'>
      <th className={validatorIconClass}>
        {!hasIndex ? (
          <div className='w-full flex justify-center'>{renderAvatar()}</div>
        ) : view === 'full' ? (
          <div onClick={viewDetail} className='w-full flex justify-center'>
            {renderAvatar()}
          </div>
        ) : (
          <Link href={detailHref}>
            <div className='w-full flex justify-center'>{renderAvatar()}</div>
          </Link>
        )}
      </th>
      <th className='w-28 cursor-pointer'>
        {!hasIndex ? (
          <Typography className='text-left' color='text-dark500' type='text-caption2'>
            ---
          </Typography>
        ) : view === 'full' ? (
          <div onClick={viewDetail}>
            <Typography className='text-left' color='text-dark500' type='text-caption2'>
              {validatorName}
            </Typography>
          </div>
        ) : (
          <Link href={detailHref}>
            <Typography className='text-left' color='text-dark500' type='text-caption2'>
              {validatorName}
            </Typography>
          </Link>
        )}
      </th>
      <th className='border-r-style500 px-2'>
        <Typography color='text-dark500' type='text-caption1'>
          {hasIndex ? index : '---'}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='text-left'>
          {formatEthAddress(pubKey)}
        </Typography>
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
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1' className='whitespace-nowrap'>
          {/* {processed} / {missed} */}-
        </Typography>
      </th>
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1'>
          {/* {attested} */}-
        </Typography>
      </th>
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1'>
          {/* {aggregated} */}-
        </Typography>
      </th>
      <th className='border-r-style500 px-4'>
        <div className='flex items-center justify-between flex-wrap w-full max-w-tiny'>
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
          {view === 'full' ? (
            <div onClick={hasIndex ? viewDetail : undefined} className={validatorDetailBtnClass}>
              <div className='w-4 h-4'>
                <ValidatorLogo className='text-primary' />
              </div>
            </div>
          ) : hasIndex ? (
            <Link href={detailHref}>
              <div className='cursor-pointer w-8 h-8 border border-primary100 dark:border-primary bg-dark25 dark:bg-dark750 rounded-full flex items-center justify-center'>
                <div className='w-4 h-4'>
                  <ValidatorLogo className='text-primary' />
                </div>
              </div>
            </Link>
          ) : (
            <div className='cursor-pointer opacity-30 pointer-events-none w-8 h-8 border border-primary100 dark:border-primary bg-dark25 dark:bg-dark750 rounded-full flex items-center justify-center'>
              <div className='w-4 h-4'>
                <ValidatorLogo className='text-primary' />
              </div>
            </div>
          )}
        </div>
      </th>
    </tr>
  )
}

export default ValidatorRow
