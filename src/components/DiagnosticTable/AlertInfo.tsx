import Typography from '../Typography/Typography'
import AlertCard from '../AlertCard/AlertCard'

const AlertInfo = () => {
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          Alerts
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          view all
        </Typography>
      </div>
      <AlertCard
        status='bg-success'
        count={3}
        subText='good'
        text='Network: Participation rate below 66%'
      />
      <AlertCard
        status='bg-warning'
        count={1}
        subText='fair'
        text='Node / Validator: Process Down'
      />
      <AlertCard status='bg-success' count={3} subText='good' text='NODE: 32 Connected peers ' />
      <AlertCard
        status='bg-success'
        count={3}
        subText='good'
        text='Network: Participation rate below 66%'
      />
      <div className='flex-1 border-l-0 border-t-0 border-style500 flex items-center justify-center'>
        <i className='bi bi-lightning-fill text-primary text-h3 opacity-20' />
      </div>
    </div>
  )
}

export default AlertInfo
