import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeDevice, isBlsExecutionModal, processingBlsValidators } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import Typography from '../Typography/Typography'
import CodeInput from '../CodeInput/CodeInput'
import ValidatorDisclosure from '../Disclosures/ValidatorDisclosure'
import { useEffect, useState } from 'react'
import { MOCK_BLS_JSON, WithdrawalInfoLink } from '../../constants/constants'
import GradientHeader from '../GradientHeader/GradientHeader'
import { ButtonFace } from '../Button/Button'
import { Trans, useTranslation } from 'react-i18next'
import { broadcastBlsChange } from '../../api/beacon'
import axios, { AxiosError } from 'axios'
import useLocalStorage from '../../hooks/useLocalStorage'
import { Storage } from '../../constants/enums'
import isValidJSONArray from '../../utilities/isValidJson'
import getValuesFromObjArray from '../../utilities/getValuesFromObjArray'
import displayToast from '../../utilities/displayToast'
import { ToastType } from '../../types'

const BlsExecutionModal = () => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)
  const { beaconUrl } = useRecoilValue(activeDevice)
  const [isFocus, setFocused] = useState(false)
  const [isModal, toggleModal] = useRecoilState(isBlsExecutionModal)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [blsJson, setJson] = useState<string>(MOCK_BLS_JSON)
  const [processingValidators, setIsProcess] = useRecoilState(processingBlsValidators)
  const [, storeIsBlsProcessing] = useLocalStorage<string>(Storage.BLS_PROCESSING, '')

  const closeModal = () => {
    toggleModal(false)
    setJson(MOCK_BLS_JSON)
    setFocused(false)
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

    displayToast(message, ToastType.ERROR)
  }

  const submitChange = async () => {
    setLoading(true)
    if (!isValidJSONArray(blsJson)) {
      setLoading(false)
      handleError(422)
      return
    }

    let targetIndices = getValuesFromObjArray(JSON.parse(blsJson), 'message.validator_index')

    try {
      const { status } = await broadcastBlsChange(beaconUrl, blsJson)

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

  useEffect(() => {
    if (isFocus) {
      setJson('')
    }
  }, [isFocus])

  return (
    <RodalModal
      isVisible={isModal}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      <div>
        <GradientHeader title={t('blsExecution.modal.title')} />
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
              onAccept={submitChange}
              ctaType={ButtonFace.SECONDARY}
              ctaText={t('blsExecution.modal.cta')}
            />
          </div>
        )}
      </div>
    </RodalModal>
  )
}

export default BlsExecutionModal
