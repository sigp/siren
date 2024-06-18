import '../../src/global.css';
import { useTranslation } from 'react-i18next';
import Lighthouse from '../../src/assets/images/lightHouse.svg'
import Button, { ButtonFace } from '../../src/components/Button/Button';
import TopographyCanvas from '../../src/components/Topography/Topography';
import Typography from '../../src/components/Typography/Typography';

export default async function Page() {
  const {t} = useTranslation()
  return (
    <div className='relative w-screen h-screen flex items-center justify-center bg-gradient-to-r from-primary to-tertiary'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-fit rounded-full overflow-hidden">
        <TopographyCanvas color="#F0F0F0" animate height={600} width={600} name="error"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Lighthouse className="text-white w-[500px] h-[500px]"  />
        </div>
      </div>
      <div className="relative space-y-12 z-50 w-96 -translate-x-96">
        <div>
          <Typography darkMode="text-white" isBold color="text-white" type="text-h2">{t('errorPage.title')}</Typography>
          <Typography color="text-white" darkMode="text-white" type="text-subtitle3">{t('error.title')}</Typography>
        </div>
        <div>
          <Button href="/" type={ButtonFace.SECONDARY}>{t('errorPage.cta')}</Button>
        </div>
      </div>
    </div>
  )
}
