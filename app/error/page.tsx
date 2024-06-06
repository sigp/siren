import '../../src/global.css';
import Button, { ButtonFace } from '../../src/components/Button/Button';
import TopographyCanvas from '../../src/components/Topography/Topography';
import Typography from '../../src/components/Typography/Typography';

export default async function Page() {
  return (
    <div className='relative w-screen h-screen flex items-center justify-center bg-gradient-to-r from-primary to-tertiary'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-fit rounded-full overflow-hidden">
        <TopographyCanvas color="#F0F0F0" animate height={600} width={600} name="error"/>
      </div>
      <div className="relative space-y-12 z-50 w-96 -translate-x-96">
        <div>
          <Typography isBold color="text-white" type="text-h2">Opps!</Typography>
          <Typography color="text-white" type="text-subtitle3">Siren seems to have encountered an unexpected error. Please review your configuration and or node connections to continue to your dashboard.</Typography>
        </div>
        <div>
          <Button href="/" type={ButtonFace.SECONDARY}>Go Back</Button>
        </div>
      </div>
    </div>
  )
}
