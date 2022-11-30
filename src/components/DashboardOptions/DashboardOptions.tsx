import DropDown from '../DropDown/DropDown';
import { useState } from 'react';
import DropDownItem from '../DropDown/DropDownItem';
import useClickOutside from '../../hooks/useClickOutside';
import { useSetRecoilState } from 'recoil';
import { dashView } from '../../recoil/atoms';
import { ContentView } from '../../constants/enums';
import { useTranslation } from 'react-i18next';

const DashboardOptions = () => {
  const {t} = useTranslation()
  const [isOpen, toggle] = useState(false)
  const setDashView = useSetRecoilState(dashView)

  const { ref } = useClickOutside<HTMLDivElement>(() => toggle(false))

  const viewSettings = () => {
    toggle(false)
    setDashView(ContentView.SETTINGS)
  }
  const openOptions = () => toggle(true)

  return (
    <div ref={ref} className="relative">
      <i onClick={openOptions} className='bi bi-three-dots dark:text-white flex-grow-0 -mt-2 cursor-pointer' />
      <DropDown position="top-full -left-12 z-50 " width="w-28" isOpen={isOpen}>
        <DropDownItem text={t('sidebar.settings')} onClick={viewSettings}/>
      </DropDown>
    </div>
  )
}

export default DashboardOptions;