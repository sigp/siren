import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import useValidatorCount from '../../hooks/useValidatorCount'

const ActiveValidatorCount = () => {
  const { t } = useTranslation()

  const { active_ongoing } = useValidatorCount()

  return (
    <div className='flex justify-between lg:justify-start lg:space-x-2'>
      <Typography color='text-dark300' isCapitalize type='text-caption1'>
        {t('validatorManagement.summary.active')}
      </Typography>
      <Typography isBold type='text-caption1'>
        {active_ongoing}
      </Typography>
    </div>
  )
}

export default ActiveValidatorCount
