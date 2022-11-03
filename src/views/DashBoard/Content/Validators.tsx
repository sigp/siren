import Typography from '../../../components/Typography/Typography';
import useValidatorInfoPolling from '../../../hooks/useValidatorInfoPolling';
import ValidatorTable, { TableErrorFallback, TableFallback } from '../../../components/ValidatorTable/ValidatorTable';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ValidatorSummary from '../../../components/ValidatorSummary/ValidatorSummary';
import Button, { ButtonFace } from '../../../components/Button/Button';
import ValidatorSearchInput from '../../../components/ValidatorSearchInput/ValidatorSearchInput';

const Validators = () => {
  useValidatorInfoPolling()

  return (
    <div className='w-full grid grid-cols-1 lg:block lg:h-full p-4 mb-28 lg:mb-0'>
      <div className="w-full space-y-6 mb-6">
        <div className="w-full flex justify-between">
          <Typography fontWeight="font-light" type="text-subtitle1">Validator Management</Typography>
          <ValidatorSummary/>
        </div>
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <Typography type="text-subtitle2" color="text-transparent" darkMode="text-transparent" className='primary-gradient-text' fontWeight="font-light">Overview</Typography>
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
            <ValidatorSearchInput/>
            <div className="flex justify-center lg:justify-start space-x-4">
              <Button type={ButtonFace.SECONDARY}>Deposit <i className="bi-arrow-down-circle ml-3"/></Button>
              <Button type={ButtonFace.SECONDARY}>Add  <i className="bi-plus-circle-fill ml-3"/></Button>
            </div>
          </div>
        </div>
      </div>
      <ErrorBoundary fallback={<TableErrorFallback />}>
        <Suspense fallback={<TableFallback />}>
          <ValidatorTable isFilter view="full" />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default Validators
