'use client'

import { useTranslation } from 'react-i18next';
import Button, { ButtonFace } from '../../src/components/Button/Button';
import Typography from '../../src/components/Typography/Typography';

const Main = () => {
  const {t} = useTranslation()
  return (
    <div className="relative space-y-12 z-50 w-96 -translate-x-96">
      <div>
        <Typography darkMode="text-white" isBold color="text-white" type="text-h2">{t('errorPage.title')}</Typography>
        <Typography color="text-white" darkMode="text-white" type="text-subtitle3">{t('error.title')}</Typography>
      </div>
      <div>
        <Button href="/" type={ButtonFace.SECONDARY}>{t('errorPage.cta')}</Button>
      </div>
    </div>
  )
}

export default Main