import Typography from "../../../components/Typography/Typography";
import ConfigConnectionForm from "../../../forms/ConfigConnectionForm";
import TabOption from "../../../components/TabOption/TabOption";
import {useState} from "react";
import {ConfigType} from "../../../constants/enums";
import Toggle from "../../../components/Toggle/Toggle";
import {Controller} from "react-hook-form";

const ConfigureConnection = () => {
    const [type, setType] = useState<ConfigType>(ConfigType.BASIC);
  return (
      <div className="flex-1 w-full flex flex-col relative justify-center bg-black pl-3 md:pl-24 xl:pl-52">
          <Typography type="text-subtitle1" color="text-transparent" fontWeight="font-light" className="primary-gradient-text">Configure Connection</Typography>
          <ConfigConnectionForm>
              {({control}) => (
                  <div className="flex space-x-20 pt-6">
                      <TabOption onClick={() => setType(ConfigType.BASIC)} text="basic settings" isActive={type === ConfigType.BASIC}/>
                      <TabOption onClick={() => setType(ConfigType.ADVANCED)} toolTip="s" text="advanced settings" isActive={type === ConfigType.ADVANCED}/>

                      <Controller
                          name="isRemember"
                          control={control}
                          render={({field: {ref: _ref, ...props}}) => (
                              <Toggle id="isRemember" {...props}/>
                          )}
                      />
                  </div>
              )}
          </ConfigConnectionForm>
      </div>
  )
}

export default ConfigureConnection;