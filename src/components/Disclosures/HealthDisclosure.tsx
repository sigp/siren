import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import healthDisclosure from '../../assets/images/healthDisclosure.png'
import { UiMode } from '../../constants/enums'
import DisclosureModal from '../DisclosureModal/DisclosureModal'
import Typography from '../Typography/Typography'
import ViewDisclosures from '../ViewDisclosures/ViewDisclosures'

const HealthDisclosure = () => {
  const { t } = useTranslation()
  const [isOpen, toggleModal] = useState(false)

  const closeModal = () => toggleModal(false)
  const openModal = () => toggleModal(true)

  return (
    <>
      <ViewDisclosures onClick={openModal} />
      <DisclosureModal
        externalTarget='_blank'
        externalUrl='https://lighthouse-book.sigmaprime.io/system-requirements.html'
        backgroundImage={healthDisclosure}
        onClose={closeModal}
        mode={UiMode.LIGHT}
        isOpen={isOpen}
      >
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          {t('disclosure.healthCheck.title')}
        </Typography>
        <div className='mb-6'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.healthCheck.text1')}
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.healthCheck.text2')}
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.healthCheck.recommended')}
          </Typography>
          <ul className='list-disc pl-4 pt-2'>
            <li className='flex space-x-2'>
              <i className={'bi-plus-circle text-caption1 text-success'} />
              <Typography type='text-caption1' color='text-dark500' fontWeight='font-light'>
                {t('disclosure.healthCheck.item1')}
              </Typography>
            </li>
            <li className='flex space-x-2'>
              <i className={'bi-plus-circle text-caption1 text-success'} />
              <Typography type='text-caption1' color='text-dark500' fontWeight='font-light'>
                {t('disclosure.healthCheck.item2')}
              </Typography>
            </li>
            <li className='flex space-x-2'>
              <i className={'bi-plus-circle text-caption1 text-success'} />
              <Typography type='text-caption1' color='text-dark500' fontWeight='font-light'>
                {t('disclosure.healthCheck.item3')}
              </Typography>
            </li>
          </ul>
        </div>
      </DisclosureModal>
    </>
  )
}

export default HealthDisclosure
