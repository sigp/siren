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
    <div className='flex flex-col space-y-4'>
      <div>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          className={largerText}
          color={lightTextColor}
        >
          {t('appDescription.lighthouse')}
        </Typography>
      </div>
      <div className={opacityText}>
        <Typography
          fontWeight='font-light'
          type='text-caption2'
          className={largerText}
          color={darkerTextColor}
        >
          {t('appDescription.siren')}
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
      </div>
    </div>
  )
}

export default AppDescription
