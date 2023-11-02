import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const AppLoadFallback = () => {
  return (
    <div className='relative w-screen h-screen bg-gradient-to-r from-primary to-tertiary'>
      <div className='absolute top-0 left-0 w-full h-full bg-cover bg-lighthouse' />
      <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
        <LoadingSpinner />
      </div>
    </div>
  )
}

export default AppLoadFallback
