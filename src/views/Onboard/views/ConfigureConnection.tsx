import Typography from "../../../components/Typography/Typography";
import ConfigConnectionForm from "../../../forms/ConfigConnectionForm";
import TabOption from "../../../components/TabOption/TabOption";
import {ConfigType} from "../../../constants/enums";
import ProtocolInput from "../../../components/ProtocolInput/ProtocolInput";

const ConfigureConnection = () => {
  return (
      <div className="flex-1 w-full flex flex-col relative justify-center bg-black pl-3 md:pl-24 xl:pl-52">
          <Typography type="text-subtitle1" color="text-transparent" fontWeight="font-light" className="primary-gradient-text">Configure Connection</Typography>
          <ConfigConnectionForm>
              {({control, formType, changeFormType, ...props}) => (
                  <div>
                      <div className="flex space-x-20 pt-6">
                          <TabOption onClick={() => changeFormType(ConfigType.BASIC)} text="basic settings" isActive={formType === ConfigType.BASIC}/>
                          <TabOption onClick={() => changeFormType(ConfigType.ADVANCED)} toolTip="s" text="advanced settings" isActive={formType === ConfigType.ADVANCED}/>
                      </div>
                      {formType === ConfigType.ADVANCED ? (
                          <div className="space-y-8 mt-8">
                              <ProtocolInput id="bnInput" type="beaconNode" control={control} {...props} />
                              <ProtocolInput id="vcInput" type="validatorClient" control={control} {...props} />
                          </div>
                      ) : (
                          <div className="mt-8">
                              <ProtocolInput id="dualInput" control={control} {...props} />
                          </div>
                      )}
                  </div>
              )}
          </ConfigConnectionForm>
      </div>
  )
}

export default ConfigureConnection;