import Spinner from '../Spinner/Spinner';

const SyncMetricFallback = () => {
  return (
    <div
      className="flex w-40 h-14 max-h-full bg-white flex items-center justify-center dark:bg-dark750 border border-borderLight dark:border-dark900"
    >
      <Spinner size="h-6 w-6"/>
    </div>
  )
}

export default SyncMetricFallback;