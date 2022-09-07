import {ReactComponent as LightHouseFullLogo} from "../../assets/images/lightHouseFull.svg";
import SyncMetric from "../SyncMetric/SyncMetric";

const TopBar = () => {
  return (
      <div className="w-full h-14 border bg-white dark:bg-dark750 border-borderLight dark:border-dark800 flex justify-between">
          <div className="flex h-full">
              <div className="flex items-center w-42 border-r border-borderLight dark:border-borderDark px-4">
                  <LightHouseFullLogo className="w-full text-black dark:text-white" />
              </div>
              <SyncMetric id="ethMain" borderStyle="border-r" title="ETHEREUM MAINNET" amount={150435} color="secondary" total={212245}/>
              <SyncMetric id="beaconChain" borderStyle="border-r" title="BEACON CHAIN" amount={150435} total={212245} direction="counter"/>
          </div>
          <div className="h-full">
              second
          </div>
      </div>
  )
}

export default TopBar;