import {
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useState,
  ClipboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from 'react'
import { Message } from 'react-hook-form/dist/types/errors'
import { UiMode } from '../../constants/enums'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined
  extraLabel?: string
  tooltip?: string
  error?: Message | undefined
  toolTipId?: string
  toolTipMode?: UiMode
  toolTipMaxWidth?: number
  className?: string
  uiMode?: UiMode | undefined
  isDisableToggle?: boolean
  isDisablePaste?: boolean
  inputStyle?: 'primary' | 'secondary' | 'noBorder'
  icon?: string
  isAutoFocus?: boolean
}

const Input: FC<InputProps> = ({
  label,
  extraLabel,
  tooltip,
  type,
  error,
  className,
  uiMode,
  inputStyle = 'primary',
  toolTipId,
  toolTipMode,
  toolTipMaxWidth = 250,
  isDisableToggle,
  isDisablePaste,
  icon,
  onChange,
  isAutoFocus,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputType, setType] = useState<HTMLInputTypeAttribute>(type || 'text')
  const isPasswordType = type === 'password'
  const sanitizeInput = (e: ChangeEvent<HTMLInputElement>) => {
    return {
      ...e,
      target: {
        ...e.target,
        value: e.target.value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/onerror\s*=\s*["'][^"']*["']/gi, ''),
      },
    }
  }

  const generateInputStyle = () => {
    switch (inputStyle) {
      case 'noBorder':
        return 'text-dark500 p-2 bg-transparent'
      case 'secondary':
        return 'text-dark500 border-style p-2 bg-transparent'
      default:
        return `${
          uiMode === UiMode.LIGHT
            ? 'text-dark500 bg-dark10 border-dark500 px-2'
            : 'bg-transparent text-white border-white placeholder:text-dark500'
        } font-light border-b text-body md:text-subtitle1`
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (isDisablePaste) {
      e.preventDefault()
    }
  }

  const togglePassword = () => setType((prev) => (prev === 'password' ? 'text' : 'password'))

  useEffect(() => {
    if (isAutoFocus && inputRef.current) {
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          inputRef.current?.focus()
        }
      }, 200)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [isAutoFocus, inputRef])

  return (
    <div className='space-y-4 w-full'>
      {label && (
        <div className='flex items-center space-x-2'>
          <Typography
            isBold
            family='font-archivo'
            color='text-dark500'
            className='uppercase md:text-caption1'
            type='text-caption2'
          >
            {label}
          </Typography>
          {tooltip && toolTipId && (
            <Tooltip
              toolTipMode={toolTipMode}
              maxWidth={toolTipMaxWidth}
              id={toolTipId}
              text={tooltip}
            >
              <i className='bi-question-circle-fill text-caption2 md:text-caption1 text-dark500' />
            </Tooltip>
          )}
          {extraLabel && (
            <Typography
              family='font-archivo'
              color='text-dark500'
              className='uppercase'
              type='text-caption2'
            >
              {extraLabel}
            </Typography>
          )}
        </div>
      )}
      <div className='relative w-full'>
        <input
          {...props}
          ref={inputRef}
          onChange={(value) => onChange?.(sanitizeInput(value))}
          onPaste={handlePaste}
          type={inputType}
          className={`${isPasswordType || icon ? 'pr-5' : ''} ${
            className ? className : ''
          } pb-2 w-full font-openSauce outline-none ${generateInputStyle()}`}
        />
        {isPasswordType && !isDisableToggle ? (
          <i
            onClick={togglePassword}
            className={`cursor-pointer text-caption1 md:text-body ${
              inputType === 'password' ? 'bi-eye-slash-fill' : 'bi-eye-fill'
            } text-dark500 absolute right-3 top-1/2 -translate-y-1/2`}
          />
        ) : icon ? (
          <i
            className={`text-caption1 ${icon} text-dark500 absolute right-3 top-1/2 -translate-y-1/2`}
          />
        ) : null}
        <div className='absolute -bottom-6 left-0'>
          <Typography
            type='text-caption2'
            color='text-error'
            darkMode='dark:text-error'
            className='capitalize'
          >
            {error}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Input
