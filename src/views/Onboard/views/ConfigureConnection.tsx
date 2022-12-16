import Typography from '../../../components/Typography/Typography'
import ConfigConnectionForm from '../../../forms/ConfigConnectionForm'
import TabOption from '../../../components/TabOption/TabOption'
import { ConfigType } from '../../../constants/enums'
import ProtocolInput from '../../../components/ProtocolInput/ProtocolInput'
import Input from '../../../components/Input/Input'
import { Controller } from 'react-hook-form'
import Toggle from '../../../components/Toggle/Toggle'
import Button, { ButtonFace } from '../../../components/Button/Button'
import { ReactComponent as LightHouseSVG } from '../../../assets/images/lightHouseLarge.svg'
import { useTranslation } from 'react-i18next'
import SelectDropDown from '../../../components/SelectDropDown/SelectDropDown'

const ConfigureConnection = () => {
  const { t } = useTranslation()

  const selectDevice = () => {
    console.log('oky')
  }

  return (
    <div className='flex-1 relative w-full flex flex-col relative justify-center bg-black'>
      <LightHouseSVG className='hidden lg:block absolute w-3/4 @1024:w-9/10 xl:w-full -right-45 @1440:-right-35 top-0 animate-spin-slow' />
      <div className='h-full w-full overflow-scroll lg:max-w-xl xl:max-w-2xl @1440:max-w-3xl p-6 pt-16 md:p-12 md:pt-24 lg:pl-18 lg:pr-0 xl:pl-24 @1440:pl-28'>
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
            changeFormType,
            deviceInfos,
            isDisabled,
            // isValidDeviceName,
            ...props
          }) => (
            <div className='space-y-8'>
              <div className='flex space-x-20 pt-6'>
                <TabOption
                  onClick={() => changeFormType(ConfigType.BASIC)}
                  text={t('configScreen.basicSettings')}
                  isActive={formType === ConfigType.BASIC}
                />
                <TabOption
                  onClick={() => changeFormType(ConfigType.ADVANCED)}
                  toolTip='s'
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
                control={control}
                render={({ field: { ref: _ref, ...props }, fieldState: { error } }) => (
                  <Input
                    label={t('configScreen.apiToken')}
                    tooltip={t('configScreen.apiTokenToolTip')}
                    placeholder='***-*****-******'
                    type='password'
                    error={error?.message}
                    {...props}
                  />
                )}
              />
              <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                {deviceInfos && (
                  <SelectDropDown
                    bgColor='bg-dark950'
                    uiMode='dark'
                    isBoldLabel
                    labelType='text-caption1'
                    labelFont='font-archivo'
                    color='text-dark500'
                    label={t('configScreen.deviceName')}
                    className='w-full flex flex-col justify-between pb-3 border-b-style500'
                    onSelect={selectDevice}
                    options={deviceInfos.map(({ deviceName }) => ({
                      title: deviceName,
                      value: deviceName,
                    }))}
                  />
                )}
                {/* <Controller */}
                {/*   name='deviceName' */}
                {/*   control={control} */}
                {/*   render={({ field: { ref: _ref, ...props } }) => ( */}
                {/*     <Input */}
                {/*       label={t('configScreen.deviceName')} */}
                {/*       placeholder='Local Host' */}
                {/*       error={!isValidDeviceName ? t('error.deviceExists') : undefined} */}
                {/*       {...props} */}
                {/*     /> */}
                {/*   )} */}
                {/* /> */}
                <Controller
                  name='userName'
                  control={control}
                  render={({ field: { ref: _ref, ...props }, fieldState: { error } }) => (
                    <Input
                      label={t('configScreen.userNameLabel')}
                      placeholder={t('configScreen.userNamePlaceholder')}
                      error={error?.message}
                      {...props}
                    />
                  )}
                />
              </div>
              <div className='w-full flex justify-between'>
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
                <Controller
                  name='isRemember'
                  control={control}
                  render={({ field: { ref: _ref, ...props } }) => (
                    <Toggle id='isRemember' {...props} />
                  )}
                />
              </div>
              <Button onClick={onSubmit} isDisabled={isDisabled} type={ButtonFace.WHITE}>
                {t('configure')}
                <i className='ml-4 bi-arrow-right' />
              </Button>
            </div>
          )}
        </ConfigConnectionForm>
      </div>
    </div>
  )
}

export default ConfigureConnection
