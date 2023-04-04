import ValidatorSetupLayout from '../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import { OnboardView, UiMode } from '../../../constants/enums'
import { useSetRecoilState } from 'recoil'
import { onBoardView } from '../../../recoil/atoms'
import Typography from '../../../components/Typography/Typography'
import Input from '../../../components/Input/Input'
import SessionAuthForm from '../../../forms/SessionAuthForm'
import { Controller } from 'react-hook-form'
import SelectDropDown from '../../../components/SelectDropDown/SelectDropDown'
import { TIMEOUT_OPTIONS } from '../../../constants/constants'

const SessionConfig = () => {
  const setView = useSetRecoilState(onBoardView)
  const viewConfig = () => setView(OnboardView.CONFIGURE)

  return (
    <SessionAuthForm>
      {({ control, onSubmit, sessionTime, setTime }) => (
        <ValidatorSetupLayout
          onStepBack={viewConfig}
          onNext={onSubmit}
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
              <div className='space-y-8 w-1/2'>
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
              <div className='flex flex-col flex-1 border-l-style500 ml-8'>
                <div className='px-4 space-y-2'>
                  <Typography
                    isBold
                    family='font-archivo'
                    color='text-dark500'
                    type='text-caption1'
                  >
                    Session Timeout
                  </Typography>
                  <Typography type='text-caption1'>
                    Configure your session timeout period. Siren will prompt you to enter your
                    password if the session exceeds the timeout period.
                  </Typography>
                </div>
                <div className='flex flex-1 items-center justify-center mt-6'>
                  <SelectDropDown
                    className='w-42'
                    value={sessionTime}
                    onSelect={setTime}
                    label=''
                    options={TIMEOUT_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </div>
        </ValidatorSetupLayout>
      )}
    </SessionAuthForm>
  )
}

export default SessionConfig
