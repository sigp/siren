import Typography from '../Typography/Typography'
import { ReactComponent as ValidatorLogo } from '../../assets/images/validators.svg'
import { ReactComponent as ExitIcon } from '../../assets/images/exit.svg'
import { ReactComponent as UnknownIcon } from '../../assets/images/unknown.svg'
import { ReactComponent as CheckIcon } from '../../assets/images/check.svg'
import { ReactComponent as SlasherIcon } from '../../assets/images/slasher.svg'
import { FC } from 'react'
import { ValidatorInfo } from '../../types/validator'

export interface ValidatorRowProps {
  validator: ValidatorInfo
}

const ValidatorRow: FC<ValidatorRowProps> = ({ validator }) => {
  const { id, title, pubKey, balance, rewards, processed, missed, attested, aggregated, status } =
    validator

  const renderStatus = () => {
    switch (status) {
      case 'active':
        return <CheckIcon className='h-4 w-4 text-success' />
      case 'unknown':
        return <UnknownIcon className='h-4 w-4 text-warning' />
      case 'active-slash':
        return (
          <div className='flex items-center space-x-2'>
            <SlasherIcon className='h-4 w-4 text-error' />
            <ExitIcon className='h-4 w-4 text-error' />
          </div>
        )
    }
  }

  return (
    <tr className='w-full border-t-style500 h-12'>
      <th className='px-2'>
        <div className='w-full flex justify-center'>
          <div className='w-8 h-8 bg-gradient-to-br from-primaryBright via-primary to-secondary rounded-full' />
        </div>
      </th>
      <th className='w-28'>
        <Typography className='text-left' color='text-dark500' type='text-caption2'>
          {title}
        </Typography>
      </th>
      <th className='border-r-style500 px-2'>
        <Typography color='text-dark500' type='text-caption1'>
          {id}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='text-left'>
          {pubKey}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography type='text-caption1' className='text-left' darkMode='dark:text-white' isBold>
          {balance}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='uppercase'>
          {rewards}
        </Typography>
      </th>
      <th className='px-1'>
        <Typography color='text-dark500' type='text-caption1' className='whitespace-nowrap'>
          {processed} / {missed}
        </Typography>
      </th>
      <th className='px-1'>
        <Typography color='text-dark500' type='text-caption1'>
          {attested}
        </Typography>
      </th>
      <th className='px-1'>
        <Typography color='text-dark500' type='text-caption1'>
          {aggregated}
        </Typography>
      </th>
      <th className='border-r-style500 px-4'>
        <div className='flex items-center justify-between flex-wrap w-full max-w-tiny'>
          <Typography color='text-dark500' type='text-tiny' className='uppercase'>
            {status}
          </Typography>
          {renderStatus()}
        </div>
      </th>
      <th className='border-r-style500 px-2'>
        <div className='w-full flex justify-center'>
          <div className='w-8 h-8 bg-primary50 dark:bg-dark750 rounded-full flex items-center justify-center'>
            <i className='bi bi-box-arrow-in-up-right text-primary' />
          </div>
        </div>
      </th>
      <th className='px-2'>
        <div className='w-full flex justify-center'>
          <div className='w-8 h-8 bg-primary50 dark:bg-dark750 rounded-full flex items-center justify-center'>
            <div className='w-4 h-4'>
              <ValidatorLogo className='text-primary' />
            </div>
          </div>
        </div>
      </th>
    </tr>
  )
}

export default ValidatorRow
