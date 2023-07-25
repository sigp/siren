import ValidatorInfoHeader from '../../ValidatorInfoHeader/ValidatorInfoHeader'
import { SignedExitData, ValidatorInfo } from '../../../types/validator'
import { FC, useContext, useState } from 'react'
import Typography from '../../Typography/Typography'
import { ValidatorModalContext } from '../ValidatorModal'
import { ValidatorModalView } from '../../../constants/enums'
import BasicValidatorMetrics from '../../BasicValidatorMetrics/BasicValidatorMetrics'
import InfoBox, { InfoBoxType } from '../../InfoBox/InfoBox'
import Button, { ButtonFace } from '../../Button/Button'
import { Trans, useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import { signVoluntaryExit } from '../../../api/lighthouse'
import { useRecoilValue } from 'recoil'
import { submitSignedExit } from '../../../api/beacon'
import ExitDisclosure from '../../Disclosures/ExitDisclosure'
import displayToast from '../../../utilities/displayToast'
import { activeDevice } from '../../../recoil/atoms'
import { ToastType } from '../../../types'

export interface ValidatorExitProps {
  validator: ValidatorInfo
}

const ValidatorExit: FC<ValidatorExitProps> = ({ validator }) => {
  const { t } = useTranslation()
  const { pubKey } = validator
  const [isLoading, setLoading] = useState(false)
  const { validatorUrl, apiToken, beaconUrl } = useRecoilValue(activeDevice)
  const [isAccept, setIsAccept] = useState(false)
  const { moveToView, closeModal } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const acceptBtnClasses = addClassString('', [isAccept && 'border-success text-success'])

  const getSignedExit = async (url: string): Promise<SignedExitData | undefined> => {
    try {
      const { data } = await signVoluntaryExit(url, apiToken, pubKey)

      if (data) {
        return data
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('error.unableToSignExit'), ToastType.ERROR)
    }
  }
  const submitSignedMessage = async (data: SignedExitData) => {
    try {
      const { status } = await submitSignedExit(beaconUrl, data)

      if (status === 200) {
        setLoading(false)
        displayToast(t('success.validatorExit'), ToastType.SUCCESS)
        closeModal()
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('error.invalidExit'), ToastType.ERROR)
    }
  }

  const confirmExit = async () => {
    setLoading(true)

    const message = await getSignedExit(validatorUrl)

    if (message) {
      void (await submitSignedMessage(message))
    }
  }
  const toggleAccept = () => setIsAccept((prev) => !prev)

  return (
    <div className='pt-2 exit-validator-modal relative'>
      <div className='py-4 px-6 flex justify-between'>
        <div className='space-x-4 flex items-center'>
          <i onClick={viewDetails} className='bi-chevron-left dark:text-dark300 cursor-pointer' />
          <Typography type='text-subtitle1' fontWeight='font-light'>
            {t('validatorExit.exit')}
          </Typography>
        </div>
        <BasicValidatorMetrics validator={validator} />
      </div>
      <ValidatorInfoHeader validator={validator} />
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
          <i className='bi bi-check-circle ml-4' />
        </Button>
      </div>
      <div className='p-3 border-t-style100'>
        <ExitDisclosure
          isSensitive
          isLoading={isLoading}
          isDisabled={!isAccept}
          onAccept={confirmExit}
          ctaType={ButtonFace.SECONDARY}
          ctaText={t('validatorExit.exit')}
        />
      </div>
    </div>
  )
}

export default ValidatorExit
