import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNodeEndpoint, isBlsExecutionModal, isProcessBls } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import Typography from '../Typography/Typography'
import CodeInput from '../CodeInput/CodeInput'
import ValidatorDisclosure from '../Disclosures/ValidatorDisclosure'
import { useState } from 'react'
import { MOCK_BLS_JSON, WithdrawalInfoLink } from '../../constants/constants'
import GradientHeader from '../GradientHeader/GradientHeader'
import { ButtonFace } from '../Button/Button'
import { useTranslation, Trans } from 'react-i18next'
import { broadcastBlsChange } from '../../api/beacon'
import { toast } from 'react-toastify'
import axios, { AxiosError } from 'axios'
import useLocalStorage from '../../hooks/useLocalStorage'
import { Storage } from '../../constants/enums'

const BlsExecutionModal = () => {
  const { t } = useTranslation()
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const [isModal, toggleModal] = useRecoilState(isBlsExecutionModal)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [blsJson, setJson] = useState(MOCK_BLS_JSON)
  const setIsProcess = useSetRecoilState(isProcessBls)
  const [, storeIsBlsProcessing] = useLocalStorage<boolean>(Storage.BLS_PROCESSING, false)

  const closeModal = () => toggleModal(false)
  const setJsonValue = (value: string) => setJson(value)

  const handleError = (code?: number) => {
    let message = t('error.unknownError', { type: 'BEACON' })

    if (code === 400) {
      message = t('error.executionFailure')
    }

    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      theme: 'colored',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  const submitChange = async () => {
    try {
      const { status } = await broadcastBlsChange(beaconEndpoint, blsJson)

      if (status != 200) {
        handleError(status)
        return
      }

      setIsProcess(true)
      storeIsBlsProcessing(true)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError

        handleError(axiosError.response?.status)
      }
    }
  }

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
          <CodeInput value={blsJson} onChange={setJsonValue} />
        </div>
        {isModal && (
          <div className='p-3 border-t-style100'>
            <ValidatorDisclosure
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
