import { motion } from 'framer-motion'
import { ChangeEvent, FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import { ValidatorCandidate } from '../../types'
import InlineInput from '../InlineInput/InlineInput'
import Typography from '../Typography/Typography'

export interface ValidatorCandidateRowProps {
  onUpdateCandidate?: (id: string, data: ValidatorCandidate) => void
  data: ValidatorCandidate
  index?: number | undefined
  children: ReactNode
  isError?: boolean
}

const ValidatorCandidateRow: FC<ValidatorCandidateRowProps> = ({
  data,
  onUpdateCandidate,
  index,
  children,
  isError,
}) => {
  const { t } = useTranslation()
  const { id, name } = data
  const valName = name || t('validatorManagement.customValidatorName')
  const updateCandidate = (e: ChangeEvent<HTMLInputElement>) =>
    onUpdateCandidate?.(id, { ...data, name: e.target.value })
  const containerClasses = addClassString(
    'transition-all duration-50 group items-center w-full min-h-16 flex justify-between border-style border-t-0 relative',
    [isError && 'bg-lightError100'],
  )

  return (
    <div className='w-full min-h-16 overflow-hidden'>
      <motion.div
        initial={{ translateY: -20 }}
        animate={{ translateY: 0 }}
        className={containerClasses}
      >
        <div className='px-4 flex space-x-6 py-2 items-center'>
          <div className='flex space-x-2 items-center'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary to-tertiary' />
            <div className='hidden lg:block relative w-[180px] 2xl:w-[220px] border-r'>
              {onUpdateCandidate ? (
                <InlineInput
                  containerClass='w-full'
                  inputClass='w-[90%]'
                  value={name as string}
                  onChange={updateCandidate}
                >
                  <div className='flex space-x-2 items-center relative'>
                    <Typography className='group-hover:underline' type='text-caption1'>
                      {valName}
                    </Typography>
                    <i className='opacity-0 group-hover:opacity-100 bi-pencil-square text-dark900 dark:text-dark300' />
                  </div>
                </InlineInput>
              ) : (
                <Typography type='text-caption1'>{valName}</Typography>
              )}
            </div>
          </div>
          {index !== undefined ? <Typography type='text-caption1'>{index}</Typography> : null}
        </div>
        {children}
      </motion.div>
    </div>
  )
}

export default ValidatorCandidateRow
