import { useRecoilValue, useSetRecoilState } from 'recoil';
import { validatorIndex } from '../../../recoil/atoms';
import { selectValidatorDetail } from '../../../recoil/selectors/selectValidatorDetails';
import { useEffect } from 'react';
import Typography from '../../Typography/Typography';
import Waves from '../../../assets/images/waves.png';
import { selectEthExchangeRates } from '../../../recoil/selectors/selectEthExchangeRates';
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency';
import Status from '../../Status/Status';
import { useTranslation } from 'react-i18next';
import ValidatorIncomeSummary from '../../ValidatorIncomeSummary/ValidatorIncomeSummary';
import StatusIcon from '../../StatusIcon/StatusIcon';
import ValidatorStatusProgress from '../../ValidatorStatusProgress/ValidatorStatusProgress';
import ValidatorGraffitiInput from '../../ValidatorGraffitiInput/ValidatorGraffitiInput';
import ValidatorCardAction from '../ValidatorCardAction';
import ViewDisclosures from '../../ViewDisclosures/ViewDisclosures';
import { BeaconChaValidatorUrl } from '../../../constants/constants';
import ValidatorDetailTable from '../../ValidatorDetailTable/ValidatorDetailTable';

const ValidatorDetails = () => {
  const {t} = useTranslation()
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const { index, name, pubKey, balance, status } = validator || {}
  const { rates } = useRecoilValue(selectEthExchangeRates)

  const usdBalance = (balance || 0) * (rates['USD'] || 0);


  useEffect(() => {
    return () => {
      setValidatorIndex(undefined)
    }
  }, [])

  return validator ? (
    <div className="w-full">
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-80 h-60 border-r px-8  py-4 relative">
          <img
            alt='waves'
            src={Waves}
            className='z-10 w-full h-full absolute left-0 top-0 opacity-10'
          />
          <div className="w-full flex flex-col justify-between space-y-3 h-full z-20 relative">
            <div className="w-full flex justify-between">
              <div className="bg-gradient-to-br from-primaryBright via-primary to-secondary h-36 w-36 rounded-full"/>
              <div className="text-right flex-1 flex flex-col justify-between">
                <div>
                  <Typography type="text-caption1" color="text-dark300">{index}</Typography>
                  <Typography>{name}</Typography>
                </div>
                <div className="space-y-2">
                  <div>
                    <Typography color="text-dark300">—</Typography>
                    <Typography type="text-caption2" color="text-dark300" isBold isUpperCase>Validator <br/> Balance</Typography>
                  </div>
                  <Typography isBold>{balance?.toFixed(4)}</Typography>
                </div>
              </div>
            </div>
            <div className="w-full flex">
              <div className="flex-1 space-y-2">
                <Typography type="text-caption2" color="text-dark300" isUpperCase>Pubkey</Typography>
                <Typography type="text-caption1" isBold >{`${pubKey?.substring(0, 12)}...`}</Typography>
              </div>
              <div className="flex-1 space-y-2">
                <Typography type="text-caption2" color="text-dark300" isUpperCase>index</Typography>
                <Typography type="text-caption1" isBold >{index}</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex py-4 justify-center items-center">
          <div className="w-11/12 space-y-2">
            <div className="w-full flex flex-col lg:flex-row shadow">
              <div className="p-3 flex lg:flex-col lg:border-r space-y-4">
                <div className="space-y-2">
                  <Typography isBold type="text-caption1">Balance</Typography>
                  <div className="flex w-full space-x-4 justify-between">
                    <Typography type="text-caption1" color="text-dark300">USD</Typography>
                    <Typography type="text-caption1" isBold>${formatLocalCurrency(usdBalance)}</Typography>
                  </div>
                </div>
                <div className="space-y-2 px-6 lg:px-0">
                  <Typography type="text-caption2" isBold isUpperCase>{t('validatorManagement.summary.avgEffectiveness')}</Typography>
                  <div className="flex space-x-8">
                    <Status status="bg-success"/>
                    <Typography isBold type="text-caption1">100%</Typography>
                  </div>
                </div>
              </div>
              <div className="space-y-4 border-t lg:border-t-0 lg:border-r flex flex-col justify-between">
                <ValidatorIncomeSummary validators={[validator]} className="pt-4 px-2 space-y-2 w-42"/>
                <div className="w-full flex border-t lg:border-none">
                  <div className="space-y-3 flex-1 pt-4 lg:pt-0 border-r px-2 pb-2">
                    <Typography isBold type="text-caption2">Slots Behind</Typography>
                    <Typography className="text-right">0</Typography>
                  </div>
                  <div className="space-y-3 flex-1 pt-4 lg:pt-0 px-2 pb-2">
                    <Typography isBold type="text-caption2">Epochs</Typography>
                    <div className="w-full flex justify-between">
                      <Typography>Node</Typography>
                      <Typography>0</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <a target="_blank" rel="noreferrer" href={`${BeaconChaValidatorUrl}/${index}`}>
                <div className="cursor-pointer bg-dark25 flex-1 space-y-3 p-3">
                  <Typography type="text-caption1" isBold className="uppercase">Beacon <br/> Cha.in</Typography>
                  <Typography color="text-dark400" fontWeight="font-light" type="text-caption2">
                    Explore more on beaconchai.in dashboard
                  </Typography>
                  <div className="w-full flex items-center justify-between">
                    <Typography fontWeight="font-light" className="uppercase">Explorer</Typography>
                    <i className="bi-arrow-up-right text-primary"/>
                  </div>
                </div>
              </a>
            </div>
            <div className="w-full flex shadow py-2 px-4">
              <div className="space-y-2 mr-4">
                <Typography type="text-caption2" isUpperCase isBold>Status</Typography>
                <div className="flex space-x-2">
                  <Typography type="text-caption2" isUpperCase color="text-dark300">{status}</Typography>
                  {status && <StatusIcon status={status}/>}
                </div>
              </div>
              {status && <ValidatorStatusProgress status={status}/>}
            </div>
          </div>
        </div>
      </div>
      <ValidatorGraffitiInput/>
      <ValidatorDetailTable validator={validator}/>
      <div className="w-full border-t space-y-4 opacity-60 p-4">
        <Typography type="text-caption1">Validator Management</Typography>
        <div className="w-full flex flex-wrap lg:space-x-3">
          <ValidatorCardAction className="w-32 @425:w-36 sm:w-96 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
          <ValidatorCardAction className="w-32 @425:w-36 sm:w-96 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
          <ValidatorCardAction className="w-32 @425:w-36 md:w-95 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
          <ValidatorCardAction className="w-32 @425:w-36 md:w-95 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
          <ValidatorCardAction className="w-32 @425:w-36 md:w-95 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
          <ValidatorCardAction className="w-32 @425:w-36 md:w-95 mr-3 mb-2 lg:flex-1" icon="bi-arrow-down-circle" title="Deposit Funds"/>
        </div>
      </div>
      <div className="p-3 border-t">
        <ViewDisclosures/>
      </div>
    </div>
  ) : null
}

export default ValidatorDetails;