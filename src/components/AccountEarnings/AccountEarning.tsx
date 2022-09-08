import Typography from "../Typography/Typography";
import Waves from '../../assets/images/waves.png'

const AccountEarning = () => {
  return (
      <div className="w-full h-96 relative overflow-hidden">
          <div className="w-full h-full bg-primaryBright absolute left-0 top-0 blur-3xl origin-center -rotate-45 translate-x-36 scale-125" />
          <div className="z-20 w-full h-36 absolute left-0 bottom-0 bg-gradient-to-t dark:from-dark750 from-white to-transparent" />
          <img alt="waves" src={Waves} className="z-10 w-full h-full absolute left-0 top-0 opacity-10" />
          <div className="p-4 bg-primary200 w-28 text-center absolute z-30 top-0 right-10">
              <Typography color="text-white" type="text-caption1">Balance</Typography>
              <div className="w-full absolute h-1 bg-white bottom-0 left-0"/>
          </div>
          <div className="relative z-30 w-full h-full p-4">
              <Typography fontWeight="font-light" className="bg-gradient-to-r from-primaryBright via-primary to-secondary w-max bg-clip-text" color="text-transparent" type="text-subtitle1" darkMode="dark:text-white">Account</Typography>
              <div className="w-full flex justify-end pr-6 pt-8">
                  <Typography color="text-white" isBold darkMode="dark:text-white" type="text-h2">128 ETH</Typography>
              </div>
          </div>
      </div>
  )
}

export default AccountEarning;