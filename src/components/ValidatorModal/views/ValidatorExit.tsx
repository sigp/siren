import ValidatorInfoHeader from '../../ValidatorInfoHeader/ValidatorInfoHeader'
import { ValidatorInfo } from '../../../types/validator'
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

export interface ValidatorExitProps {
  validator: ValidatorInfo
}

const ValidatorExit: FC<ValidatorExitProps> = ({ validator }) => {
  const { t } = useTranslation()
  const [isAccept, setIsAccept] = useState(false)
  const { moveToView } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const acceptBtnClasses = addClassString('', [isAccept && 'border-success text-success'])

  const confirmExit = () => {}
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
