import { FC, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Lighthouse from '../../assets/images/lightHouse.svg'
import { UiMode } from '../../constants/enums';
import AuthenticationForm, { AuthFormProps } from '../../forms/AuthenticationForm';
import AnimatedHeader from '../AnimatedHeader/AnimatedHeader';
import Button, { ButtonFace } from '../Button/Button';
import Input from '../Input/Input';
import RodalModal from '../RodalModal/RodalModal';
import Typography from '../Typography/Typography';

export interface AuthModalProps extends Omit<AuthFormProps, 'children'>{
  isVisible: boolean
  isLoading: boolean
  isNamePrompt?: boolean
  onClose?: () => void
  mode: UiMode
  maxHeight?: string
}

const AuthPrompt:FC<AuthModalProps> = ({onSubmit, isVisible, isLoading, mode, onClose, isNamePrompt, maxHeight = '550px'}) => {
  const {t} = useTranslation()
  const [isReady, setReady] = useState(false)

  const showAnim = () => setReady(true)

  return (
    <RodalModal onAnimationEnd={showAnim as any} styles={{ maxWidth: '500px', height: 'auto', maxHeight }} onClose={onClose} isVisible={isVisible}>
      <AuthenticationForm isVisible={isVisible} onSubmit={onSubmit}>
        {({control, isValid}) => (
          <div>
            <AnimatedHeader speed={.1} name="auth-prompt" isReady={isReady} color="#ffffff" className="w-full h-24 overflow-hidden bg-gradient-to-r from-primary to-tertiary"/>
            <div className="p-6 relative">
              <div className="rounded-full p-1 absolute left-1/2 -translate-x-1/2 flex item-center justify-center top-0 -translate-y-1/2 bg-gradient-to-r from-primary to-tertiary">
                <Lighthouse className="text-white w-18 h-18"/>
              </div>
              <div className="py-8">
                <Typography type="text-caption1" color="text-dark500">
                  {t('authPrompt.authRequired')}
                </Typography>
              </div>
              <div className="space-y-4">
                {isNamePrompt && (
                  <Controller
                    name='username'
                    control={control as any}
                    render={({ field: { ref: _ref, ...props }, fieldState }) => (
                      <Input
                        label="User Name"
                        uiMode={mode}
                        error={fieldState.error?.message}
                        {...props}
                      />
                    )}
                  />
                )}
                <Controller
                  name='password'
                  control={control as any}
                  render={({ field: { ref: _ref, ...props }, fieldState }) => (
                    <Input
                      isAutoFocus
                      label={isNamePrompt ? 'Password' : undefined}
                      autoComplete="new-password"
                      type="password"
                      uiMode={mode}
                      error={fieldState.error?.message}
                      {...props}
                    />
                  )}
                />
              </div>
              <div className="w-full flex items-center justify-center mt-4">
                <Button renderAs="submit" isDisabled={!isValid} isLoading={isLoading} className="mt-4" type={ButtonFace.SECONDARY}>{t('authPrompt.authenticate')}</Button>
              </div>
            </div>
          </div>
        )}
      </AuthenticationForm>
    </RodalModal>
  )
}

export default AuthPrompt;