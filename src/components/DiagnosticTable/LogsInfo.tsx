import Typography from '../Typography/Typography'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'

const LogsInfo = () => {
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          Logs
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          view all
        </Typography>
      </div>
      <DiagnosticCard
        title='Critical Logs Per Minute'
        maxHeight='flex-1'
        status='bg-success'
        border='border-t-0 border-l-0 border-style500'
        subTitle='Critical'
        metric='0.01'
      />
      <DiagnosticCard
        isBackground={false}
        title='Errors'
        maxHeight='flex-1'
        status='bg-success'
        border='border-t-0 border-l-0 border-style500'
        subTitle='Validator Logs'
        metric='0.94 / HR'
      />
      <DiagnosticCard
        isBackground={false}
        title='Warnings'
        maxHeight='flex-1'
        status='bg-success'
        border='border-t-0 border-l-0 border-style500'
        subTitle='Validator Logs'
        metric='0.33 / HR'
      />
    </div>
  )
}

export default LogsInfo
