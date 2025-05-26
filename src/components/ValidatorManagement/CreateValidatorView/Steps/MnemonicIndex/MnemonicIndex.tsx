import axios from 'axios'
import { ChangeEvent, KeyboardEvent, FC, useRef, useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { MAX_MNEMONIC_INDEX } from '../../../../../constants/constants'
import useChainSafeKeygen from '../../../../../hooks/useChainSafeKeygen'
import useClickOutside from '../../../../../hooks/useClickOutside'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { blsModuleAtom } from '../../../../../recoil/atoms'
import { IndexSuggestion, NetworkId, ValidatorCandidate } from '../../../../../types'
import Button, { ButtonFace } from '../../../../Button/Button'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'
import LoadingDots from '../../../../LoadingDots/LoadingDots'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../StepOptions'
import IndexSuggestionRow from './IndexSuggestionRow'
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
  const BATCH_SIZE = 10
  const inputRef = useRef<HTMLInputElement>(null)
  const [startIndex, setIndex] = useState<number | undefined>(undefined)
  const blsModule = useRecoilValue(blsModuleAtom)
  const { deriveEIP2334SubKey, generateSigningPubKey } = useChainSafeKeygen(blsModule)
  const [indexedValidatorCandidates, setIndexedCandidates] = useState<ValidatorCandidate[]>([])
  const [indexSuggestion, setIndexSuggestion] = useState<IndexSuggestion | undefined>(undefined)
  const [isLoading, setLoading] = useState(false)
  const [isViewSuggestion, setIsViewSuggestion] = useState(false)
  const count = indexedValidatorCandidates.length
  const candidateCount = candidates.length
  const eip2334SubKey = useMemo(() => {
    return keyPhrase ? deriveEIP2334SubKey(keyPhrase) : undefined
  }, [keyPhrase])

  const { ref } = useClickOutside<HTMLDivElement>(() => {
    setIsViewSuggestion(false)
  })

  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()

  const setStartIndex = (e: ChangeEvent<HTMLInputElement>) => {
    const index = e.target.value
    setIndex(index ? Number(index) : undefined)
  }

  const validateIndices = async (startIndex: number) => {
    if (!eip2334SubKey) return

    setLoading(true)
    setIsViewSuggestion(false)

    const potentialIndices = candidates.map((validator, index) => ({
      ...validator,
      index: (startIndex || 0) + index,
      isPending: true,
    }))

    setIndexedCandidates(potentialIndices)
    const processCandidate = async (candidate: ValidatorCandidate) => {
      const { index } = candidate
      if (index === undefined) return candidate

      try {
        const publicKey = generateSigningPubKey(eip2334SubKey, index)
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

    await limitConcurrency(potentialIndices, BATCH_SIZE)

    setLoading(false)
  }

  useEffect(() => {
    if (!isActive || !eip2334SubKey || !candidateCount) return
    let isMounted = true

    const findInactiveKey = async () => {
      setIndexSuggestion(undefined)

      const pubKeyList: { pubKey: string; isActive: boolean; index: number }[] = []
      let index = 0
      let consecutiveFalse = 0

      while (isMounted && consecutiveFalse < candidateCount) {
        const batchIndices = Array.from({ length: BATCH_SIZE }, (_, i) => index + i)

        const batchResults = await Promise.all(
          batchIndices.map((i) => {
            const pubKey = generateSigningPubKey(eip2334SubKey as Uint8Array, i)
            return axios.get<{ data: unknown }>(`/api/validator-status/${pubKey}`).then((res) => ({
              index: i,
              pubKey,
              isActive: Boolean(res.data.data),
            }))
          }),
        )

        for (const entry of batchResults) {
          pubKeyList.push(entry)

          if (!entry.isActive) {
            consecutiveFalse++
          } else {
            consecutiveFalse = 0
          }

          if (consecutiveFalse >= candidateCount) {
            break
          }
        }

        index += BATCH_SIZE
      }

      if (!isMounted) return

      const falseGroupStart = pubKeyList.length - candidateCount
      const falseGroup = pubKeyList.slice(falseGroupStart)

      const suggestedIndex = falseGroup[0]

      const lastKnownActive =
        falseGroupStart > 0
          ? pubKeyList.slice(Math.max(0, falseGroupStart - 3), falseGroupStart)
          : []

      setIndexSuggestion({ lastKnownActive, suggestedIndex })
    }

    void findInactiveKey()

    return () => {
      isMounted = false
    }
  }, [keyPhrase, isActive, eip2334SubKey, candidateCount])

  const isDisabledVerify =
    !eip2334SubKey ||
    startIndex === undefined ||
    startIndex < 0 ||
    startIndex + candidates.length > MAX_MNEMONIC_INDEX
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
    if (event.key === 'Enter' && startIndex !== undefined && startIndex >= 0) {
      await validateIndices(startIndex)
    }
  }

  const handleManualValidation = async () => {
    if (startIndex !== undefined && startIndex >= 0) {
      await validateIndices(startIndex)
    }
  }

  const stepForward = () => {
    onValidatorChange(indexedValidatorCandidates)
    onNextStep()
  }

  const handleInputFocus = () => {
    setIsViewSuggestion(true)
  }

  const useSuggestion = async (index: number) => {
    setIndex(index)
    await validateIndices(index)
  }

  return (
    <div className='w-full h-full relative flex flex-col space-y-4'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicIndexing.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.mnemonicIndexing.subTitle')}
        </Typography>
      </div>
      <div ref={parentRef} className='w-full flex-1 max-w-[650px] space-y-8'>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicIndexing.caption')}
        </Typography>
        <div ref={ref} className='w-full relative'>
          <div className='flex w-full'>
            <input
              ref={inputRef}
              onChange={setStartIndex}
              min={0}
              value={startIndex || ''}
              onFocus={handleInputFocus}
              max={MAX_MNEMONIC_INDEX}
              onKeyDown={handleEnterKey}
              className='w-full text-dark900 dark:text-dark300 dark:bg-dark600_20 font-openSauce text-caption1 p-2 outline-none border-style'
              type='number'
            />
            <Button
              isLoading={isLoading}
              isDisabled={isDisabledVerify}
              onClick={handleManualValidation}
              type={ButtonFace.SECONDARY}
            >
              {t('verify')}
            </Button>
          </div>
          {isViewSuggestion && (
            <div className='absolute z-20 animate-fadeSlideIn shadow-xl left-0 top-100 w-full bg-darkPrimaryOffset1'>
              {indexSuggestion ? (
                <>
                  {indexSuggestion.lastKnownActive.length
                    ? indexSuggestion.lastKnownActive.map((pubKeyIndex, index) => (
                        <IndexSuggestionRow
                          key={index}
                          networkId={depositNetworkId}
                          onClick={useSuggestion}
                          data={pubKeyIndex}
                        />
                      ))
                    : null}
                  <IndexSuggestionRow
                    networkId={depositNetworkId}
                    onClick={useSuggestion}
                    data={indexSuggestion.suggestedIndex}
                  />
                </>
              ) : (
                <div className='flex flex-col items-center space-y-2 p-3'>
                  <Typography type='text-caption1.5'>{t('searchIndex')}</Typography>
                  <LoadingDots size={1} />
                </div>
              )}
            </div>
          )}
        </div>
        <div ref={targetChildRef} style={{ maxHeight: maxHeight }} className='w-full flex flex-col'>
          {count > 0 ? (
            <>
              <div className='w-full flex justify-end border-style px-2 py-3'>
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
              <div className='w-full h-full overflow-auto'>
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
