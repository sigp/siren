import Typography from '../Typography/Typography'
import { ReactComponent as ValidatorLogo } from '../../assets/images/validators.svg'
import { ReactComponent as SatelliteLogo } from '../../assets/images/satellite.svg'
import ValidatorRow from './ValidatorRow'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil';
import { selectValidators } from '../../recoil/selectors/selectValidators';
import Spinner from '../Spinner/Spinner';

export const TableFallback = () => (
  <div className='w-full flex items-center justify-center h-60 overflow-scroll mt-2 border-style500'>
    <Spinner/>
  </div>
)

export const TableErrorFallback = () => {
  const {t} = useTranslation()
  return (
    <div className='w-full flex items-center justify-center h-60 overflow-scroll mt-2 border-style500'>
      <Typography type="text-caption2" color="text-error" className="uppercase">{t('error.validatorInfo')}</Typography>
    </div>
  )
}

const ValidatorTable = () => {
  const { t } = useTranslation()

  const validators = useRecoilValue(selectValidators)

  return (
    <div className='w-full max-h-60.5 overflow-scroll mt-2 border-style500'>
      <table className='relative table-auto w-full'>
        <thead className='sticky top-0 left-0 bg-white dark:bg-darkPrimary'>
          <tr className='w-full h-12'>
            <th>
              <div className='w-full flex justify-center'>
                <div className='w-4 h-4'>
                  <ValidatorLogo className='dark:text-white' />
                </div>
              </div>
            </th>
            <th>
              <Typography className='text-left capitalize'>{t('validators')}</Typography>
            </th>
            <th className='relative border-r-style500 pr-2'>
              <Typography>{validators.length}</Typography>
              <div className='absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary' />
            </th>
            <th className='pl-2'>
              <Typography color='text-dark500' type='text-tiny' className='text-left uppercase'>
                PUBKEY
              </Typography>
            </th>
            <th>
              <Typography color='text-dark500' type='text-tiny' className='uppercase text-left'>
                {t('balance')}
              </Typography>
            </th>
            <th>
              <Typography color='text-dark500' type='text-tiny' className='uppercase'>
                {t('rewards')}
              </Typography>
            </th>
            <th>
              <div className='w-full flex justify-center'>
                <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                  <Typography color='text-dark500' type='text-tiny'>
                    PR
                  </Typography>
                </div>
              </div>
            </th>
            <th>
              <div className='w-full flex justify-center'>
                <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                  <Typography color='text-dark500' type='text-tiny'>
                    AT
                  </Typography>
                </div>
              </div>
            </th>
            <th>
              <div className='w-full flex justify-center'>
                <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                  <Typography color='text-dark500' type='text-tiny'>
                    AG
                  </Typography>
                </div>
              </div>
            </th>
            <th className='border-r-style500 pl-2'>
              <Typography color='text-dark500' type='text-tiny' className='text-left uppercase'>
                {t('status')}
              </Typography>
            </th>
            <th className='border-r-style500'>
              <div className='w-full flex justify-center'>
                <div className='w-8 h-8 bg-dark300 dark:bg-dark600 rounded-full flex items-center justify-center'>
                  <div className='w-4 h-4'>
                    <SatelliteLogo className='text-white' />
                  </div>
                </div>
              </div>
            </th>
            <th>
              <div className='w-full flex justify-center'>
                <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                  <div className='w-4 h-4'>
                    <ValidatorLogo className='text-white' />
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {validators.map((validator, index) => (
            <ValidatorRow validator={validator} key={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ValidatorTable
