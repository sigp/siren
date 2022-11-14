import { useRecoilValue, useSetRecoilState } from 'recoil';
import { validatorIndex } from '../../../recoil/atoms';
import { selectValidatorDetail } from '../../../recoil/selectors/selectValidatorDetails';
import { useEffect } from 'react';
import Typography from '../../Typography/Typography';
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
import ValidatorInfoCard from '../../ValidatorInfoCard/ValidatorInfoCard';

const ValidatorDetails = () => {
  const {t} = useTranslation()
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const { index, balance, status } = validator || {}
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
        <ValidatorInfoCard validator={validator}/>
        <div className="flex-1 flex py-4 justify-center items-center">
          <div className="w-11/12 space-y-2">
            <div className="w-full flex flex-col border-style100 lg:flex-row lg:shadow">
              <div className="p-3 flex lg:flex-col lg:border-r-style100 justify-between">
                <div className="space-y-2">
                  <Typography isBold type="text-caption1">{t('validatorManagement.details.balance')}</Typography>
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
              <div className="space-y-4 border-t-style100 lg:border-t-0 lg:border-r-style100 flex flex-col justify-between">
                <ValidatorIncomeSummary validators={[validator]} className="pt-4 px-2 space-y-2 w-42"/>
                <div className="w-full flex border-t lg:border-none">
                  <div className="space-y-3 flex-1 pt-4 lg:pt-0 border-r px-2 pb-2">
                    <Typography isBold type="text-caption2">{t('validatorManagement.details.slotsBehind')}</Typography>
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
                <div className="cursor-pointer dark:bg-dark700 bg-dark25 flex-1 space-y-3 p-3">
                  <Typography type="text-caption1" isBold className="uppercase">Beacon <br/> Cha.in</Typography>
                  <Typography color="text-dark400" fontWeight="font-light" type="text-caption2">
                    {t('validatorManagement.details.exploreBeaconChai')}
                  </Typography>
                  <div className="w-full flex items-center justify-between">
                    <Typography fontWeight="font-light" className="uppercase">{t('validatorManagement.details.explore')}</Typography>
                    <i className="bi-arrow-up-right text-primary"/>
                  </div>
                </div>
              </a>
            </div>
            <div className="w-full flex border-style100 shadow py-2 px-4">
              <div className="space-y-2 mr-4">
                <Typography type="text-caption2" isUpperCase isBold>{t('validatorManagement.details.status')}</Typography>
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
      <div className="w-full border-t-style100 space-y-4 opacity-60 p-4">
        <Typography type="text-caption1">{t('validatorManagement.title')}</Typography>
        <div className="w-full flex flex-wrap lg:space-x-3">
          <ValidatorCardAction icon="bi-arrow-down-circle" title={t('validatorManagement.actions.depositFunds')}/>
          <ValidatorCardAction icon="bi-key-fill" title={t('validatorManagement.actions.backupKeys')}/>
          <ValidatorCardAction icon="bi-power" title={t('validatorManagement.actions.stopValidator')} />
          <ValidatorCardAction icon="bi-arrow-right-square" title={t('validatorManagement.actions.exportValidator')} />
          <ValidatorCardAction icon="bi-arrow-right-square" title={t('validatorManagement.actions.exitValidator')} />
          <ValidatorCardAction icon="bi-arrow-right-square" title={t('validatorManagement.actions.withdrawValidator')} />
        </div>
      </div>
      <div className="p-3 border-t-style100">
        <ViewDisclosures/>
      </div>
    </div>
  ) : null
}

export default ValidatorDetails;