import React, { useState } from 'react'
import ViewDisclosures from '../ViewDisclosures/ViewDisclosures'
import DisclosureModal from '../DisclosureModal/DisclosureModal'
import syncDisclosure from '../../assets/images/syncDisclosure.png'
import Typography from '../Typography/Typography'

const SyncDisclosure = () => {
  const [isOpen, toggleModal] = useState(false)

  const closeModal = () => toggleModal(false)
  const openModal = () => toggleModal(true)

  return (
    <>
      <ViewDisclosures onClick={openModal} />
      <DisclosureModal backgroundImage={syncDisclosure} onClose={closeModal} isOpen={isOpen}>
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          Sync Disclosure
        </Typography>
        <div className='mb-6'>
          <Typography color='text-dark500' fontWeight='font-light'>
            You are currently syncing to the Ethereum Geth and Beacon node. This may take a while...
            None of this information is supposed to be taken as a guarantee.
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            The only way to become a validator is to make a one-way GöETH transaction to the deposit
            contract on the current Ethereum chain.
          </Typography>
        </div>
      </DisclosureModal>
    </>
  )
}
export default SyncDisclosure
