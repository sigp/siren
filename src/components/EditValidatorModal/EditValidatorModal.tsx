import { FC, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import formatDefaultValName from '../../../utilities/formatDefaultValName';
import formatValidatorEpochData from '../../../utilities/formatValidatorEpochData';
import EditValidatorForm from '../../forms/EditValidatorForm';
import useMediaQuery from '../../hooks/useMediaQuery';
import useUiMode from '../../hooks/useUiMode';
import { ValidatorBalanceInfo, ValidatorCache, ValidatorInfo } from '../../types/validator';
import BasicValidatorMetrics from '../BasicValidatorMetrics/BasicValidatorMetrics';
import Button, { ButtonFace } from '../Button/Button';
import Input from '../Input/Input';
import RodalModal from '../RodalModal/RodalModal';
import Typography from '../Typography/Typography';
import ValidatorInfoHeader from '../ValidatorInfoHeader/ValidatorInfoHeader';

export interface EditValidatorModalProps {
  onClose: () => void
  validator: ValidatorInfo
  validatorCacheData: ValidatorCache
}

const EditValidatorModal:FC<EditValidatorModalProps> = ({onClose, validator, validatorCacheData}) => {
  const {t} = useTranslation()
  const {index} = validator
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const { mode } = useUiMode()
  const [isAnim, setIsAnim] = useState(false)

  const initAnim = () => setIsAnim(true)

  const validatorEpochData = useMemo<ValidatorBalanceInfo>(() => {
    return formatValidatorEpochData([validator], validatorCacheData)
  }, [validator, validatorCacheData])

  return (
    <RodalModal
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '900px',
        maxHeight: '500px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onAnimationEnd={initAnim as any}
      onClose={onClose}
      isVisible
    >
      <div className='py-4 px-6 space-x-12 flex justify-between'>
        <div className='flex items-center'>
          <Typography type='text-subtitle1' fontWeight='font-light'>
            {t('validatorEdit.title')}
          </Typography>
        </div>
        <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
      </div>
      <ValidatorInfoHeader isAnimate={isAnim} animName="editvalidator" validator={validator} />
      <EditValidatorForm validator={validator}>
        {({ control, isValid, isLoading }) => (
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
              <Button isDisabled={!isValid} renderAs="submit" isLoading={isLoading} type={ButtonFace.SECONDARY}>
                {t('validatorEdit.cta')}
              </Button>
            </div>
          </div>
        )}
      </EditValidatorForm>
    </RodalModal>
  )
}

export default EditValidatorModal