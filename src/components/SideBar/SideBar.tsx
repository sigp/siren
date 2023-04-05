import { ReactComponent as LightHouseLogo } from '../../assets/images/lightHouse.svg'
import { ReactComponent as LightHouseFullLogo } from '../../assets/images/lightHouseFull.svg'

import SideItem from './SideItem'
import SideBarText from './SideBarText'
import { PRIMARY_VIEWS, SECONDARY_VIEWS } from '../../constants/constants'
import { createElement, useCallback } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { dashView, isAppLockdown, isSessionAuthModal, isSideBarOpen } from '../../recoil/atoms'
import { ContentView } from '../../constants/enums'
import { useTranslation } from 'react-i18next'
import useUiMode from '../../hooks/useUiMode'
import UiModeIcon from '../UiModeIcon/UiModeIcon'
import useMediaQuery from '../../hooks/useMediaQuery'
import addClassString from '../../utilities/addClassString'
import useClickOutside from '../../hooks/useClickOutside'
import LockStatus from '../LockStatus/LockStatus'

const SideBar = () => {
  const { t } = useTranslation()
  const [view, setView] = useRecoilState(dashView)
  const [showSideBar, toggleSideBar] = useRecoilState(isSideBarOpen)
  const setIsAuthModal = useSetRecoilState(isSessionAuthModal)
  const isLocked = useRecoilValue(isAppLockdown)
  const { mode, toggleUiMode } = useUiMode()
  const isMobile = useMediaQuery('(max-width: 425px)')

  const openAuthModal = () => setIsAuthModal(true)

  const sideBarClasses = addClassString(
    'z-40 flex flex-col shadow-xl justify-between h-screen w-42 absolute top-0 left-0 bg-white border dark:bg-dark750 border-dark10 dark:border-dark700  transition-transform',
    [
      !isMobile && '-translate-x-44 group-sidebar-hover:translate-x-14',
      isMobile && !showSideBar && '-translate-x-44',
    ],
  )

  const closeSideBar = useCallback(() => {
    if (isMobile) {
      toggleSideBar(false)
    }
  }, [isMobile])

  const { ref } = useClickOutside<HTMLDivElement>(closeSideBar)

  const changeView = (key: ContentView) => {
    setView(key)
    closeSideBar()
  }

  const toggleUi = () => {
    toggleUiMode()
    closeSideBar()
  }

  return (
    <div className='relative group-sidebar'>
      <div className='flex-col justify-between z-50 relative hidden md:flex w-14.5 flex-shrink-0 h-screen border bg-white dark:bg-dark750 border-l-0 border-dark200 dark:border-dark700'>
        <div className='w-full'>
          <div className='w-full h-16 flex justify-center pt-3.5'>
            <LightHouseLogo className='w-6 h-6 text-black dark:text-white' />
          </div>
          <ul className='space-y-4'>
            {PRIMARY_VIEWS.map(({ logoComponent, key, isDisabled }) => (
              <SideItem
                key={key}
                onClick={() => changeView(key)}
                isDisabled={isDisabled}
                isActive={view === key}
              >
                {createElement(logoComponent)}
              </SideItem>
            ))}
          </ul>
        </div>
        <div className='w-full pb-4'>
          <ul className='space-y-4'>
            {SECONDARY_VIEWS.map(({ logoComponent, key, isDisabled }) => (
              <SideItem
                key={key}
                onClick={() => changeView(key)}
                isDisabled={isDisabled}
                isActive={view === key}
              >
                {createElement(logoComponent)}
              </SideItem>
            ))}
            <div className='w-full h-6 flex items-center justify-center'>
              <LockStatus onClick={openAuthModal} status={isLocked} />
            </div>
            <div className='w-full h-6 flex items-center justify-center'>
              <UiModeIcon onClick={toggleUiMode} mode={mode} />
            </div>
          </ul>
        </div>
      </div>
      <div ref={ref} className={sideBarClasses}>
        <div className='w-full'>
          <div className='w-full h-16 flex justify-center pt-1'>
            <LightHouseFullLogo className='w-34 text-black dark:text-white' />
          </div>
          <ul className='space-y-4 pl-4'>
            {PRIMARY_VIEWS.map(({ title, key, isDisabled }) => (
              <SideBarText
                key={key}
                isDisabled={isDisabled}
                onClick={() => changeView(key)}
                isActive={view === key}
                text={t(title)}
              />
            ))}
          </ul>
        </div>
        <div className='w-full py-4'>
          <ul className='space-y-4 pl-4'>
            {SECONDARY_VIEWS.map(({ title, key, isDisabled }) => (
              <SideBarText
                isDisabled={isDisabled}
                key={key}
                onClick={() => changeView(key)}
                isActive={view === key}
                text={t(title)}
              />
            ))}
            <SideBarText
              onClick={openAuthModal}
              className='w-auto mr-4'
              text={`Actions - ${isLocked ? 'Locked' : 'Unlocked'}`}
            />
            <div onClick={toggleUi} className='w-full flex items-center'>
              <SideBarText className='w-auto mr-4' text={t('sidebar.theme')} />
              <UiModeIcon className='md:hidden' mode={mode} />
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
