import axios from 'axios'
import { ChangeEvent, KeyboardEvent, FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useChainSafeKeygen from '../../../../../hooks/useChainSafeKeygen'
import { NetworkId, ValidatorCandidate } from '../../../../../types'
import Button, { ButtonFace } from '../../../../Button/Button'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../StepOptions'
import MnemonicIndexRow from './MnemonicIndexRow'

export interface MnemonicIndexProps {
  candidates: ValidatorCandidate[]
  depositNetworkId: NetworkId
  onValidatorChange: (vals: ValidatorCandidate[]) => void
  keyPhrase: string
  onNextStep: () => void
  onBackStep: () => void
  isActive: boolean
}

const MnemonicIndex: FC<MnemonicIndexProps> = ({
  candidates,
  keyPhrase,
  depositNetworkId,
  onNextStep,
  onBackStep,
  onValidatorChange,
  isActive,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [startIndex, setIndex] = useState<number | undefined>(undefined)
  const { generatePubKey } = useChainSafeKeygen()
  const [indexedValidatorCandidates, setIndexedCandidates] = useState<ValidatorCandidate[]>([])
  const [isLoading, setLoading] = useState(false)
  const count = indexedValidatorCandidates.length

  const setStartIndex = (e: ChangeEvent<HTMLInputElement>) => {
    const index = e.target.value
    setIndex(index ? Number(index) : undefined)
  }

  const validateIndices = async () => {
    setLoading(true)

    const potentialIndices = candidates.map((validator, index) => ({
      ...validator,
      index: (startIndex || 0) + index,
      isPending: true,
    }))

    setIndexedCandidates(potentialIndices)

    const batchSize = 10

    const processCandidate = async (candidate: ValidatorCandidate) => {
      const { index } = candidate
      if (index === undefined) return candidate

      try {
        const publicKey = await generatePubKey(keyPhrase, index)
        const { data } = await axios.get(`/api/validator-status/${publicKey}`)
        return {
          ...candidate,
          isValidIndex: !Boolean(data.data),
          pubKey: publicKey,
          isPending: false,
        }
      } catch (e) {
        console.log(`Error for index ${index}:`, e)
        return { ...candidate, error: true, isPending: false }
      }
    }

    const limitConcurrency = async (tasks: ValidatorCandidate[], length: number) => {
      const results = [] as ValidatorCandidate[]
      let index = 0

      const executeTask = async () => {
        while (index < tasks.length) {
          const currentIndex = index++
          const result = await processCandidate(tasks[currentIndex])

          setIndexedCandidates((prevCandidates) => {
            const updatedCandidates = [...prevCandidates]
            updatedCandidates[currentIndex] = result
            return updatedCandidates
          })

          results[currentIndex] = result
        }
      }

      const workers = Array.from({ length }, () => executeTask())
      await Promise.all(workers)

      return results
    }

    await limitConcurrency(potentialIndices, batchSize)

    setLoading(false)
  }

  const isDisabledVerify =
    startIndex === undefined || startIndex < 0 || startIndex + candidates.length > 4294967295
  const invalidCount = isLoading
    ? 0
    : indexedValidatorCandidates.filter(({ isValidIndex }) => !isValidIndex).length

  const stepBack = () => {
    setIndexedCandidates([])
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onBackStep()
  }

  const handleEnterKey = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && startIndex !== undefined && startIndex > 0) {
      await validateIndices()
    }
  }

  const stepForward = () => {
    onValidatorChange(indexedValidatorCandidates)
    onNextStep()
  }

  return (
    <div className='w-full h-full relative space-y-4'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicIndexing.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.mnemonicIndexing.subTitle')}
        </Typography>
      </div>
      <div className='w-full max-w-[650px] space-y-8'>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicIndexing.caption')}
        </Typography>
        <div className='flex w-full'>
          <input
            ref={inputRef}
            onChange={setStartIndex}
            min={0}
            max={4294967295}
            onKeyDown={handleEnterKey}
            className='w-full text-dark900 dark:text-dark300 dark:bg-dark600_20 font-openSauce text-caption1 p-2 outline-none border-style'
            type='number'
          />
          <Button
            isLoading={isLoading}
            isDisabled={isDisabledVerify}
            onClick={validateIndices}
            type={ButtonFace.SECONDARY}
          >
            {t('verify')}
          </Button>
        </div>
        <div className='w-full'>
          {count > 0 ? (
            <>
              <div className='w-full flex justify-end border border-style px-2 py-3'>
                <div className='flex space-x-2 border-r dark:border-primary px-2'>
                  <Typography type='text-caption1'>{t('total')}: </Typography>
                  <Typography type='text-caption1'>{count}</Typography>
                </div>
                <div className='flex space-x-2 px-2'>
                  <Typography isCapitalize type='text-caption1'>
                    {t('inUse')}:{' '}
                  </Typography>
                  <Typography type='text-caption1'>{invalidCount}</Typography>
                </div>
              </div>
              <div className='overflow-scroll w-full border-b-style max-h-[190px]'>
                {indexedValidatorCandidates.map((candidate, index) => (
                  <MnemonicIndexRow
                    depositNetworkId={depositNetworkId}
                    key={index}
                    candidate={candidate}
                  />
                ))}
              </div>
            </>
          ) : (
            <InfoBox isActive={isActive} animDelay={0.4} type={InfoBoxType.NOTICE}>
              <div className='space-y-2'>
                <Typography type='text-caption1' color='text-dark900' darkMode='text-dark900'>
                  {t('validatorManagement.mnemonicIndexing.warningText')}
                </Typography>
              </div>
            </InfoBox>
          )}
        </div>
        <StepOptions
          onBackStep={stepBack}
          onNextStep={stepForward}
          isDisabledNext={!count || invalidCount > 0}
        />
      </div>
    </div>
  )
}

export default MnemonicIndex
