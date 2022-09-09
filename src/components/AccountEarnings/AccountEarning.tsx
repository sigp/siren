import Typography from "../Typography/Typography";
import {ReactComponent as LightHouseLogo} from '../../assets/images/lightHouse.svg'
import {ReactComponent as EthLogo} from '../../assets/images/eth.svg'
import {ReactComponent as UsdcLogo} from '../../assets/images/usdc.svg'
import Waves from '../../assets/images/waves.png'
import Button, {ButtonFace} from "../Button/Button";

const AccountEarning = () => {
  return (
      <div className="w-full relative overflow-hidden">
          <div className="w-full h-full bg-primaryBright absolute left-0 top-0 blur-3xl origin-center -rotate-45 translate-x-36 scale-125" />
          <div className="z-20 w-full h-36 absolute left-0 bottom-0 bg-gradient-to-t dark:from-dark750 from-white to-transparent" />
          <img alt="waves" src={Waves} className="z-10 w-full h-full absolute left-0 top-0 opacity-10" />
          <div className="p-4 bg-primary200 w-28 text-center absolute z-30 top-0 right-10">
              <Typography color="text-white" type="text-caption1">Balance</Typography>
              <div className="w-full absolute h-1 bg-white bottom-0 left-0"/>
          </div>
          <div className="relative z-30 w-full h-full">
              <div className="w-full p-4">
                  <Typography fontWeight="font-light" className="bg-gradient-to-r from-primaryBright via-primary to-secondary w-max bg-clip-text" color="text-transparent" type="text-subtitle1" darkMode="dark:text-white">Account</Typography>
                  <div className="w-full flex justify-end pr-6 pt-8">
                      <Typography color="text-white" isBold darkMode="dark:text-white" type="text-h2">128 ETH</Typography>
                  </div>
                  <div className="w-full mt-8 flex items-center">
                      <LightHouseLogo className="text-white w-16 h-16"/>
                      <div className="flex-1 ml-16 flex justify-between">
                          <div>
                              <Typography color="text-white">Choose Currency</Typography>
                              <div className="flex justify-between items-center">
                                  <Typography color="text-white">USD</Typography>
                                  <i className="bi bi-chevron-down text-white" />
                              </div>
                          </div>
                          <div>
                              <Typography type="text-tiny" color="text-dark300" className="uppercase" isBold>Current Rate</Typography>
                              <Typography color="text-white">$4,000 USD/ETH</Typography>
                          </div>
                          <div>
                              <Typography type="text-tiny" color="text-dark300" className="uppercase" isBold>Total Balance</Typography>
                              <Typography color="text-white">$512,000 USD</Typography>
                          </div>
                      </div>
                  </div>
                  <hr className="w-full h-px bg-white mt-4"/>
              </div>
              <div className="bg-gradient-to-t via-transWhite from-white dark:from-dark750">
                  <div className="px-4 flex justify-between">
                      <Typography color="text-white">Earnings</Typography>
                      <div className="flex ml-8 space-x-1">
                          <Button type={ButtonFace.LIGHT}>Hourly</Button>
                          <Button type={ButtonFace.LIGHT}>Daily</Button>
                          <Button type={ButtonFace.LIGHT}>Weekly</Button>
                          <Button type={ButtonFace.LIGHT}>Monthly</Button>
                          <Button type={ButtonFace.LIGHT}>Total</Button>
                      </div>
                  </div>
                  <div className="flex justify-between mt-2 p-4">
                      <div className="flex space-x-4">
                          <EthLogo className="h-10 w-10"/>
                          <div>
                              <div className="flex space-x-2">
                                  <Typography type="text-caption1" className="uppercase" color="text-dark400">Eth</Typography>
                                  <i className="bi bi-info-circle text-caption1 text-dark400" />
                              </div>
                              <Typography type="text-subtitle3" darkMode="dark:text-white" family="font-roboto">0.001 ETH</Typography>
                          </div>
                      </div>
                      <div className="flex space-x-4">
                          <UsdcLogo className="h-10 w-10"/>
                          <div>
                              <div className="flex space-x-2">
                                  <Typography type="text-caption1" className="uppercase" color="text-dark400">USD</Typography>
                                  <i className="bi bi-info-circle text-caption1 text-dark400" />
                              </div>
                              <Typography type="text-subtitle3" darkMode="dark:text-white" family="font-roboto">0.30 USD</Typography>
                          </div>
                          <i className="bi bi-chevron-down text-caption1 text-dark400"/>
                      </div>
                      <div>
                          <div className="flex space-x-2">
                              <Typography type="text-caption1" color="text-dark400">Annualized</Typography>
                              <i className="bi bi-info-circle text-caption1 text-dark400" />
                          </div>
                          <Typography type="text-subtitle3" color="text-success" darkMode="dark:text-success" family="font-roboto">+0.92%</Typography>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default AccountEarning;