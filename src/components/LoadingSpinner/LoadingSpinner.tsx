import IconLogo from '../../assets/images/lightHouse.svg'
import IconSpinner from '../../assets/images/spinner.svg'

const LoadingSpinner = () => {
  return (
    <div className='relative'>
      <IconLogo className='text-white absolute top-0 left-0 w-6 h-6' />
      <IconSpinner className='text-white absolute -top-3 -left-3 w-12 h-12 animate-spin' />
    </div>
  )
}

export default LoadingSpinner
