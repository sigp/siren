import {ReactComponent as LightHouseFullLogo} from "../../assets/images/lightHouseFull.svg";
import {ReactComponent as SlasherLogo} from "../../assets/images/slasher.svg";
import SyncMetric from "../SyncMetric/SyncMetric";
import Typography from "../Typography/Typography";
import Button, {ButtonFace} from "../Button/Button";
import Wallet from "../Wallet/Wallet";

const TopBar = () => {
  return (
      <div className="w-full h-14 border-b bg-white dark:bg-dark750 border-borderLight dark:border-dark800 flex justify-between">
          <div className="flex h-full">
              <div className="items-center hidden lg:flex w-42 border-r border-borderLight dark:border-borderDark px-4">
                  <LightHouseFullLogo className="w-full text-black dark:text-white" />
              </div>
              <SyncMetric id="ethMain" borderStyle="border-r" title="ETHEREUM MAINNET" amount={150435} color="secondary" total={212245}/>
              <SyncMetric id="beaconChain" borderStyle="border-r" title="BEACON CHAIN" amount={150435} total={212245} direction="counter"/>
              <div className="hidden md:flex w-24 border-r border-borderLight dark:border-dark800 p-2">
                  <div className="flex-1 space-y-2">
                      <Typography family="font-roboto" type="text-tiny">Slasher</Typography>
                      <Typography color="text-primary" darkMode="dark:text-white" isBold type="text-caption1" family="font-roboto">LIVE</Typography>
                  </div>
                  <SlasherLogo className="w-6 h-6 text-primary"/>
              </div>
          </div>
          <div className="h-full flex">
              <Wallet className="hidden lg:flex" borderStyle="border-l"/>
              <Button className="hidden md:block items-center border-l border-borderLight dark:border-borderDark" type={ButtonFace.ICON}>
                  <i className="bi bi-clock-history text-2xl text-dark300"/>
              </Button>
              <Button className="hidden md:block items-center border-l border-borderLight dark:border-borderDark" type={ButtonFace.ICON}>
                  <i className="bi bi-bell-fill text-2xl text-dark300"/>
              </Button>
              <div className="h-full w-8 bg-gradient-to-b from-primary to-secondary flex items-center justify-center cursor-pointer">
                  <i className="bi bi-three-dots-vertical text-white text-3xl"/>
              </div>
          </div>
      </div>
  )
}

export default TopBar;