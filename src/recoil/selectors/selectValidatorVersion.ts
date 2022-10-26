import { selector } from 'recoil';
import { validatorVersionData } from '../atoms';
import { NodeVersion } from '../../types';

export const selectValidatorVersion = selector<NodeVersion | undefined>({
  key: 'selectValidatorVersion',
  get: ({ get }) => {
    const validator = get(validatorVersionData)

    if(!validator) return;

    const version = validator.split('/')[1]
    const split = version.split('-')

    return {
      version: split[0],
      id: split[1]
    }
  },
})