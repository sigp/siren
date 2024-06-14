import { ValAliases } from '../types';
import { ValidatorInfo } from '../types/validator';

const useValidatorName = (validator: ValidatorInfo, aliases: ValAliases) => {
  const {index, name} = validator
  const storedAliasIndex = Object.keys(aliases).find((target) => Number(target) === index)

  return storedAliasIndex ? aliases[storedAliasIndex] : name
}

export default useValidatorName