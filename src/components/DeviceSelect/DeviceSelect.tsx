import { useSetRecoilState } from 'recoil'
import { appView } from '../../recoil/atoms'
import { FC, MouseEvent, useMemo, useState } from 'react'
import RodalModal from '../RodalModal/RodalModal'
import useLocalStorage from '../../hooks/useLocalStorage'
import { DeviceKeyStorage, DeviceListStorage } from '../../types/storage'
import { AppView, UiMode } from '../../constants/enums'
import { DeviceList, OptionalString } from '../../types'
import Typography from '../Typography/Typography'
import DropDown from '../DropDown/DropDown'
import useClickOutside from '../../hooks/useClickOutside'
import addClassString from '../../utilities/addClassString'
import Button, { ButtonFace } from '../Button/Button'
import { useTranslation, Trans } from 'react-i18next'

export interface DeviceSelectProps {
  devices?: DeviceList | undefined
  value?: OptionalString
  uiMode?: UiMode
  type?: 'default' | 'black'
}

const DeviceSelect: FC<DeviceSelectProps> = ({ devices, value, uiMode, type }) => {
  const { t } = useTranslation()
  const isBlack = type === 'black'
  const setAppView = useSetRecoilState(appView)
  const [isOpen, toggle] = useState(false)
  const [targetKey, setTargetKey] = useState('')
  const [deletedDevices, setDeletedDevices] = useState<string[]>([])
  const [, setDeviceKey] = useLocalStorage<DeviceKeyStorage>('deviceKey', undefined)
  const [, storeDeviceList] = useLocalStorage<DeviceListStorage>('deviceList', undefined)

  const { ref } = useClickOutside<HTMLDivElement>(() => {
    toggle(false)
  })

  const deviceOptions = useMemo(() => {
    return Object.keys(devices ?? {})
      .filter((deviceKey) => deviceKey !== value && !deletedDevices.includes(deviceKey))
      .map((deviceKey) => ({ deviceKey, isLocked: devices?.[deviceKey]?.apiToken }))
  }, [devices, deletedDevices])

  const select = (selection: string) => {
    if (devices?.[selection]) {
      setDeviceKey(selection)
      setAppView(AppView.CHANGE_SCREEN)
    }
  }
  const toggleDropdown = () => toggle((prevState) => !prevState)

  const confirmDelete = (e: MouseEvent<HTMLElement>, deviceKey: string) => {
    e.stopPropagation()
    setTargetKey(deviceKey)
  }
  const closeConfirm = () => setTargetKey('')

  const deleteDevice = () => {
    setDeletedDevices((prev) => [...prev, targetKey])
    storeDeviceList(
      Object.keys(devices ?? {}).reduce((result: DeviceList, currentKey) => {
        const settings = devices?.[currentKey]
        if (currentKey !== targetKey && settings) {
          result[currentKey] = settings
        }
        return result
      }, {}),
    )
    setTargetKey('')
  }

  const activeDevice = devices && value ? devices?.[value] : undefined

  const buttonClasses = addClassString('relative border border-style500 w-full p-3', [
    isBlack ? 'bg-black' : 'dark:bg-dark800 bg-white',
  ])

  const itemClasses = addClassString('block cursor-pointer flex justify-between py-2 px-4', [
    !isBlack && 'hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white',
    isBlack && 'bg-dark750 hover:bg-dark600 text-white',
  ])
  const typographyClasses = addClassString('dark:text-dark300', [
    isBlack && 'dark:text-dark300 text-dark300',
  ])

  const chevronClasses = addClassString('bi-chevron-down', [
    !isBlack && 'text-dark900 dark:text-dark300',
    isBlack && 'text-white',
  ])

  const selectDisplayClasses = addClassString('flex space-x-4', [
    isBlack ? 'text-white' : 'dark:text-dark300',
  ])

  return (
    <>
      <div className='space-y-4 z-50'>
        <Typography
          type='text-caption2'
          family='font-archivo'
          isBold
          color='text-dark500'
          className='md:text-caption1'
          darkMode='dark:text-dark300'
        >
          {t('deviceSelect.label')}
        </Typography>
        <div ref={ref} className={buttonClasses}>
          <button
            onClick={toggleDropdown}
            id='dropdownDefault'
            disabled={!deviceOptions?.length}
            data-dropdown-toggle='dropdown'
            className='w-full space-x-2 focus:outline-none text-center flex items-center justify-between'
            type='button'
          >
            <div className={selectDisplayClasses}>
              {activeDevice &&
                (activeDevice.apiToken ? (
                  <i className='bi bi-lock-fill' />
                ) : (
                  <i className='bi bi-unlock' />
                ))}
              <Typography
                color={isBlack ? 'text-white' : undefined}
                isUpperCase
                className='capitalize'
              >
                {value}
              </Typography>
            </div>
            <i className={chevronClasses} />
          </button>
          <DropDown className='mt-2' isOpen={isOpen}>
            {deviceOptions.map(({ deviceKey, isLocked }, index) => (
              <li
                onClick={() => select(deviceKey)}
                className={itemClasses}
                key={index}
                data-testid='option'
              >
                <div className='flex space-x-4'>
                  {isLocked ? <i className='bi bi-lock-fill' /> : <i className='bi bi-unlock' />}
                  <Typography
                    isCapitalize
                    color={isBlack ? 'text-dark300' : undefined}
                    darkMode={typographyClasses}
                  >
                    {deviceKey}
                  </Typography>
                </div>
                <i onClick={(e) => confirmDelete(e, deviceKey)} className='bi bi-trash-fill' />
              </li>
            ))}
          </DropDown>
        </div>
      </div>
      <RodalModal
        styles={{ maxWidth: '420px' }}
        uiMode={uiMode ? { mode: uiMode } : undefined}
        isVisible={Boolean(targetKey)}
        onClose={closeConfirm}
      >
        <div className='p-6 space-y-8 flex flex-col items-center'>
          <Typography color={uiMode === UiMode.DARK ? 'text-dark300' : 'text-dark900'}>
            <Trans i18nKey='deviceSelect.confirmText'>
              <span className='uppercase font-bold' />
              {{ target: targetKey }}
            </Trans>
          </Typography>
          <Button type={ButtonFace.SECONDARY} onClick={deleteDevice}>
            {t('deviceSelect.confirmCta')}
          </Button>
        </div>
      </RodalModal>
    </>
  )
}

export default DeviceSelect
