import { ReactComponent as LightHouseLogo } from '../../assets/images/lightHouse.svg'
import { ReactComponent as LightHouseFullLogo } from '../../assets/images/lightHouseFull.svg'

import SideItem from './SideItem'
import SideBarText from './SideBarText'
import { PRIMARY_VIEWS, SECONDARY_VIEWS } from '../../constants/constants'
import { createElement } from 'react'
import { useRecoilState } from 'recoil'
import { dashView } from '../../recoil/atoms'
import { ContentView } from '../../constants/enums'
import { useTranslation } from 'react-i18next'
import useUiMode from '../../hooks/useUiMode'
import UiModeIcon from '../UiModeIcon/UiModeIcon'

const SideBar = () => {
  const { t } = useTranslation()
  const [view, setView] = useRecoilState(dashView)
  const { mode, toggleUiMode } = useUiMode()

  const changeView = (key: ContentView) => setView(key)

  return (
    <div className='relative group-sidebar hidden md:block w-14.5 flex-shrink-0'>
      <div className='flex flex-col justify-between z-50 relative w-full h-screen border bg-white dark:bg-dark750 border-l-0 border-dark200 dark:border-dark700'>
        <div className='w-full'>
          <div className='w-full h-16 flex justify-center pt-3.5'>
            <LightHouseLogo className='w-6 h-6 text-black dark:text-white' />
          </div>
          <ul className='space-y-4'>
            {PRIMARY_VIEWS.map(({ logoComponent, key }) => (
              <SideItem key={key} onClick={() => changeView(key)} isActive={view === key}>
                {createElement(logoComponent)}
              </SideItem>
            ))}
          </ul>
        </div>
        <div className='w-full pb-4'>
          <ul className='space-y-4'>
            {SECONDARY_VIEWS.map(({ logoComponent, key }) => (
              <SideItem key={key} onClick={() => changeView(key)} isActive={view === key}>
                {createElement(logoComponent)}
              </SideItem>
            ))}
            <div className='w-full h-6 flex items-center justify-center'>
              <UiModeIcon onClick={toggleUiMode} mode={mode} />
            </div>
          </ul>
        </div>
      </div>
      <div className='z-40 flex flex-col shadow-xl justify-between h-screen w-42 absolute top-0 left-0 bg-white -translate-x-44 group-sidebar-hover:translate-x-14 border dark:bg-dark750 border-dark10 dark:border-dark700  transition-transform'>
        <div className='w-full'>
          <div className='w-full h-16 flex justify-center pt-1'>
            <LightHouseFullLogo className='w-34 text-black dark:text-white' />
          </div>
          <ul className='space-y-4 pl-4'>
            {PRIMARY_VIEWS.map(({ title, key }) => (
              <SideBarText
                key={key}
                onClick={() => changeView(key)}
                isActive={view === key}
                text={t(title)}
              />
            ))}
          </ul>
        </div>
        <div className='w-full py-4'>
          <ul className='space-y-4 pl-4'>
            {SECONDARY_VIEWS.map(({ title, key }) => (
              <SideBarText
                key={key}
                onClick={() => changeView(key)}
                isActive={view === key}
                text={t(title)}
              />
            ))}
            <SideBarText text={t('sidebar.theme')} />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
