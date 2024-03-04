import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '../Typography/Typography'

export interface AppDescriptionProps {
  view: 'settings' | 'init'
}

const AppDescription: FC<AppDescriptionProps> = ({ view }) => {
  const { t } = useTranslation()
  const isSettingsView = view === 'settings'
  const lightTextColor = isSettingsView ? 'text-dark400' : 'text-white'
  const darkerTextColor = isSettingsView ? 'text-dark400' : 'text-dark100'
  const largerText = isSettingsView ? 'lg:text-caption1' : undefined
  const opacityText = view === 'init' ? 'opacity-40' : undefined

  return (
    <div
      className={`flex ${
        isSettingsView
          ? 'flex-col md:flex-row space-y-6 md:space-y-0 justify-between'
          : 'items-center space-x-10 md:space-x-20'
      }`}
    >
      <div>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          className={largerText}
          color={lightTextColor}
        >
          Ethereum Lighthouse
        </Typography>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          isBold={isSettingsView}
          className={largerText}
          color={lightTextColor}
        >
          {t('appDescription.validatorClient')} —
        </Typography>
      </div>
      <div className={opacityText}>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          className={largerText}
          color={darkerTextColor}
        >
          {t('appDescription.developedBy')}
        </Typography>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          isBold={isSettingsView}
          className={largerText}
          color={darkerTextColor}
        >
          Sigma Prime
        </Typography>
      </div>
      <div className={opacityText}>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          className={largerText}
          color={darkerTextColor}
        >
          {t('appDescription.builtOn')}
        </Typography>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          isBold={isSettingsView}
          className={largerText}
          color={darkerTextColor}
        >
          {t('appDescription.rustLanguage')}
        </Typography>
      </div>
    </div>
  )
}

export default AppDescription
