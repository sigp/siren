import Typography from '../../../components/Typography/Typography'
import ConfigConnectionForm from '../../../forms/ConfigConnectionForm'
import TabOption from '../../../components/TabOption/TabOption'
import { ConfigType, UiMode } from '../../../constants/enums'
import ProtocolInput from '../../../components/ProtocolInput/ProtocolInput'
import Input from '../../../components/Input/Input'
import { Controller } from 'react-hook-form'
import Toggle from '../../../components/Toggle/Toggle'
import Button, { ButtonFace } from '../../../components/Button/Button'
import { ReactComponent as LightHouseSVG } from '../../../assets/images/lightHouseLarge.svg'
import { useTranslation } from 'react-i18next'
import Tooltip from '../../../components/ToolTip/Tooltip'
import { REQUIRED_VALIDATOR_VERSION } from '../../../constants/constants'
import DeviceSelect from '../../../components/DeviceSelect/DeviceSelect'

const ConfigureConnection = () => {
  const { t } = useTranslation()
  const { major, minor, patch } = REQUIRED_VALIDATOR_VERSION
  return (
    <div className='flex-1 relative w-full flex flex-col relative justify-center bg-black'>
      <LightHouseSVG className='hidden lg:block absolute w-3/4 @1024:w-9/10 xl:w-full -right-45 @1440:-right-35 top-0 animate-spin-slow' />
      <div className='h-full w-full overflow-scroll scrollbar-hide lg:max-w-xl xl:max-w-2xl @1440:max-w-3xl p-6 pt-16 md:p-12 md:pt-24 lg:pl-18 lg:pr-0 xl:pl-24 @1440:pl-28'>
        <Typography
          color='text-transparent'
          fontWeight='font-light'
          className='md:text-subtitle1 primary-gradient-text'
        >
          {t('configScreen.configConnection')}
        </Typography>
        <ConfigConnectionForm>
          {({
            control,
            formType,
            onSubmit,
            isValidBeaconNode,
            isValidValidatorClient,
            isVersionError,
            setType,
            devices,
            isAddDevice,
            toggleDeviceInput,
            hasMultiDevice,
            storedDeviceName,
            ...props
          }) => (
            <>
              {isVersionError && (
                <div className='absolute top-0 left-0 w-full p-2 bg-error text-center'>
                  <Typography color='text-white' darkMode='dark:text-white' isBold>
                    {t('lighthouseVersionError', { major, minor, patch })}
                  </Typography>
                </div>
              )}
              <div className='space-y-8'>
                <div className='flex space-x-20 pt-6'>
                  <TabOption
                    onClick={() => setType(ConfigType.BASIC)}
                    text={t('configScreen.basicSettings')}
                    isActive={formType === ConfigType.BASIC}
                  />
                  <TabOption
                    onClick={() => setType(ConfigType.ADVANCED)}
                    toolTipId='advance'
                    toolTipMode={UiMode.DARK}
                    toolTip={t('configScreen.advanceSettingsToolTip')}
                    text={t('configScreen.advanceSettings')}
                    isActive={formType === ConfigType.ADVANCED}
                  />
                </div>
                {formType === ConfigType.ADVANCED ? (
                  <div className='space-y-8'>
                    <ProtocolInput
                      id='bnInput'
                      isValid={isValidBeaconNode}
                      type='beaconNode'
                      control={control}
                      {...props}
                    />
                    <ProtocolInput
                      id='vcInput'
                      isValid={isValidValidatorClient}
                      type='validatorClient'
                      control={control}
                      {...props}
                    />
                  </div>
                ) : (
                  <ProtocolInput
                    id='dualInput'
                    isValid={isValidBeaconNode && isValidValidatorClient}
                    control={control}
                    {...props}
                  />
                )}
                <Controller
                  name='apiToken'
                  control={control as any}
                  render={({ field: { ref: _ref, ...props }, fieldState }) => (
                    <Input
                      label={t('configScreen.apiToken')}
                      toolTipId='apiToken'
                      toolTipMode={UiMode.DARK}
                      toolTipMaxWidth={350}
                      tooltip={t('configScreen.apiTokenToolTip')}
                      placeholder='***-*****-******'
                      type='password'
                      error={fieldState.error?.message}
                      {...props}
                    />
                  )}
                />
                <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                  <div className='flex-1 space-y-2 mr-6'>
                    {isAddDevice && hasMultiDevice ? (
                      <DeviceSelect
                        type='black'
                        uiMode={UiMode.DARK}
                        devices={devices}
                        value={storedDeviceName}
                      />
                    ) : (
                      <Controller
                        name='deviceName'
                        control={control as any}
                        render={({ field: { ref: _ref, ...props } }) => (
                          <Input
                            label={t('configScreen.deviceName')}
                            placeholder='Local Host'
                            {...props}
                          />
                        )}
                      />
                    )}
                    {hasMultiDevice && (
                      <div onClick={toggleDeviceInput}>
                        <Typography
                          color='text-primaryBright'
                          className='cursor-pointer flex items-center'
                          isBold
                          type='text-caption2'
                        >
                          {isAddDevice && (
                            <span className='text-caption1 bi bi-plus-circle text-primaryBright mr-2' />
                          )}{' '}
                          {t(`deviceSelect.${isAddDevice ? 'addDevice' : 'selectDevice'}`)}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    <Controller
                      name='userName'
                      control={control as any}
                      render={({ field: { ref: _ref, ...props }, fieldState }) => (
                        <Input
                          className='w-auto'
                          label={t('configScreen.userNameLabel')}
                          placeholder={t('configScreen.userNamePlaceholder')}
                          error={fieldState.error?.message}
                          {...props}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between'>
                  <Tooltip
                    id='autoConnect'
                    toolTipMode={UiMode.DARK}
                    maxWidth={300}
                    text={t('configScreen.autoConnectToolTip')}
                  >
                    <div className='flex space-x-2'>
                      <Typography
                        type='text-tiny'
                        color='text-dark500'
                        family='font-archivo'
                        className='uppercase w-16'
                      >
                        {t('configScreen.autoConnect')}
                      </Typography>
                      <i className='bi-question-circle-fill text-dark500 text-caption1' />
                    </div>
                  </Tooltip>
                  <Controller
                    name='isRemember'
                    control={control as any}
                    render={({ field: { ref: _ref, ...props } }) => (
                      <Toggle id='isRemember' {...props} />
                    )}
                  />
                </div>
                <Button onClick={onSubmit} type={ButtonFace.WHITE}>
                  {t('configure')}
                  <i className='ml-4 bi-arrow-right' />
                </Button>
              </div>
            </>
          )}
        </ConfigConnectionForm>
      </div>
    </div>
  )
}

export default ConfigureConnection
