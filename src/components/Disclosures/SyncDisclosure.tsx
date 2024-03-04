import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import syncDisclosure from '../../assets/images/syncDisclosure.png'
import { UiMode } from '../../constants/enums'
import DisclosureModal from '../DisclosureModal/DisclosureModal'
import Typography from '../Typography/Typography'
import ViewDisclosures from '../ViewDisclosures/ViewDisclosures'

const SyncDisclosure = () => {
  const { t } = useTranslation()
  const [isOpen, toggleModal] = useState(false)

  const closeModal = () => toggleModal(false)
  const openModal = () => toggleModal(true)

  return (
    <>
      <ViewDisclosures onClick={openModal} />
      <DisclosureModal
        externalTarget='_blank'
        externalUrl='https://lighthouse-book.sigmaprime.io/run_a_node.html'
        backgroundImage={syncDisclosure}
        mode={UiMode.LIGHT}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          {t('disclosure.nodeSync.title')}
        </Typography>
        <div className='mb-6'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.nodeSync.text1')}
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.nodeSync.text2')}
          </Typography>
        </div>
      </DisclosureModal>
    </>
  )
}
export default SyncDisclosure
