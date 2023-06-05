import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '../../../components/Typography/Typography'
import ValidatorSummary from '../../../components/ValidatorSummary/ValidatorSummary'
import ValidatorSearchInput from '../../../components/ValidatorSearchInput/ValidatorSearchInput'
import Button, { ButtonFace } from '../../../components/Button/Button'
import { ErrorBoundary } from 'react-error-boundary'
import ValidatorTable, {
  TableErrorFallback,
  TableFallback,
} from '../../../components/ValidatorTable/ValidatorTable'
import ValidatorModal from '../../../components/ValidatorModal/ValidatorModal'
import DisabledTooltip from '../../../components/DisabledTooltip/DisabledTooltip'
import BlsExecutionModal from '../../../components/BlsExecutionModal/BlsExecutionModal'

const Validators = () => {
  const { t } = useTranslation()

  return (
    <>
      <BlsExecutionModal />
      <div className='w-full grid grid-cols-1 lg:block lg:h-full p-4 mb-28 lg:mb-0'>
        <div className='w-full space-y-6 mb-6'>
          <div className='w-full flex flex-col items-center lg:flex-row space-y-8 lg:space-y-0 justify-between'>
            <Typography fontWeight='font-light' type='text-subtitle1' className='capitalize'>
              {t('validatorManagement.title')}
            </Typography>
            <ValidatorSummary />
          </div>
          <div className='flex flex-col lg:flex-row justify-between lg:items-center'>
            <Typography
              type='text-subtitle2'
              color='text-transparent'
              darkMode='text-transparent'
              className='primary-gradient-text capitalize'
              fontWeight='font-light'
            >
              {t('validatorManagement.overview')}
            </Typography>
            <div className='flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4'>
              <ValidatorSearchInput />
              <div className='flex justify-center lg:justify-start space-x-4'>
                <DisabledTooltip>
                  <Button type={ButtonFace.SECONDARY}>
                    {t('validatorManagement.actions.deposit')}{' '}
                    <i className='bi-arrow-down-circle ml-3' />
                  </Button>
                </DisabledTooltip>
                <DisabledTooltip>
                  <Button type={ButtonFace.SECONDARY}>
                    {t('validatorManagement.actions.add')}{' '}
                    <i className='bi-plus-circle-fill ml-3' />
                  </Button>
                </DisabledTooltip>
              </div>
            </div>
          </div>
        </div>
        <ErrorBoundary fallback={<TableErrorFallback />}>
          <Suspense fallback={<TableFallback />}>
            <ValidatorTable isFilter view='full' />
          </Suspense>
        </ErrorBoundary>
        <ValidatorModal />
      </div>
    </>
  )
}

export default Validators
