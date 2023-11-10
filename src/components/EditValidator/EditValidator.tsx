import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import RodalModal from '../RodalModal/RodalModal'
import { FC, useState } from 'react'
import { ValidatorInfo } from '../../types/validator'
import Typography from '../Typography/Typography'
import BasicValidatorMetrics from '../BasicValidatorMetrics/BasicValidatorMetrics'
import useMediaQuery from '../../hooks/useMediaQuery'
import ValidatorInfoHeader from '../ValidatorInfoHeader/ValidatorInfoHeader'
import Input from '../Input/Input'
import useUiMode from '../../hooks/useUiMode'
import Button, { ButtonFace } from '../Button/Button'
import formatDefaultValName from '../../utilities/formatDefaultValName'
import EditValidatorForm from '../../forms/EditValidatorForm'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface EditValidatorProps {
  validator: ValidatorInfo
}

const EditValidator: FC<EditValidatorProps> = ({ validator }) => {
  const { t } = useTranslation()
  const { index } = validator
  const [isOpen, setOpen] = useState(false)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const { mode } = useUiMode()

  const closeModal = () => setOpen(false)
  const openModal = () => setOpen(true)

  return (
    <>
      <ValidatorActionIcon
        onClick={openModal}
        border='border border-primary100 dark:border-primary'
        icon='bi-pencil-square'
      />
      <RodalModal
        styles={{
          width: 'fit-content',
          maxWidth: isTablet ? '448px' : '900px',
          height: isTablet ? '540px' : 'max-content',
        }}
        onClose={closeModal}
        isVisible={isOpen}
      >
        <div className='py-4 px-6 space-x-12 flex justify-between'>
          <div className='flex items-center'>
            <Typography type='text-subtitle1' fontWeight='font-light'>
              {t('validatorEdit.title')}
            </Typography>
          </div>
          <BasicValidatorMetrics validator={validator} />
        </div>
        <ValidatorInfoHeader validator={validator} />
        <EditValidatorForm validator={validator}>
          {({ control, isValid, onSubmit }) => (
            <div className='p-6 space-y-8'>
              <Controller
                name='nameString'
                control={control as any}
                render={({ field: { ref: _ref, ...props }, fieldState }) => (
                  <Input
                    isAutoFocus
                    placeholder={formatDefaultValName(String(index))}
                    uiMode={mode}
                    error={fieldState.error?.message}
                    label={t('validatorEdit.label')}
                    {...props}
                  />
                )}
              />
              <div className='flex justify-end'>
                <Button isDisabled={!isValid} onClick={onSubmit} type={ButtonFace.SECONDARY}>
                  {t('validatorEdit.cta')}
                </Button>
              </div>
            </div>
          )}
        </EditValidatorForm>
      </RodalModal>
    </>
  )
}

export default EditValidator
