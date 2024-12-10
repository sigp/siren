import { ChangeEvent, FC, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { ValidatorCandidate } from '../../../../../types'
import IconButton, { IconButtonTypes } from '../../../../IconButton/IconButton'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'
import InlineInput from '../../../../InlineInput/InlineInput'
import Typography from '../../../../Typography/Typography'
import ValSetupRow, { ValSetupRowProps } from './ValSetupRow'

export interface ValSetupTableProps
  extends Pick<ValSetupRowProps, 'onUpdateCandidate' | 'onRemoveCandidate'> {
  candidates: ValidatorCandidate[]
  onAddNewCandidate: () => void
  onRemoveLastCandidate: () => void
  onQuickSetCandidates: (e: ChangeEvent<HTMLInputElement>) => void
}

const ValSetupTable: FC<ValSetupTableProps> = (props) => {
  const {
    candidates,
    onAddNewCandidate,
    onRemoveLastCandidate,
    onUpdateCandidate,
    onQuickSetCandidates,
    onRemoveCandidate,
  } = props
  const { t } = useTranslation()
  const count = candidates.length
  const divRef = useRef<HTMLDivElement>(null)

  const inputSize = () => {
    switch (true) {
      case count >= 100:
        return 12
      case count >= 10:
        return 10
      default:
        return 8
    }
  }

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [count])

  return (
    <div className='w-full lg:w-[75%]'>
      <div className='w-full border-style flex'>
        <div className='lg:flex-1 flex space-x-4 items-center px-4'>
          <div className='w-8 h-8 flex items-center justify-center'>
            <div className='w-4 h-4'>
              <ValidatorLogo className='text-dark900 dark:text-dark200' />
            </div>
          </div>
          <Typography className='hidden lg:block'>{t('validatorManagement.validators')}</Typography>
        </div>
        <div className='group cursor-pointer flex border-l-style px-4 space-x-14 items-center'>
          <Typography isUpperCase isBold type='text-caption2'>
            <Trans i18nKey='validatorManagement.validatorSetup.quickAdd'>
              <br />
            </Trans>
            {' ---'}
          </Typography>
          <div className='border-r px-4 mr-4'>
            <InlineInput
              max={999}
              placeholder={String(count)}
              type='number'
              onChange={onQuickSetCandidates}
              inputClass={`w-${inputSize()}`}
            >
              <div className='flex space-x-2 items-center'>
                <i className='opacity-0 group-hover:opacity-100 bi-pencil-square text-dark900 dark:text-dark300' />
                <Typography className='group-hover:underline' type='text-caption1'>
                  {count}
                </Typography>
              </div>
            </InlineInput>
          </div>
        </div>
        <div className='flex'>
          <div className='p-4 border-l-style'>
            <IconButton
              icon='bi-plus-circle'
              buttonType={IconButtonTypes.PRIMARY}
              onClick={onAddNewCandidate}
            />
          </div>
          <div className='p-4 border-l-style'>
            <IconButton
              icon='bi-dash-circle'
              buttonType={IconButtonTypes.SECONDARY}
              onClick={onRemoveLastCandidate}
            />
          </div>
        </div>
      </div>
      <>
        {count > 0 ? (
          <div ref={divRef} className='max-h-[260px] overflow-scroll'>
            {candidates.map((candidate, index) => (
              <ValSetupRow
                key={index}
                index={index}
                candidate={candidate}
                onRemoveCandidate={onRemoveCandidate}
                onUpdateCandidate={onUpdateCandidate}
              />
            ))}
          </div>
        ) : (
          <InfoBox className='mt-4' type={InfoBoxType.NOTICE}>
            <div className='space-y-2'>
              <Typography type='text-caption1' color='text-dark900' darkMode='text-dark900'>
                {t('validatorManagement.validatorSetup.warningText')}
              </Typography>
              <div onClick={onAddNewCandidate} className='cursor-pointer'>
                <Typography
                  type='text-caption1'
                  color='text-primary'
                  darkMode='text-primary'
                  className='underline'
                >
                  {t('validatorManagement.validatorSetup.cta')}
                </Typography>
              </div>
            </div>
          </InfoBox>
        )}
      </>
    </div>
  )
}

export default ValSetupTable
