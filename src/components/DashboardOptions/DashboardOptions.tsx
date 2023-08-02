import DropDown from '../DropDown/DropDown'
import React, { useState } from 'react'
import DropDownItem from '../DropDown/DropDownItem'
import useClickOutside from '../../hooks/useClickOutside'
import { useSetRecoilState } from 'recoil'
import { dashView } from '../../recoil/atoms'
import { ContentView } from '../../constants/enums'
import { useTranslation } from 'react-i18next'
import Typography from '../Typography/Typography'
import { DiscordUrl, LighthouseBookUrl } from '../../constants/constants'
import ExternalLink from '../ExternalLink/ExternalLink'

const DashboardOptions = () => {
  const { t } = useTranslation()
  const [isOpen, toggle] = useState(false)
  const setDashView = useSetRecoilState(dashView)

  const { ref } = useClickOutside<HTMLDivElement>(() => toggle(false))

  const viewSettings = () => {
    toggle(false)
    setDashView(ContentView.SETTINGS)
  }
  const openOptions = () => toggle(true)

  return (
    <div ref={ref} className='relative'>
      <i
        onClick={openOptions}
        className='bi bi-three-dots dark:text-white flex-grow-0 -mt-2 cursor-pointer'
      />
      <DropDown position='top-full -left-24 lg:-left-12 z-top98' width='w-fit' isOpen={isOpen}>
        <DropDownItem onClick={viewSettings}>
          <div className='w-full flex space-x-2'>
            <i className='bi bi-gear-fill' />
            <Typography className='capitalize'>{t('sidebar.settings')}</Typography>
          </div>
        </DropDownItem>
        <ExternalLink href={DiscordUrl}>
          <DropDownItem>
            <div className='w-full flex space-x-2'>
              <i className='bi bi-discord' />
              <Typography className='capitalize'>Discord</Typography>
            </div>
          </DropDownItem>
        </ExternalLink>
        <ExternalLink href={LighthouseBookUrl}>
          <DropDownItem>
            <div className='w-full flex space-x-2'>
              <i className='bi bi-life-preserver' />
              <Typography className='capitalize'>{t('documentation')}</Typography>
            </div>
          </DropDownItem>
        </ExternalLink>
      </DropDown>
    </div>
  )
}

export default DashboardOptions
