import React, { FC, useState } from 'react'
import ViewDisclosures, { ViewDisclosuresProps } from '../ViewDisclosures/ViewDisclosures'
import DisclosureModal from '../DisclosureModal/DisclosureModal'
import validatorDisclosure from '../../assets/images/validatorDisclosure.png'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import useUiMode from '../../hooks/useUiMode'

type ValidatorDisclosureProps = Omit<ViewDisclosuresProps, 'onClick'>

const ValidatorDisclosure: FC<ValidatorDisclosureProps> = (props) => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const [isOpen, toggleModal] = useState(false)

  const closeModal = () => toggleModal(false)
  const openModal = () => toggleModal(true)

  return (
    <>
      <ViewDisclosures {...props} onClick={openModal} />
      <DisclosureModal
        mode={mode}
        backgroundImage={validatorDisclosure}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          {t('disclosure.validator.title')}
        </Typography>
        <div className='mb-6'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.validator.text1')}
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.validator.text2')}
          </Typography>
        </div>
      </DisclosureModal>
    </>
  )
}

export default ValidatorDisclosure
