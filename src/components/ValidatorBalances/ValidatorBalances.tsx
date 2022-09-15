import getFakeValidatorBalances from "../../utilities/getFakeValidatorBalances";
import {BALANCE_COLORS, FAKE_VALIDATORS} from "../../constants/constants";
import getAverageValue from "../../utilities/getAverageValue";
import StepChart from "../StepChart/StepChart";
import Typography from "../Typography/Typography";

const ValidatorBalances = () => {
    const {slots, data} = getFakeValidatorBalances();

    const validators = FAKE_VALIDATORS.map(({title}, index) => ({
        label: title,
        data: data[index],
        fill: true,
        pointRadius: 0,
        stepped: 'after',
    })).sort((a, b) => getAverageValue(a.data) - getAverageValue(b.data))

    const datasets = validators.map((data, index) => ({
        ...data,
        borderColor: BALANCE_COLORS[index],
        backgroundColor: BALANCE_COLORS[index],
    }));

    const balanceData = {
        labels: slots,
        datasets
    };

  return (
      <div className="flex-1 flex h-24 w-full">
          <div className="p-1 h-full flex items-center justify-center">
              <Typography type="text-tiny" color="text-primary" isBold className="-rotate-90">ETH</Typography>
          </div>
          <div className="relative flex-1">
              <div className="px-8 absolute z-10 top-0 left-0 w-full flex justify-between">
                  <Typography color="text-primary">Validator Balance</Typography>
                  <Typography color="text-primary">{validators.length}</Typography>
              </div>
              <StepChart data={balanceData}/>
          </div>
      </div>
  )
}

export default ValidatorBalances;