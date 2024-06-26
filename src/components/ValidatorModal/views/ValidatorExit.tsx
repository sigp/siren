import axios from 'axios';
import Cookies from 'js-cookie';
import { FC, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import addClassString from '../../../../utilities/addClassString'
import displayToast from '../../../../utilities/displayToast';
import { ValidatorModalView } from '../../../constants/enums'
import useUiMode from '../../../hooks/useUiMode';
import { ToastType } from '../../../types';
import { SignedExitData } from '../../../types/validator';
import AuthPrompt from '../../AuthPrompt/AuthPrompt';
import BasicValidatorMetrics, {
  BasicValidatorMetricsProps,
} from '../../BasicValidatorMetrics/BasicValidatorMetrics'
import Button, { ButtonFace } from '../../Button/Button'
import ExitDisclosure from '../../Disclosures/ExitDisclosure'
import InfoBox, { InfoBoxType } from '../../InfoBox/InfoBox'
import Typography from '../../Typography/Typography'
import ValidatorInfoHeader from '../../ValidatorInfoHeader/ValidatorInfoHeader'
import { ValidatorModalContext } from '../ValidatorModal'

export interface ValidatorExitProps extends BasicValidatorMetricsProps {
  isAnimate: boolean
}

const ValidatorExit: FC<ValidatorExitProps> = ({ validator, validatorEpochData, isAnimate }) => {
  const { t } = useTranslation()
  const { pubKey } = validator
  const { mode } = useUiMode()
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('session-token')}`
    }
  }
  const [isPromptLoading, setPromptLoading] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [isAuthPrompt, setAuthPrompt] = useState(false)
  const { moveToView, closeModal } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)

  const acceptBtnClasses = addClassString('', [isAccept && 'border-success !text-success'])
  const checkMarkClasses = addClassString('bi bi-check-circle ml-4', [isAccept && 'text-success'])

  const handleError = (e: any, defaultMessage: string) => {
    let message = defaultMessage

    if(e.response.status === 401) {
      message = 'Unauthorized. Invalid session password provided.'
    }
    displayToast(message, ToastType.ERROR)
    setPromptLoading(false)
    setLoading(false)
  }

  const getSignedExit = async (password: string): Promise<SignedExitData | undefined> => {
    try {
      const { data } = await axios.post('/api/sign-validator-exit', {pubKey, password}, config)

      return data
    } catch (e) {
      handleError(e, t('error.unableToSignExit'))
    }
  }
  const submitSignedMessage = async (data: {data: SignedExitData, password: string}) => {
    try {
      const { status } = await axios.post('/api/execute-validator-exit', data, config)

      if (status === 200) {
        displayToast(t('success.validatorExit'), ToastType.SUCCESS)
      }
    } catch (e) {
      handleError(e, t('error.invalidExit'))
    }
  }

  const confirmExit = async (password: string) => {
    setPromptLoading(true)

    const message = await getSignedExit(password)

    if (message) {
      await submitSignedMessage({data: message, password})
      setPromptLoading(false)
      setAuthPrompt(false)
      closeModal()
    }
  }
  const toggleAccept = () => setIsAccept((prev) => !prev)
  const triggerPrompt = () => {
    setLoading(true)
    setAuthPrompt(true)
  }
  const closePrompt = () => {
    setLoading(false)
    setAuthPrompt(false)
  }

  return (
    <>
      <div className='pt-2 exit-validator-modal relative'>
        <AuthPrompt mode={mode} isLoading={isPromptLoading} maxHeight="400px" onClose={closePrompt} isVisible={isAuthPrompt} onSubmit={confirmExit}/>
        <div className='py-4 px-6 flex justify-between'>
          <div className='space-x-4 flex items-center'>
            <i onClick={viewDetails} className='bi-chevron-left dark:text-dark300 cursor-pointer' />
            <Typography type='text-subtitle1' fontWeight='font-light'>
              {t('validatorExit.exit')}
            </Typography>
          </div>
          <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
        </div>
        <ValidatorInfoHeader animName="exit-gradient-header" isAnimate={isAnimate} validator={validator} />
        <div className='p-6 space-y-6'>
          <Typography type='text-caption1' isBold isUpperCase>
            <Trans i18nKey='validatorExit.management'>
              <br />
            </Trans>{' '}
            ---
          </Typography>
          <InfoBox type={InfoBoxType.ERROR}>
            <div>
              <Typography type='text-caption1' className='mb-3' darkMode='text-dark900'>
                {t('validatorExit.warning')}
              </Typography>
              <a href=''>
                <Typography type='text-caption1' className='underline' darkMode='text-error'>
                  {t('validatorExit.learnMore')}
                </Typography>
              </a>
            </div>
          </InfoBox>
          <Button onClick={toggleAccept} className={acceptBtnClasses} type={ButtonFace.TERTIARY}>
            {t('validatorExit.iAccept')}
            <i className={checkMarkClasses} />
          </Button>
        </div>
        <div className='p-3 border-t-style100'>
          <ExitDisclosure
            isLoading={isLoading}
            isDisabled={!isAccept}
            onAccept={triggerPrompt}
            ctaType={ButtonFace.SECONDARY}
            ctaText={t('validatorExit.exit')}
          />
        </div>
      </div>
    </>
  )
}

export default ValidatorExit
