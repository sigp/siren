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

const ConfigureConnection = () => {
  return (
    <div className='flex-1 relative w-full flex flex-col relative justify-center bg-black'>
      <LightHouseSVG className='hidden lg:block absolute w-3/4 .85xl:w-9/10 xl:w-full -right-45 1.5xl:-right-35 top-0 animate-spin-slow' />
      <div className='h-full w-full overflow-scroll lg:max-w-xl xl:max-w-2xl 1.5xl:max-w-3xl p-6 pt-16 md:p-12 md:pt-24 lg:pl-18 lg:pr-0 xl:pl-24 1.5xl:pl-28'>
        <Typography
          color='text-transparent'
          fontWeight='font-light'
          className='md:text-subtitle1 primary-gradient-text'
        >
          Configure Connection
        </Typography>
        <ConfigConnectionForm>
          {({
            control,
            formType,
            onSubmit,
            isValidBeaconNode,
            isValidValidatorClient,
            changeFormType,
            isDisabled,
            ...props
          }) => (
            <div className='space-y-8'>
              <div className='flex space-x-20 pt-6'>
                <TabOption
                  onClick={() => changeFormType(ConfigType.BASIC)}
                  text='basic settings'
                  isActive={formType === ConfigType.BASIC}
                />
                <TabOption
                  onClick={() => changeFormType(ConfigType.ADVANCED)}
                  toolTip='s'
                  text='advanced settings'
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
                render={({ field: { ref: _ref, ...props } }) => (
                  <Input
                    label='Api Token'
                    tooltip='api token tooltip'
                    placeholder='***-*****-******'
                    type='password'
                    {...props}
                  />
                )}
              />
              <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                <Controller
                  name='deviceName'
                  control={control}
                  render={({ field: { ref: _ref, ...props } }) => (
                    <Input label='Device Name' placeholder='Local Host' {...props} />
                  )}
                />
                <Controller
                  name='userName'
                  control={control}
                  render={({ field: { ref: _ref, ...props } }) => (
                    <Input label='What should I call you?' placeholder='Name' {...props} />
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
                    Save Data Auto Connect
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
                Configure
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
