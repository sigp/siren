import { usePathname } from 'next/navigation'
import { createElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import LightHouseLogo from '../../assets/images/lightHouse.svg'
import LightHouseFullLogo from '../../assets/images/lightHouseFull.svg'
import { PRIMARY_VIEWS, SECONDARY_VIEWS } from '../../constants/views'
import useClickOutside from '../../hooks/useClickOutside'
import useMediaQuery from '../../hooks/useMediaQuery'
import useUiMode from '../../hooks/useUiMode'
import { isSideBarOpen } from '../../recoil/atoms'
import UiModeIcon from '../UiModeIcon/UiModeIcon'
import SideBarText from './SideBarText'
import SideItem from './SideItem'

const SideBar = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [showSideBar, toggleSideBar] = useRecoilState(isSideBarOpen)
  const { mode, toggleUiMode } = useUiMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const sideBarClasses = addClassString(
    'z-40 group-sidebar-hover:z-top98 flex flex-col shadow-xl justify-between h-screen w-screen md:w-48 lg:w-52 @1600:w-56 absolute top-0 left-0 bg-white border dark:bg-dark750 border-dark10 dark:border-dark700  transition-transform',
    [
      !isMobile &&
        '-translate-x-52 lg:-translate-x-56 @1600:-translate-x-60 group-sidebar-hover:translate-x-14',
      isMobile &&
        !showSideBar &&
        '-translate-x-full md:-translate-x-52 lg:-translate-x-56 @1600:-translate-x-60',
    ],
  )

  const closeSideBar = useCallback(() => {
    if (isMobile) {
      toggleSideBar(false)
    }
  }, [isMobile, toggleSideBar])

  const { ref } = useClickOutside<HTMLDivElement>(closeSideBar)

  const toggleUi = () => {
    toggleUiMode()
    closeSideBar()
  }

  return (
    <div className='lg:max-w-[5vw] @1600:max-w-[6vw] relative group-sidebar'>
      <div className='flex-col justify-between z-50 group-sidebar-hover:z-top relative hidden md:flex w-14.5 lg:w-16 @1600:w-20 flex-shrink-0 h-screen border bg-white dark:bg-dark750 border-l-0 border-dark200 dark:border-dark700'>
        <div className='w-full'>
          <div className='w-full h-16 lg:h-20 @1600:h-24 flex justify-center items-center'>
            <LightHouseLogo className='w-6 h-6 lg:w-7 lg:h-7 @1600:w-8 @1600:h-8 text-black dark:text-white' />
          </div>
          <ul className='space-y-4 lg:space-y-6 @1600:space-y-8 lg:mt-4 @1600:mt-6'>
            {PRIMARY_VIEWS.map(({ logoComponent, key, isDisabled, href }) => (
              <SideItem key={key} href={href} isDisabled={isDisabled} isActive={pathname === href}>
                {createElement(logoComponent)}
              </SideItem>
            ))}
          </ul>
        </div>
        <div className='w-full pb-4 lg:pb-6 @1600:pb-8'>
          <ul className='space-y-4 lg:space-y-6 @1600:space-y-8'>
            {SECONDARY_VIEWS.map(({ logoComponent, key, isDisabled, href }) => (
              <SideItem key={key} href={href} isDisabled={isDisabled} isActive={pathname === href}>
                {createElement(logoComponent)}
              </SideItem>
            ))}
            <div className='w-full h-6 flex items-center justify-center'>
              <UiModeIcon onClick={toggleUi} mode={mode} />
            </div>
          </ul>
        </div>
      </div>
      <div ref={ref} className={sideBarClasses}>
        <div className='w-full'>
          <div className='w-full h-16 lg:h-20 @1600:h-24 flex justify-center items-center'>
            <LightHouseFullLogo className='w-32 lg:w-36 @1600:w-40 text-black dark:text-white' />
          </div>
          <ul className='space-y-4 lg:space-y-6 @1600:space-y-8 pl-4 lg:pl-6 @1600:pl-8 lg:mt-4 @1600:mt-6'>
            {PRIMARY_VIEWS.map(({ title, key, isDisabled, href }) => (
              <SideBarText
                key={key}
                href={href}
                isDisabled={isDisabled}
                isActive={pathname === href}
                text={t(title)}
              />
            ))}
          </ul>
        </div>
        <div className='w-full pb-6 lg:pb-8 @1600:pb-10'>
          <ul className='space-y-4 lg:space-y-6 @1600:space-y-8 pl-4 lg:pl-6 @1600:pl-8'>
            {SECONDARY_VIEWS.map(({ title, key, isDisabled, href }) => (
              <SideBarText
                isDisabled={isDisabled}
                key={key}
                href={href}
                isActive={pathname === href}
                text={t(title)}
              />
            ))}
            <div onClick={toggleUi} className='w-full flex items-center'>
              <SideBarText className='w-auto md:mr-4' text={t('sidebar.theme')} />
              <UiModeIcon className='md:hidden mr-4 ml-4 md:ml-0' mode={mode} />
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
