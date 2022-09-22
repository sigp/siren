import Typography from '../../../components/Typography/Typography'
import ProviderCard from '../../../components/ProviderCard/ProviderCard'
import { CLIENT_PROVIDERS } from '../../../constants/constants'
import Button from '../../../components/Button/Button'
import { useState } from 'react'

const SelectProvider = () => {
  const [activeIndex, setActive] = useState<number | undefined>(undefined)

  return (
    <div className='flex-1 w-full flex flex-col relative justify-center bg-black'>
      <div className='pl-3 md:pl-24 xl:pl-52 w-full'>
        <Typography
          type='text-subtitle1'
          color='text-transparent'
          fontWeight='font-light'
          className='primary-gradient-text'
        >
          Configure Ethereum Provider
        </Typography>
        <Typography color='text-white' type='text-h3' className='mt-10' fontWeight='font-light'>
          Select the Ethereum 1.0 client provider you wish to sync.
        </Typography>
      </div>
      <div className='w-full flex space-x-8 overflow-x-auto mt-16 pr-60 pl-3 md:pl-24 xl:pl-52'>
        {CLIENT_PROVIDERS.map((props, index) => (
          <ProviderCard
            onClick={() => setActive(index)}
            isActive={activeIndex === index}
            key={index}
            id={index + 1}
            {...props}
          />
        ))}
      </div>
      <div className='pl-3 pt-14 md:pl-24 xl:pl-52'>
        <Button className='border-white' isDisabled={!activeIndex}>
          <Typography color={activeIndex !== undefined ? 'text-white' : 'text-dark500'}>
            Configure
          </Typography>
          <i
            className={`bi-arrow-right ${
              activeIndex !== undefined ? 'text-white' : 'text-dark500'
            }`}
          />
        </Button>
      </div>
    </div>
  )
}

export default SelectProvider
