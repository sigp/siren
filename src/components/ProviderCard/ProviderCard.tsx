import { FC } from 'react'
import Typography from '../Typography/Typography'

export interface ProviderCardProps {
  onClick?: () => void
  isActive?: boolean
  id: number
  title: string
  subTitle: string
  provider: string
  language: string
  className?: string
}

const ProviderCard: FC<ProviderCardProps> = ({
  isActive,
  onClick,
  title,
  provider,
  subTitle,
  language,
  className,
  id,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative shrink-0 cursor-pointer w-60 h-80 group hover:p-0.5 bg-gradient-to-b from-primary via-secondary to-tertiary ${className}`}
    >
      {!isActive && (
        <div className='w-full h-full bg-black group-hover:border-0 border border-dark500' />
      )}
      <div className='z-10 absolute flex flex-col justify-between top-0 left-0 h-full w-full p-4'>
        <div>
          <div className='w-full flex justify-between items-center'>
            <Typography color='text-white' fontWeight='font-light'>
              {String(id).padStart(2, '0')}
            </Typography>
            <i
              className={`bi-info-circle-fill ${
                isActive ? 'text-white' : 'text-dark500 group-hover:text-primary'
              }`}
            />
          </div>
          <Typography color='text-white' fontWeight='font-light' className='w-1/2'>
            {title}
          </Typography>
        </div>
        <div className='h-11/20 w-full flex flex-col justify-between'>
          <Typography color='text-white' fontWeight='font-light' type='text-subtitle1'>
            {provider}
          </Typography>
          <div className='w-full flex space-x-4 items-end'>
            <Typography color='text-white' fontWeight='font-light' className='w-1/2'>
              {subTitle}
            </Typography>
            <Typography color='text-white' isBold>
              {language}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderCard
