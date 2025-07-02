import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportView } from '../../../../constants/enums'
import Typography from '../../../Typography/Typography'

export interface SelectImportTypeViewProps {
  onChangeView: (view: ImportView) => void
}

const SelectImportTypeView: FC<SelectImportTypeViewProps> = ({ onChangeView }) => {
  const { t } = useTranslation()

  const viewKeystoreUpload = () => onChangeView(ImportView.UPLOAD)
  const viewCreateKeystore = () => onChangeView(ImportView.CREATE)

  return (
    <div className='space-y-8 w-full h-full flex flex-col'>
      <div>
        <Typography type='text-subtitle2'>{t('validatorManagement.addValidator.title')}</Typography>
        <Typography type='text-caption' color='text-dark500' darkMode='dark:text-dark500'>
          {t('validatorManagement.addValidator.subTitle')}
        </Typography>
      </div>
      <div className='flex-1 flex space-x-16'>
        <button
          onClick={viewCreateKeystore}
          className='w-full max-w-[450px] text-left h-full border-style p-4 flex flex-col'
        >
          <div className='flex-1'>
            <Typography>Import fresh password protected keystore files.</Typography>
          </div>
          <div className='space-y-24'>
            <div className='w-full max-w-96'>
              <Typography type='text-h3'>New Validator Keystore</Typography>
            </div>
            <Typography>Generate a new keystore using your mnemonic and validator index</Typography>
          </div>
        </button>
        <button
          onClick={viewKeystoreUpload}
          className='w-full max-w-[450px] text-left h-full border-style p-4 flex flex-col'
        >
          <div className='flex-1'>
            <Typography>Import fresh password protected keystore files.</Typography>
          </div>
          <div className='space-y-24'>
            <div className='w-full max-w-96'>
              <Typography type='text-h3'>Existing Validator Keystore</Typography>
            </div>
            <Typography>Select or drag and drop an already exising keystore.</Typography>
          </div>
        </button>
      </div>
    </div>
  )
}

export default SelectImportTypeView
