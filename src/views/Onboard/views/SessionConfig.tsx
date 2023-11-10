import ValidatorSetupLayout from '../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import { OnboardView, UiMode } from '../../../constants/enums'
import { useSetRecoilState } from 'recoil'
import { onBoardView } from '../../../recoil/atoms'
import Typography from '../../../components/Typography/Typography'
import Input from '../../../components/Input/Input'
import SessionAuthForm from '../../../forms/SessionAuthForm'
import { Controller } from 'react-hook-form'
import { ButtonFace } from '../../../components/Button/Button'
import { useTranslation } from 'react-i18next'

const SessionConfig = () => {
  const { t } = useTranslation()
  const setView = useSetRecoilState(onBoardView)
  const viewConfig = () => setView(OnboardView.CONFIGURE)

  return (
    <SessionAuthForm>
      {({ control, onSubmit, onSkip }) => (
        <ValidatorSetupLayout
          onStepBack={viewConfig}
          onNext={onSubmit}
          onSecondaryAction={onSkip}
          ctaType={ButtonFace.SECONDARY}
          secondaryCtaText={'skip'}
          secondaryCtaIcon={'bi-arrow-right'}
          title={t('sessionConfiguration.title')}
          currentStep={t('sessionConfiguration.currentStep')}
          previousStep={t('sessionConfiguration.prevStep')}
          ctaText={t('authenticate')}
        >
          <div className='space-y-8 mb-12'>
            <Typography>{t('sessionConfiguration.description')}</Typography>
            <div className='w-full flex'>
              <div className='space-y-8 w-full'>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { ref: _ref, ...props }, fieldState }) => (
                    <Input
                      type='password'
                      label={t('password')}
                      extraLabel={t('12char')}
                      error={fieldState.error?.message}
                      uiMode={UiMode.LIGHT}
                      {...props}
                    />
                  )}
                />
                <Controller
                  name='password_confirmation'
                  control={control}
                  render={({ field: { ref: _ref, ...props }, fieldState }) => (
                    <Input
                      type='password'
                      isDisablePaste
                      isDisableToggle
                      label={t('confirmPassword')}
                      error={fieldState.error?.message}
                      uiMode={UiMode.LIGHT}
                      {...props}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </ValidatorSetupLayout>
      )}
    </SessionAuthForm>
  )
}

export default SessionConfig
