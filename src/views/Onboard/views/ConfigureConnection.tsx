import Typography from "../../../components/Typography/Typography";
import ConfigConnectionForm from "../../../forms/ConfigConnectionForm";
import TabOption from "../../../components/TabOption/TabOption";
import {ConfigType} from "../../../constants/enums";
import ProtocolInput from "../../../components/ProtocolInput/ProtocolInput";
import Input from "../../../components/Input/Input";
import {Controller} from "react-hook-form";

const ConfigureConnection = () => {
  return (
      <div className="flex-1 w-full flex flex-col relative justify-center bg-black pl-3 md:pl-24 xl:pl-52">
          <Typography type="text-subtitle1" color="text-transparent" fontWeight="font-light" className="primary-gradient-text">Configure Connection</Typography>
          <ConfigConnectionForm>
              {({control, formType, isValidBeaconNode, isValidValidatorClient, changeFormType, ...props}) => (
                  <div className="space-y-8 w-full max-w-xl">
                      <div className="flex space-x-20 pt-6">
                          <TabOption onClick={() => changeFormType(ConfigType.BASIC)} text="basic settings" isActive={formType === ConfigType.BASIC}/>
                          <TabOption onClick={() => changeFormType(ConfigType.ADVANCED)} toolTip="s" text="advanced settings" isActive={formType === ConfigType.ADVANCED}/>
                      </div>
                      {formType === ConfigType.ADVANCED ? (
                          <div className="space-y-8">
                              <ProtocolInput id="bnInput" isValid={isValidBeaconNode} type="beaconNode" control={control} {...props} />
                              <ProtocolInput id="vcInput" isValid={isValidValidatorClient} type="validatorClient" control={control} {...props} />
                          </div>
                      ) : (
                          <ProtocolInput id="dualInput" isValid={isValidBeaconNode && isValidValidatorClient} control={control} {...props} />
                      )}
                      <Controller
                          name="apiToken"
                          control={control}
                          render={({field: {ref: _ref, ...props}}) => (
                              <Input label="Api Token" tooltip="api token tooltip" placeholder="***-*****-******" type="password" {...props}/>
                          )}
                      />
                      <div className="flex space-x-4">
                          <Controller
                              name="deviceName"
                              control={control}
                              render={({field: {ref: _ref, ...props}}) => (
                                  <Input label="Device Name" placeholder="Local Host" {...props}/>
                              )}
                          />
                          <Controller
                              name="userName"
                              control={control}
                              render={({field: {ref: _ref, ...props}}) => (
                                  <Input label="What should I call you?" placeholder="Name" {...props}/>
                              )}
                          />
                      </div>
                  </div>
              )}
          </ConfigConnectionForm>
      </div>
  )
}

export default ConfigureConnection;