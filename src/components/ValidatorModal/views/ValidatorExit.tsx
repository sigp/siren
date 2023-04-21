import ValidatorInfoHeader from '../../ValidatorInfoHeader/ValidatorInfoHeader'
import { SignedExitData, ValidatorInfo } from '../../../types/validator'
import { FC, useContext, useState } from 'react'
import Typography from '../../Typography/Typography'
import { ValidatorModalContext } from '../ValidatorModal'
import { ValidatorModalView } from '../../../constants/enums'
import BasicValidatorMetrics from '../../BasicValidatorMetrics/BasicValidatorMetrics'
import InfoBox, { InfoBoxType } from '../../InfoBox/InfoBox'
import Button, { ButtonFace } from '../../Button/Button'
import ValidatorDisclosure from '../../Disclosures/ValidatorDisclosure'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import { signVoluntaryExit } from '../../../api/lighthouse'
import { useRecoilValue } from 'recoil'
import { apiToken, beaconNodeEndpoint, validatorClientEndpoint } from '../../../recoil/atoms'
import { Endpoint } from '../../../types'
import { toast } from 'react-toastify'
import { submitSignedExit } from '../../../api/beacon'

export interface ValidatorExitProps {
  validator: ValidatorInfo
}

const ValidatorExit: FC<ValidatorExitProps> = ({ validator }) => {
  const { pubKey } = validator
  const beacon = useRecoilValue(beaconNodeEndpoint)
  const endpoint = useRecoilValue(validatorClientEndpoint)
  const token = useRecoilValue(apiToken)
  const { t } = useTranslation()
  const [isAccept, setIsAccept] = useState(false)
  const { moveToView, closeModal } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const acceptBtnClasses = addClassString('', [isAccept && 'border-success text-success'])

  const getSignedExit = async (beacon: Endpoint): Promise<SignedExitData | undefined> => {
    try {
      const { data } = await signVoluntaryExit(beacon, token, pubKey)

      if (data) {
        return data
      }
    } catch (e) {
      toast.error('Unable to sign voluntary exit message', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }
  }
  const submitSignedMessage = async (data: SignedExitData) => {
    try {
      const { status } = await submitSignedExit(beacon, data)

      if (status === 200) {
        closeModal()
      }
    } catch (e) {
      toast.error('Invalid voluntary exit', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }
  }

  const confirmExit = async () => {
    if (!beaconNodeEndpoint) return

    const message = await getSignedExit(endpoint)

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
            Exit Validator
          </Typography>
        </div>
        <BasicValidatorMetrics validator={validator} />
      </div>
      <ValidatorInfoHeader validator={validator} />
      <div className='p-6 space-y-6'>
        <Typography type='text-caption1' isBold isUpperCase>
          Validator <br /> Management ---
        </Typography>
        <InfoBox type={InfoBoxType.WARNING}>
          <div>
            <Typography type='text-caption1' className='mb-3' darkMode='text-dark900'>
              This action is irreversible and will cause your validator to get locked in to exited
              state pending withdrawal without the ability to start validator again. This action may
              take time, kindly wait until the validator status reflects the changes.
            </Typography>
            <a href=''>
              <Typography type='text-caption1' className='underline' darkMode='text-error'>
                Learn more about validator states in various phases here.
              </Typography>
            </a>
          </div>
        </InfoBox>
        <Button onClick={toggleAccept} className={acceptBtnClasses} type={ButtonFace.TERTIARY}>
          I understand and Accept
          <i className='bi bi-check-circle ml-4' />
        </Button>
      </div>
      <div className='p-3 border-t-style100'>
        <ValidatorDisclosure
          isSensitive
          isDisabled={!isAccept}
          onAccept={confirmExit}
          ctaType={ButtonFace.SECONDARY}
          ctaText={t('validatorExit.exitCta')}
        />
      </div>
    </div>
  )
}

export default ValidatorExit
