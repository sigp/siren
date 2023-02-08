import Typography from '../Typography/Typography'
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'

export interface ValidatorGraffitiInputProps {
  value?: string
}

const ValidatorGraffitiInput: FC<ValidatorGraffitiInputProps> = ({ value }) => {
  const { t } = useTranslation()
  return (
    <div className='w-full border-t flex'>
      <div className='border-r py-2 px-6 w-42'>
        <Typography type='text-caption1' className='w-1/2'>
          {t('validatorGraffiti')}
        </Typography>
      </div>
      <div className='flex-1 flex justify-between items-center px-8 py-3'>
        <Typography type='text-caption1' color='text-primary'>
          {value || t('graffitiGoesHere')}
        </Typography>
        <DisabledTooltip>
          <ValidatorActionIcon icon='bi-pencil-square' color='text-primary' />
        </DisabledTooltip>
      </div>
    </div>
  )
}

export default ValidatorGraffitiInput
