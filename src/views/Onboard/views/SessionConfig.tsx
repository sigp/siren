import ValidatorSetupLayout from '../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import { OnboardView, UiMode } from '../../../constants/enums'
import { useSetRecoilState } from 'recoil'
import { onBoardView } from '../../../recoil/atoms'
import Typography from '../../../components/Typography/Typography'
import Input from '../../../components/Input/Input'
import SessionAuthForm from '../../../forms/SessionAuthForm'
import { Controller } from 'react-hook-form'
import { ButtonFace } from '../../../components/Button/Button'

const SessionConfig = () => {
  const setView = useSetRecoilState(onBoardView)
  const viewConfig = () => setView(OnboardView.CONFIGURE)

  return (
    <SessionAuthForm>
      {({ control, onSubmit }) => (
        <ValidatorSetupLayout
          onStepBack={viewConfig}
          onNext={onSubmit}
          ctaType={ButtonFace.SECONDARY}
          title='Session Authentication'
          currentStep='Session Auth'
          previousStep='Configure'
          ctaText='Continue'
        >
          <div className='space-y-8 mb-12'>
            <Typography>
              Protect your account with an optional session password. This extra layer of security
              ensures that only you have access to your account, even if someone gains access to
              your device. If no password is set, Siren will automatically lock sensitive validator
              actions and redirect back to the configuration settings.
            </Typography>
            <div className='w-full flex'>
              <div className='space-y-8 w-full'>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { ref: _ref, ...props }, fieldState: { error } }) => (
                    <Input
                      type='password'
                      label='Password'
                      error={error?.message}
                      uiMode={UiMode.LIGHT}
                      {...props}
                    />
                  )}
                />
                <Controller
                  name='password_confirmation'
                  control={control}
                  render={({ field: { ref: _ref, ...props }, fieldState: { error } }) => (
                    <Input
                      type='password'
                      isDisablePaste
                      isDisableToggle
                      label='Confirm Password'
                      error={error?.message}
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
