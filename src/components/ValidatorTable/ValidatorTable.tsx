import Typography from '../Typography/Typography'
import { ReactComponent as ValidatorLogo } from '../../assets/images/validators.svg'
import { ReactComponent as SatelliteLogo } from '../../assets/images/satellite.svg'
import ValidatorRow from './ValidatorRow'
import { useTranslation } from 'react-i18next'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectValidatorInfos } from '../../recoil/selectors/selectValidatorInfos'
import Spinner from '../Spinner/Spinner'
import { FC } from 'react'
import { selectFilteredValidators } from '../../recoil/selectors/selectFilteredValidators'
import useMediaQuery from '../../hooks/useMediaQuery'
import ValidatorInfoCard from '../ValidatorInfoCard/ValidatorInfoCard'
import { ContentView } from '../../constants/enums'
import { dashView, validatorIndex } from '../../recoil/atoms'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'

export type TableView = 'partial' | 'full'

export interface ValidatorTableProps {
  view?: TableView
  isFilter?: boolean
  className?: string
}

export const TableFallback = () => (
  <div className='w-full flex items-center justify-center h-60 overflow-scroll mt-2 border-style500'>
    <Spinner />
  </div>
)

export const TableErrorFallback = () => {
  const { t } = useTranslation()
  return (
    <div className='w-full flex items-center justify-center h-60 overflow-scroll mt-2 border-style500'>
      <Typography type='text-caption2' color='text-error' className='uppercase'>
        {t('error.validatorInfo')}
      </Typography>
    </div>
  )
}

const ValidatorTable: FC<ValidatorTableProps> = ({ view = 'partial', isFilter, className }) => {
  const { t } = useTranslation()

  const isTablet = useMediaQuery('(max-width: 768px)')
  const validators = useRecoilValue(selectValidatorInfos)
  const filteredValidators = useRecoilValue(selectFilteredValidators)

  const setDashView = useSetRecoilState(dashView)
  const setValidatorIndex = useSetRecoilState(validatorIndex)

  const data = isFilter ? filteredValidators : validators

  const viewValidator = (index: number) => {
    setValidatorIndex(index)
    setDashView(ContentView.VALIDATORS)
  }

  return data.length ? (
    <div
      className={`${className || ''} w-full ${view === 'partial' ? 'lg:max-h-60.5' : ''} ${
        isTablet ? 'flex flex-wrap space-y-4' : 'overflow-scroll mt-2 border-style500'
      }`}
    >
      {isTablet ? (
        data.map((validator, index) => (
          <ValidatorInfoCard
            onClick={() => viewValidator(validator.index)}
            className='shadow cursor-pointer'
            key={index}
            validator={validator}
          />
        ))
      ) : (
        <table className='relative table-auto w-full'>
          <thead className='sticky z-30 top-0 left-0 bg-white dark:bg-darkPrimary'>
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
                <Typography>{data.length}</Typography>
                <div className='absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary' />
              </th>
              <th className='pl-2'>
                <Typography color='text-dark500' type='text-tiny' isUpperCase className='text-left'>
                  PUBKEY
                </Typography>
              </th>
              <th>
                <Typography color='text-dark500' type='text-tiny' isUpperCase className='text-left'>
                  {t('balance')}
                </Typography>
              </th>
              <th>
                <Typography color='text-dark500' type='text-tiny' isUpperCase>
                  {t('rewards')}
                </Typography>
              </th>
              <th>
                <DisabledTooltip>
                  <div className='w-full flex justify-center'>
                    <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                      <Typography color='text-dark500' type='text-tiny'>
                        PR
                      </Typography>
                    </div>
                  </div>
                </DisabledTooltip>
              </th>
              <th>
                <DisabledTooltip>
                  <div className='w-full flex justify-center'>
                    <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                      <Typography color='text-dark500' type='text-tiny'>
                        AT
                      </Typography>
                    </div>
                  </div>
                </DisabledTooltip>
              </th>
              <th>
                <DisabledTooltip>
                  <div className='w-full flex justify-center'>
                    <div className='w-5 h-5 border-style500 rounded-full flex items-center justify-center'>
                      <Typography color='text-dark500' type='text-tiny'>
                        AG
                      </Typography>
                    </div>
                  </div>
                </DisabledTooltip>
              </th>
              <th className={`${view === 'partial' ? 'border-r-style500' : ''} pl-2`}>
                <Typography color='text-dark500' type='text-tiny' isUpperCase className='text-left'>
                  {t('status')}
                </Typography>
              </th>
              {view === 'full' && (
                <>
                  <th className='pl-2'>
                    <Typography
                      color='text-dark500'
                      type='text-tiny'
                      isUpperCase
                      className='text-center'
                    >
                      {t('run')}
                    </Typography>
                  </th>
                  <th className='pl-2'>
                    <Typography
                      color='text-dark500'
                      type='text-tiny'
                      isUpperCase
                      className='text-center'
                    >
                      {t('deposit')}
                    </Typography>
                  </th>
                  <th className='pl-2'>
                    <Typography
                      color='text-dark500'
                      type='text-tiny'
                      isUpperCase
                      className='text-center'
                    >
                      {t('exit')}
                    </Typography>
                  </th>
                  <th className='pl-2'>
                    <Typography
                      color='text-dark500'
                      type='text-tiny'
                      isUpperCase
                      className='text-center'
                    >
                      {t('keys')}
                    </Typography>
                  </th>
                  <th className='pl-2'>
                    <Typography
                      color='text-dark500'
                      type='text-tiny'
                      isUpperCase
                      className='text-center'
                    >
                      {t('edit')}
                    </Typography>
                  </th>
                </>
              )}
              <th className={`border-r-style500 ${view === 'full' ? 'border-l-style500' : ''}`}>
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
                  <div className='w-8 h-8 bg-primary dark:bg-primary150 rounded-full flex items-center justify-center'>
                    <div className='w-4 h-4'>
                      <ValidatorLogo className='text-white' />
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((validator, index) => (
              <ValidatorRow view={view} validator={validator} key={index} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  ) : isFilter ? (
    <div className='w-full p-8 flex items-center justify-center bg-dark10 dark:bg-dark700 min-h-60 opacity-70'>
      <Typography>{t('noResultsFound')}</Typography>
    </div>
  ) : (
    <TableFallback />
  )
}

export default ValidatorTable
