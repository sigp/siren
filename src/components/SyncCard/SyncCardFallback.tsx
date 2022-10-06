import Spinner from '../Spinner/Spinner'

const SyncCardFallback = () => {
  return (
    <div className='flex-1 space-y-6 border border-dark100 flex items-center justify-center p-4'>
      <Spinner />
    </div>
  )
}

export default SyncCardFallback
