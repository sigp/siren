import Typography from "../Typography/Typography";
import Status from "../Status/Status";
import ReactSpeedometer, {CustomSegmentLabelPosition} from "react-d3-speedometer"
import {useRecoilValue} from "recoil";
import {uiMode} from "../../recoil/atoms";
import {UiMode} from "../../constants/enums";

const NetworkStats = () => {
    const mode = useRecoilValue(uiMode);
  return (
      <div className="w-full h-14 border-style500 shadow flex">
          <div className="py-2 px-4 h-full w-40 border-r-style500">
              <Typography type="text-tiny" className="uppercase" isBold darkMode="dark:text-white">Process Uptime</Typography>
              <div className="flex space-x-4 pt-3">
                  <Typography color="text-dark300" type="text-caption2">Validator</Typography>
                  <Typography isBold darkMode="dark:text-white" type="text-caption2">15.6 HR</Typography>
              </div>
          </div>
          <div className="py-2 px-4 h-full w-40 border-r-style500">
              <Typography type="text-tiny" className="uppercase" isBold darkMode="dark:text-white">Process Uptime</Typography>
              <div className="flex space-x-4 pt-3">
                  <Typography color="text-dark300" type="text-caption2">Beacon Chain</Typography>
                  <Typography isBold darkMode="dark:text-white" type="text-caption2">15.6 HR</Typography>
              </div>
          </div>
          <div className="py-2 px-4 h-full w-40 border-r-style500">
              <Typography type="text-tiny" className="uppercase" isBold darkMode="dark:text-white">AT Head Slot</Typography>
              <div className="flex items-center space-x-4 pt-1">
                  <Status size="h-4 w-4" status="bg-warning"/>
                  <Typography darkMode="dark:text-white" type="text-subtitle3">-2</Typography>
              </div>
          </div>
          <div className="relative py-2 px-4 h-full w-52 border-r-style500">
              <Typography type="text-tiny" className="uppercase" isBold darkMode="dark:text-white">Connected Peers</Typography>
              <div className="flex items-center space-x-4 pt-1">
                  <Typography color="text-dark300" type="text-caption2">Node</Typography>
                  <div className="absolute -bottom-6 right-0">
                      <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" darkMode="dark:text-white" type="text-caption2">32</Typography>
                      <ReactSpeedometer
                          width={90}
                          height={80}
                          ringWidth={6}
                          needleHeightRatio={0.4}
                          segments={4}
                          maxSegmentLabels={1}
                          customSegmentLabels={[
                              {
                                  text: '50',
                                  position: CustomSegmentLabelPosition.Outside,
                                  color: mode === UiMode.LIGHT ? 'black' : 'white',
                              }, {}, {}, {},
                          ]}
                          needleColor="transparent"
                          labelFontSize="6px"
                          valueTextFontSize="9px"
                          segmentColors={['tomato', 'gold', 'limegreen']}
                          value={32}
                          maxValue={100}
                          textColor={'transparent'}
                      />
                  </div>
              </div>
          </div>
          <div className="py-2 px-4 h-full w-40">
              <Typography type="text-tiny" className="uppercase" isBold darkMode="dark:text-white">Participation Rate</Typography>
              <div className="flex items-center space-x-4 pt-1">
                  <Status size="h-4 w-4" status="bg-success"/>
                  <Typography darkMode="dark:text-white" type="text-subtitle3">98%</Typography>
              </div>
          </div>
      </div>
  )
}

export default NetworkStats;