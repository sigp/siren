import { usePathname } from 'next/navigation'
import { createElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import LightHouseLogo from '../../assets/images/lightHouse.svg'
import LightHouseFullLogo from '../../assets/images/lightHouseFull.svg'
import { PRIMARY_VIEWS, SECONDARY_VIEWS } from '../../constants/constants'
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
    'z-40 group-sidebar-hover:z-top98 flex flex-col shadow-xl justify-between h-screen w-42 absolute top-0 left-0 bg-white border dark:bg-dark750 border-dark10 dark:border-dark700  transition-transform',
    [
      !isMobile && '-translate-x-44 group-sidebar-hover:translate-x-14',
      isMobile && !showSideBar && '-translate-x-44',
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
    <div className='relative group-sidebar'>
      <div className='flex-col justify-between z-50 group-sidebar-hover:z-top relative hidden md:flex w-14.5 flex-shrink-0 h-screen border bg-white dark:bg-dark750 border-l-0 border-dark200 dark:border-dark700'>
        <div className='w-full'>
          <div className='w-full h-16 flex justify-center pt-3.5'>
            <LightHouseLogo className='w-6 h-6 text-black dark:text-white' />
          </div>
          <ul className='space-y-4'>
            {PRIMARY_VIEWS.map(({ logoComponent, key, isDisabled, href }) => (
              <SideItem key={key} href={href} isDisabled={isDisabled} isActive={pathname === href}>
                {createElement(logoComponent)}
              </SideItem>
            ))}
          </ul>
        </div>
        <div className='w-full pb-4'>
          <ul className='space-y-4'>
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
          <div className='w-full h-16 flex justify-center pt-1'>
            <LightHouseFullLogo className='w-34 text-black dark:text-white' />
          </div>
          <ul className='space-y-4 pl-4'>
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
        <div className='w-full pb-6'>
          <ul className='space-y-4 pl-4'>
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
