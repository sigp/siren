import { useAnimationControls } from 'framer-motion'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BlockChainSvg from '../../../assets/images/blockchain-security.svg'
import MiningSvg from '../../../assets/images/mining-blocks.svg'
import SmartSvg from '../../../assets/images/smart-contract.svg'
import { AddValidatorOption, ValidatorManagementView } from '../../../types'
import Typography from '../../Typography/Typography'
import AddValOption, { AddValOptionProps } from './AddValOption'

export interface AddValidatorViewProps extends Pick<AddValOptionProps, 'onChangeView'> {}

const AddValidatorView: FC<AddValidatorViewProps> = ({ onChangeView }) => {
  const { t } = useTranslation()
  const options = [
    {
      title: t('validatorManagement.addValidator.options.recover.title'),
      subTitle: t('validatorManagement.addValidator.options.recover.subTitle'),
      caption: t('validatorManagement.addValidator.options.recover.caption'),
      isDisabled: true,
      isRecommended: false,
      SVG: SmartSvg,
      view: ValidatorManagementView.RECOVER,
    },
    {
      title: t('validatorManagement.addValidator.options.import.title'),
      subTitle: t('validatorManagement.addValidator.options.import.subTitle'),
      caption: t('validatorManagement.addValidator.options.import.caption'),
      isDisabled: true,
      isRecommended: false,
      SVG: BlockChainSvg,
      view: ValidatorManagementView.IMPORT,
    },
    {
      title: t('validatorManagement.addValidator.options.create.title'),
      subTitle: t('validatorManagement.addValidator.options.create.subTitle'),
      caption: t('validatorManagement.addValidator.options.create.caption'),
      isRecommended: true,
      SVG: MiningSvg,
      view: ValidatorManagementView.CREATE,
    },
  ] as AddValidatorOption[]
  const controls = useAnimationControls()

  useEffect(() => {
    controls.stop()
    controls.start((i) => ({
      x: 0,
      opacity: 100,
      transition: { duration: 0.3, delay: i * 0.1 },
    }))
  }, [controls])

  return (
    <div className='pt-8 space-y-8'>
      <div>
        <Typography type='text-subtitle2'>{t('validatorManagement.addValidator.title')}</Typography>
        <Typography type='text-caption' color='text-dark500' darkMode='dark:text-dark500'>
          {t('validatorManagement.addValidator.subTitle')}
        </Typography>
      </div>
      <div className='w-full flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-12'>
        {options.map((option, index) => (
          <AddValOption
            key={index}
            index={index}
            onChangeView={onChangeView}
            animControls={controls}
            data={option}
          />
        ))}
      </div>
    </div>
  )
}

export default AddValidatorView
