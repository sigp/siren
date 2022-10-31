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
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import useValidatorInfoPolling from '../../../hooks/useValidatorInfoPolling'
import { useRecoilState } from 'recoil';
import { userName } from '../../../recoil/atoms'
import AppVersion from '../../../components/AppVersion/AppVersion';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { UsernameStorage } from '../../../types/storage';
import useBeaconHealthPolling from '../../../hooks/useBeaconHealthPolling';

const MainContent = () => {
  const { t } = useTranslation()
  const [username] = useLocalStorage<UsernameStorage>('username', undefined)
  const [name, setUsername] = useRecoilState(userName)

  useEffect(() => {
    if(username) {
      setUsername(username)
    }
  }, [username])

  useValidatorInfoPolling()
  useBeaconHealthPolling()

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
              <AppVersion/>
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
