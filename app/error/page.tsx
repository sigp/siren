import '../../src/global.css'
import Lighthouse from '../../src/assets/images/lightHouse.svg'
import TopographyCanvas from '../../src/components/Topography/Topography'
import Main from './Main'

export default async function Page() {
  return (
    <div className='relative w-screen h-screen flex items-center justify-center bg-gradient-to-r from-primary to-tertiary'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-fit rounded-full overflow-hidden'>
        <TopographyCanvas color='#F0F0F0' animate height={600} width={600} name='error' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <Lighthouse className='text-white w-[500px] h-[500px]' />
        </div>
      </div>
      <Main />
    </div>
  )
}
