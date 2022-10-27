import Typography from '../../../components/Typography/Typography'
import AccountEarning, {
  AccountEarningFallback,
} from '../../../components/AccountEarnings/AccountEarning'
import NetworkStats from '../../../components/NetworkStats/NetworkStats'
import ValidatorTable, {
  TableErrorFallback,
  TableFallback,
} from '../../../components/ValidatorTable/ValidatorTable'
import DiagnosticTable from '../../../components/DiagnosticTable/DiagnosticTable'
import ValidatorBalances, {
  ValidatorBalanceFallback,
} from '../../../components/ValidatorBalances/ValidatorBalances'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import useValidatorInfoPolling from '../../../hooks/useValidatorInfoPolling'
import { useRecoilValue } from 'recoil'
import { userName } from '../../../recoil/atoms'
import { selectValidatorVersion } from '../../../recoil/selectors/selectValidatorVersion';
import { selectBeaconVersion } from '../../../recoil/selectors/selectBeaconVersion';

const MainContent = () => {
  const { t } = useTranslation()
  const name = useRecoilValue(userName)
  const vcVersion = useRecoilValue(selectValidatorVersion)
  const beaconVersion = useRecoilValue(selectBeaconVersion)

  useValidatorInfoPolling()

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-12 h-full flex items-center justify-center'>
      <div className='col-span-6 xl:col-span-5 flex flex-col h-full p-4 lg:p-0'>
        <div className='p-4 flex items-center justify-between'>
          <Typography
            type='text-subtitle1'
            darkMode='dark:text-white'
            className='xl:text-h3 capitalize'
            fontWeight='font-light'
          >
            {t('helloUser', { user: name })}
          </Typography>
          <div className='flex space-x-16'>
            <div>
              <Typography type='text-tiny' family='font-roboto' darkMode='dark:text-white' isBold>
                {t('lighthouseVersion')}
              </Typography>
              <Typography type='text-tiny' color='text-dark400'>
                Beacon — {beaconVersion && (<><span className='text-primary font-bold uppercase'>{beaconVersion.version}</span>-<span>{beaconVersion.id}</span></>)}
              </Typography>
              <Typography type='text-tiny' color='text-dark400'>
                Validator — {vcVersion && (<><span className='text-primary font-bold uppercase'>{vcVersion.version}</span>-<span>{vcVersion.id}</span></>)}
              </Typography>
            </div>
            <i className='bi bi-three-dots dark:text-white flex-grow-0 -mt-2' />
          </div>
        </div>
        <Suspense fallback={<AccountEarningFallback />}>
          <AccountEarning />
        </Suspense>
        <Suspense fallback={<ValidatorBalanceFallback />}>
          <ValidatorBalances />
        </Suspense>
      </div>
      <div className='flex flex-col col-span-6 xl:col-span-7 h-full py-2 px-4'>
        <NetworkStats />
        <ErrorBoundary fallback={<TableErrorFallback />}>
          <Suspense fallback={<TableFallback />}>
            <ValidatorTable />
          </Suspense>
        </ErrorBoundary>
        <DiagnosticTable />
      </div>
    </div>
  )
}

export default MainContent
