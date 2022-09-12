import Typography from "../Typography/Typography";
import {ReactComponent as ValidatorLogo} from "../../assets/images/validators.svg";
import {ReactComponent as SatelliteLogo} from "../../assets/images/satellite.svg";
import {FAKE_VALIDATORS} from "../../constants/constants";
import ValidatorRow from "./ValidatorRow";

const ValidatorTable = () => {
  return (
      <div className="w-full max-h-60.5 overflow-scroll mt-2 border-style500">
          <table className="relative table-auto w-full">
              <thead className="sticky top-0 left-0 bg-white dark:bg-darkPrimary">
                <tr className="w-full h-12">
                  <th>
                      <div className="w-full flex justify-center">
                          <div className="w-4 h-4">
                              <ValidatorLogo className="dark:text-white"/>
                          </div>
                      </div>
                  </th>
                  <th>
                      <Typography className="text-left">Validators</Typography>
                  </th>
                  <th className="border-r-style500">
                      <Typography>{FAKE_VALIDATORS.length}</Typography>
                  </th>
                  <th className="pl-2">
                      <Typography color="text-dark500" type="text-tiny" className="text-left uppercase">PUBKEY</Typography>
                  </th>
                  <th>
                      <Typography color="text-dark500" type="text-tiny" className="uppercase text-left">Balance</Typography>
                  </th>
                  <th>
                      <Typography color="text-dark500" type="text-tiny" className="uppercase">Rewards</Typography>
                  </th>
                  <th>
                      <div className="w-full flex justify-center">
                          <div className="w-5 h-5 border-style500 rounded-full flex items-center justify-center">
                              <Typography color="text-dark500" type="text-tiny" >PR</Typography>
                          </div>
                      </div>
                  </th>
                  <th>
                      <div className="w-full flex justify-center">
                          <div className="w-5 h-5 border-style500 rounded-full flex items-center justify-center">
                              <Typography color="text-dark500" type="text-tiny">AT</Typography>
                          </div>
                      </div>
                  </th>
                  <th>
                      <div className="w-full flex justify-center">
                          <div className="w-5 h-5 border-style500 rounded-full flex items-center justify-center">
                              <Typography color="text-dark500" type="text-tiny">AG</Typography>
                          </div>
                      </div>
                  </th>
                  <th className="border-r-style500 pl-2">
                      <Typography color="text-dark500" type="text-tiny" className="text-left uppercase">Status</Typography>
                  </th>
                  <th className="border-r-style500">
                      <div className="w-full flex justify-center">
                          <div className="w-8 h-8 bg-dark300 dark:bg-dark600 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4">
                                  <SatelliteLogo className="text-white"/>
                              </div>
                          </div>
                      </div>
                  </th>
                  <th>
                      <div className="w-full flex justify-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-4 h-4">
                                  <ValidatorLogo className="text-white"/>
                              </div>
                          </div>
                      </div>
                  </th>
              </tr>
              </thead>
              <tbody>
              {FAKE_VALIDATORS.map((validator, index) => (
                  <ValidatorRow validator={validator} key={index} />
              ))}
              </tbody>
          </table>
      </div>
  )
}

export default ValidatorTable;