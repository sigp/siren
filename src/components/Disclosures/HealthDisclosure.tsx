import ViewDisclosures from '../ViewDisclosures/ViewDisclosures'
import React, { useState } from 'react'
import healthDisclosure from '../../assets/images/healthDisclosure.png'
import Typography from '../Typography/Typography'
import DisclosureModal from '../DisclosureModal/DisclosureModal'

const HealthDisclosure = () => {
  const [isOpen, toggleModal] = useState(false)

  const closeModal = () => toggleModal(false)
  const openModal = () => toggleModal(true)

  return (
    <>
      <ViewDisclosures onClick={openModal} />
      <DisclosureModal backgroundImage={healthDisclosure} onClose={closeModal} isOpen={isOpen}>
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          Health Check Disclosure
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

export default HealthDisclosure
