import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../../utilities/displayToast'
import { UiMode } from '../../../constants/enums'
import useUiMode from '../../../hooks/useUiMode'
import { ToastType } from '../../../types'
import Button, { ButtonFace } from '../../Button/Button'
import Toggle from '../../Toggle/Toggle'
import Typography from '../../Typography/Typography'
import UiModeIcon from '../../UiModeIcon/UiModeIcon'
import SettingsHeader from '../SettingsHeader'
import SimpleSection from '../SimpleSection'

const GeneralSettings = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { mode, toggleUiMode } = useUiMode()
  const [isLoading, setIsLoading] = useState(false)

  const handleError = () => {
    displayToast(t('authPrompt.unexpectedErrorLogout'), ToastType.ERROR)
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      const { status } = await axios.post('/api/logout')

      if (status === 200) {
        router.push('/')
        return
      }
      handleError()
    } catch (_) {
      handleError()
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = (value: boolean) => toggleUiMode(value ? UiMode.DARK : UiMode.LIGHT)

  return (
    <div className='flex-1 py-4 px-6 md:py-6 md:px-16 w-full max-w-[1540px]'>
      <SettingsHeader sections={[t('settings'), t('general')]} />
      <div className='w-full relative pt-6 @1600:max-w-4xl space-y-16 lg:mt-0 px-0'>
        <SimpleSection title={t('theme.title')} text={t('theme.helperText')}>
          <div className='flex order-1 md:order-2 mb-8 md:mb-0 items-center space-x-2'>
            <Typography
              type='text-caption1'
              isBold
              family='font-archivo'
              color='text-dark500'
              className='uppercase'
            >
              {t('sidebar.theme')}
            </Typography>
            <UiModeIcon mode={mode} />
            <Toggle id='uiModeToggle' value={mode === UiMode.DARK} onChange={toggleTheme} />
          </div>
        </SimpleSection>
        <SimpleSection style='vertical' title={t('session.title')} text={t('session.helperText')}>
          <div className='pt-8'>
            <Button isLoading={isLoading} onClick={logout} type={ButtonFace.ERROR}>
              {t('endSession')}
            </Button>
          </div>
        </SimpleSection>
      </div>
    </div>
  )
}

export default GeneralSettings
