import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import displayToast from '../../../utilities/displayToast'
import getValuesFromObjArray from '../../../utilities/getValuesFromObjArray'
import isValidJSONArray from '../../../utilities/isValidJson'
import { MOCK_BLS_JSON, WithdrawalInfoLink } from '../../constants/constants'
import { Storage } from '../../constants/enums'
import useLocalStorage from '../../hooks/useLocalStorage'
import useMediaQuery from '../../hooks/useMediaQuery'
import useUiMode from '../../hooks/useUiMode'
import { isBlsExecutionModal, processingBlsValidators } from '../../recoil/atoms'
import { ToastType } from '../../types'
import AuthPrompt from '../AuthPrompt/AuthPrompt'
import { ButtonFace } from '../Button/Button'
import CodeInput from '../CodeInput/CodeInput'
import ValidatorDisclosure from '../Disclosures/ValidatorDisclosure'
import GradientHeader from '../GradientHeader/GradientHeader'
import RodalModal from '../RodalModal/RodalModal'
import Typography from '../Typography/Typography'

const BlsExecutionModal = () => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRendered, setRender] = useState(false)
  const modalView = searchParams.get('view')
  const [isAuthPromptLoading, setAuthPromptLoad] = useState(false)
  const [isFinishAnim, setFinished] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isFocus, setFocused] = useState(false)
  const [isModal, toggleModal] = useRecoilState(isBlsExecutionModal)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [blsJson, setJson] = useState<string>(MOCK_BLS_JSON)
  const [isAuthModal, setAuthModal] = useState(false)
  const [processingValidators, setIsProcess] = useRecoilState(processingBlsValidators)
  const [, storeIsBlsProcessing] = useLocalStorage<string>(Storage.BLS_PROCESSING, '')

  useEffect(() => {
    if (isRendered) return

    if (modalView === 'bls') {
      toggleModal(true)
    }

    setRender(true)
  }, [modalView, isRendered])

  const closeModal = () => {
    toggleModal(false)
    setJson(MOCK_BLS_JSON)
    setFocused(false)
    router.push('/dashboard/validators')
  }
  const setJsonValue = (value: string) => setJson(value)

  const focusInput = () => setFocused(true)

  const handleError = (code?: number) => {
    let message = t('error.unknownError', { type: 'BEACON' })

    if (code === 400) {
      message = t('error.executionFailure')
    }

    if (code === 422) {
      message = t('error.invalidJson')
    }

    if (code === 401) {
      message = 'Unauthorized. Invalid session password.'
    }

    displayToast(message, ToastType.ERROR)
  }

  const submitChange = async (password: string) => {
    setAuthModal(false)
    setAuthPromptLoad(false)
    let targetIndices = getValuesFromObjArray(JSON.parse(blsJson), 'message.validator_index')

    try {
      const { status } = await axios.post('/api/bls-execution', { data: blsJson, password })

      setLoading(false)

      if (status != 200) {
        handleError(status)
        return
      }

      if (processingValidators) {
        targetIndices = [...targetIndices, ...processingValidators]
      }

      setIsProcess(targetIndices)
      storeIsBlsProcessing(JSON.stringify(targetIndices))
      closeModal()
      setJson(MOCK_BLS_JSON)
      displayToast(t('success.blsExecution'), ToastType.SUCCESS)
    } catch (e) {
      setLoading(false)
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError

        handleError(axiosError.response?.status)
      }
    }
  }

  const promptAuth = () => {
    setLoading(true)
    if (!isValidJSONArray(blsJson)) {
      setLoading(false)
      handleError(422)
      return
    }

    setAuthModal(true)
  }
  const closeAuthPrompt = () => {
    setAuthModal(false)
    setLoading(false)
  }

  useEffect(() => {
    if (isFocus) {
      setJson('')
    }
  }, [isFocus])

  const finishAnim = () => setFinished(true)

  return (
    <>
      <RodalModal
        isVisible={isModal}
        onAnimationEnd={finishAnim as any}
        styles={{
          width: 'fit-content',
          maxWidth: isTablet ? '448px' : '900px',
          height: isTablet ? '540px' : 'max-content',
        }}
        onClose={closeModal}
      >
        <div>
          <GradientHeader
            speed={0.1}
            name='bls-gradient-header'
            isReady={isFinishAnim}
            title={t('blsExecution.modal.title')}
          />
          <div className='p-6 space-y-4'>
            <Typography type='text-caption1'>
              <Trans i18nKey='blsExecution.modal.subTitle'>
                <br />
              </Trans>
              {' ---'}
            </Typography>
            <Typography className='w-3/4' type='text-caption1'>
              {t('blsExecution.modal.description')}
            </Typography>
            <Typography className='w-3/4' type='text-caption1'>
              <Trans i18nKey='blsExecution.modal.followLink'>
                <a
                  className='text-blue-500 underline'
                  target='_blank'
                  rel='noreferrer'
                  href={WithdrawalInfoLink}
                />
              </Trans>
            </Typography>
            <CodeInput onFocus={focusInput} value={blsJson} onChange={setJsonValue} />
          </div>
          {isModal && (
            <div className='p-3 border-t-style100'>
              <ValidatorDisclosure
                isLoading={isLoading}
                isDisabled={!blsJson}
                onAccept={promptAuth}
                ctaType={ButtonFace.SECONDARY}
                ctaText={t('blsExecution.modal.cta')}
              />
            </div>
          )}
        </div>
      </RodalModal>
      <AuthPrompt
        mode={mode}
        isLoading={isAuthPromptLoading}
        isVisible={isAuthModal}
        onClose={closeAuthPrompt}
        onSubmit={submitChange}
      />
    </>
  )
}

export default BlsExecutionModal
