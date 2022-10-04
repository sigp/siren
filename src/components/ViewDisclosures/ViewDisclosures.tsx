import Typography from '../Typography/Typography'

const ViewDisclosures = () => {
  return (
    <div className='flex space-x-4 items-center cursor-pointer'>
      <i className='bi-info-circle text-caption1 text-primary' />
      <Typography
        isBold
        family='font-archivo'
        color='text-primary'
        type='text-caption1'
        className='uppercase'
      >
        view important disclosures
      </Typography>
    </div>
  )
}

export default ViewDisclosures
