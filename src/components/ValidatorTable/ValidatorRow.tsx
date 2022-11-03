import Typography from '../Typography/Typography'
import { ReactComponent as ValidatorLogo } from '../../assets/images/validators.svg'
import { ReactComponent as ExitIcon } from '../../assets/images/exit.svg'
import { ReactComponent as UnknownIcon } from '../../assets/images/unknown.svg'
import { ReactComponent as CheckIcon } from '../../assets/images/check.svg'
import { ReactComponent as SlasherIcon } from '../../assets/images/slasher.svg'
import { FC } from 'react'
import { ValidatorInfo } from '../../types/validator'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../utilities/formatEthAddress'
import { TableView } from './ValidatorTable';
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon';

export interface ValidatorRowProps {
  validator: ValidatorInfo
  view?: TableView,
}

const ValidatorRow: FC<ValidatorRowProps> = ({ validator, view }) => {
  const { t } = useTranslation()
  const { name, pubKey, index, balance, rewards, processed, missed, attested, aggregated, status } =
    validator

  const id = (index + 1).toString().padStart(2, '0')

  const renderStatus = () => {
    switch (status) {
      case 'active_ongoing':
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
          {name}
        </Typography>
      </th>
      <th className='border-r-style500 px-2'>
        <Typography color='text-dark500' type='text-caption1'>
          {id}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='text-left'>
          {formatEthAddress(pubKey)}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography type='text-caption1' className='text-left' darkMode='dark:text-white' isBold>
          {balance.toFixed(4)}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='uppercase'>
          {rewards.toFixed(4)}
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
            {t(`validatorStatus.${status}`)}
          </Typography>
          {renderStatus()}
        </div>
      </th>
      {
        view === 'full' && (
          <>
            <th className='px-2'>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon size="text-xs" border="border border-error" icon="bi-x-lg" color="text-error"/>
              </div>
            </th>
            <th className='px-2'>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon border="border border-primary100 dark:border-primary" icon="bi-arrow-down-circle"/>
              </div>
            </th>
            <th className='px-2'>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon border="border border-dark700" color="text-dark700 dark:text-dark400" icon="bi-box-arrow-right"/>
              </div>
            </th>
            <th className='px-2'>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon border="border border-primary100 dark:border-primary" icon="bi-key-fill"/>
              </div>
            </th>
          </>
        )
      }
      <th className="border-r-style500 px-2">
        <div className='w-full flex justify-center'>
          <ValidatorActionIcon icon="bi-box-arrow-in-up-right"/>
        </div>
      </th>
      <th className='px-2'>
        <div className='w-full flex justify-center'>
          <div className='w-8 h-8 border border-primary100 dark:border-primary bg-dark25 dark:bg-dark750 rounded-full flex items-center justify-center'>
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
