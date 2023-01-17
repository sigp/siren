const LoadingDots = () => {
  const circleCommonClasses = 'h-2 w-2 bg-primary200 dark:bg-white rounded-full'

  return (
    <div className='flex mt-5'>
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  )
}

export default LoadingDots
