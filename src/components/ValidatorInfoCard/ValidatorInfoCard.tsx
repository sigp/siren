import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import { ValidatorModalView } from '../../constants/enums'
import { useAliasMigration } from '../../hooks/useAliasMigration'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useValidatorAliases } from '../../hooks/useValidatorAliases'
import useValidatorName from '../../hooks/useValidatorName'
import { activeValidatorId, isValidatorDetail } from '../../recoil/atoms'
import { ValAliases } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import AnimatedHeader, { AnimatedHeaderProps } from '../AnimatedHeader/AnimatedHeader'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import InlineEditableText from '../InlineEditableText/InlineEditableText'
import Typography from '../Typography/Typography'

export interface ValidatorInfoCardProps extends Omit<AnimatedHeaderProps, 'className' | 'name'> {
  validator: ValidatorInfo
  className?: string
}

const ValidatorInfoCard: FC<ValidatorInfoCardProps> = ({
  validator,
  className,
  isReady,
  animate,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { index, balance, pubKey } = validator
  const setActiveValidatorId = useSetRecoilState(activeValidatorId)
  const setValDetail = useSetRecoilState(isValidatorDetail)
  const { aliases, updateAlias } = useValidatorAliases()
  const [localAliases] = useLocalStorage<ValAliases>('val-aliases', {})
  useAliasMigration()
  const classes = addClassString(
    'w-full cursor-pointer lg:w-80 lg:border-r-style100 p-3 relative overflow-hidden',
    [className],
  )

  // Use API aliases if available, fallback to localStorage for migration
  const currentAliases = aliases || localAliases
  const validatorName = useValidatorName(validator, currentAliases)
  const valHrefBase = `/dashboard/validators?id=${index}`
  const detailHref = `${valHrefBase}&modal=${ValidatorModalView.DETAILS}`

  const handleNameSave = async (newName: string) => {
    if (index !== undefined) {
      await updateAlias(index, newName)
    }
  }

  const viewDetail = (e: any) => {
    // Prevent opening modal when interacting with the editable text
    if (e.target.closest('.inline-editable-text')) {
      return
    }

    setActiveValidatorId(index)
    setValDetail(true)
    router.push(detailHref)
  }

  return (
    <div onClick={viewDetail} className={classes}>
      <AnimatedHeader
        name={`${pubKey}-validatorcard`}
        animate={animate}
        speed={0.2}
        isReady={isReady}
        className='z-10 w-full h-full absolute left-0 top-0'
      />
      <div className='w-full flex flex-col justify-between space-y-2 lg:space-y-1 h-full z-20 relative'>
        <div className='w-full flex justify-between'>
          <IdenticonIcon size={120} type='CIRCULAR' hash={pubKey} />
          <div className='text-right flex-1 flex flex-col justify-between'>
            <div>
              <Typography type='text-caption1' color='text-dark300'>
                {index}
              </Typography>
              <div className='inline-editable-text'>
                <InlineEditableText
                  value={validatorName || ''}
                  onSave={handleNameSave}
                  disabled={index === undefined}
                  showEditIcon={true}
                  color='text-dark900'
                  type='text-base'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <div>
                <Typography color='text-dark300'>—</Typography>
                <Typography type='text-caption2' color='text-dark300' isBold isUpperCase>
                  {t('validatorManagement.details.validatorBalance')}
                </Typography>
              </div>
              <Typography isBold>{balance?.toFixed(4)}</Typography>
            </div>
          </div>
        </div>
        <div className='w-full flex'>
          <div className='flex-1 space-y-2'>
            <Typography type='text-caption2' color='text-dark300' isUpperCase>
              Pubkey
            </Typography>
            <Typography type='text-caption1' isBold>{`${pubKey?.substring(0, 12)}...`}</Typography>
          </div>
          <div className='flex-1 space-y-2'>
            <Typography type='text-caption2' color='text-dark300' isUpperCase>
              {t('validatorManagement.details.index')}
            </Typography>
            <Typography type='text-caption1' isBold>
              {index}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidatorInfoCard
