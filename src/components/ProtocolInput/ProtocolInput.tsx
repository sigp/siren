import { Control, Controller } from 'react-hook-form'
import Toggle from '../Toggle/Toggle'
import { ChangeEvent, FC } from 'react'
import { ConnectionForm, EndPointType } from '../../forms/ConfigConnectionForm'
import { Protocol, UiMode } from '../../constants/enums'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import Tooltip from '../ToolTip/Tooltip'
import { OptionalBoolean } from '../../types'

export interface ProtocolInputProps {
  id: string
  type?: EndPointType | undefined
  control: Control<ConnectionForm>
  setValue: any
  getValues: any
  isValid?: OptionalBoolean
}

const ProtocolInput: FC<ProtocolInputProps> = ({
  id,
  control,
  setValue,
  getValues,
  type,
  isValid,
}) => {
  const { t } = useTranslation()
  const defaultType = type || 'beaconNode'
  const protocol = getValues(`${defaultType}.protocol` as any)
  const isValidatorClient = type === 'validatorClient'
  const uiMode = UiMode.DARK
  const onChangeProtocol = (value: boolean) => {
    const protocolValue = value ? Protocol.HTTPS : Protocol.HTTP
    if (type) {
      setValue(`${type}.protocol`, protocolValue, { shouldValidate: true })
      return
    }

    setValue('beaconNode.protocol', protocolValue)
    setValue('validatorClient.protocol', protocolValue)
  }
  const onChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (type) {
      setValue(`${type}.address`, value)
      return
    }

    setValue('beaconNode.address', value)
    setValue('validatorClient.address', value)
  }
  const onChangePort = (e: ChangeEvent<HTMLInputElement>, type: EndPointType) => {
    setValue(`${type}.port`, e.target.value ? Number(e.target.value) : ('' as any))
  }

  const renderPortInput = (type: EndPointType) => {
    const isBnNode = type === 'beaconNode'
    return (
      <div className='space-y-4'>
        <div className='flex space-x-2 items-center'>
          <Typography
            isBold
            color='text-dark500'
            className='flex-grow-0 uppercase md:text-caption1'
            type='text-caption2'
          >
            {t(`protocolInput.${isBnNode ? 'beaconPort' : 'vcPort'}`)}
          </Typography>
          <Tooltip
            id={`${type}-port-tooltip`}
            toolTipMode={UiMode.DARK}
            maxWidth={isBnNode ? 350 : 200}
            text={t(`protocolInput.${isBnNode ? 'bNPortToolTip' : 'vCPortToolTip'}`)}
          >
            <i className='bi-question-circle-fill text-caption2 md:text-caption1  text-dark500' />
          </Tooltip>
        </div>
        <Controller
          name={`${isBnNode ? 'beaconNode' : 'validatorClient'}.port` as any}
          control={control as any}
          render={({ field: { ...props } }) => (
            <input
              className='text-body md:text-subtitle2 w-20 bg-transparent text-white outline-none appearance-none'
              type='number'
              {...props}
              onChange={(e) => onChangePort(e, type)}
            />
          )}
        />
      </div>
    )
  }

  return (
    <div className='flex items-end justify-between border-b border-white w-full pb-4'>
      <div className='flex flex-wrap space-x-1 md:space-x-4'>
        <div className='space-y-4'>
          <div className='flex'>
            <Typography
              isBold
              color='text-dark500'
              className='w-16 flex-grow-0 uppercase'
              type='text-tiny'
            >
              {t('protocolInput.httpProtocol')}
            </Typography>
            <Tooltip
              toolTipMode={uiMode}
              id={`${id}-protocol-tooltip`}
              maxWidth={200}
              text={t('protocolInput.httpToolTip')}
            >
              <i className='bi-question-circle-fill text-caption2 md:text-caption1 text-dark500' />
            </Tooltip>
          </div>
          <Controller
            name={`${defaultType}.protocol` as any}
            control={control as any}
            render={({ field: { value } }) => (
              <Toggle id={id} value={value === Protocol.HTTPS} onChange={onChangeProtocol} />
            )}
          />
        </div>
        <div className='space-y-4'>
          <div className='flex space-x-2 items-center'>
            <Typography
              isBold
              color='text-dark500'
              className='flex-grow-0 uppercase md:text-caption1'
              type='text-caption2'
            >
              {t(`protocolInput.${isValidatorClient ? 'vcAddress' : 'beaconAddress'}`)}
            </Typography>
            <Tooltip
              maxWidth={isValidatorClient ? 200 : 150}
              toolTipMode={uiMode}
              id={`${id}-ip-tooltip`}
              text={
                isValidatorClient ? t('protocolInput.ipVCToolTip') : t('protocolInput.ipBnToolTip')
              }
            >
              <i className='bi-question-circle-fill text-caption2 md:text-caption1  text-dark500' />
            </Tooltip>
          </div>
          <div className='relative flex w-28 md:w-44 items-center'>
            <Typography
              color='text-dark500'
              className='flex-grow-0 lowercase md:text-subtitle2'
            >{`${protocol}://`}</Typography>
            <Controller
              name={`${defaultType}.address` as any}
              control={control as any}
              render={({ field: { value } }) => (
                <input
                  className='text-body w-full md:text-subtitle2 flex-1 bg-transparent text-white outline-none'
                  type='text'
                  value={value}
                  onChange={onChangeAddress}
                />
              )}
            />
          </div>
        </div>
        {!type ? (
          <>
            {renderPortInput('beaconNode')}
            {renderPortInput('validatorClient')}
          </>
        ) : (
          renderPortInput(defaultType)
        )}
      </div>
      <i
        className={`bi-check-circle-fill text-body md:text-subtitle2 ${
          isValid ? 'text-success' : 'text-dark500 opacity-20'
        }`}
      />
    </div>
  )
}

export default ProtocolInput
