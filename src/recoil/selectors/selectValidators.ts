import { selector } from 'recoil';
import { selectValidatorUrl } from './selectValidatorUrl';
import { apiToken } from '../atoms';
import { fetchValidators } from '../../api/lighthouse';
import { LighthouseValidatorResult, Validator } from '../../types/validator';
import { faker } from '@faker-js/faker';

export const selectValidators = selector<Validator[]>({
  key: 'validatorsDatas',
  get: async ({ get }) => {
    const baseValidatorUrl = get(selectValidatorUrl)
    const token = get(apiToken)

    if(!baseValidatorUrl) return;

    const { data } = await fetchValidators(baseValidatorUrl, token);

    return data.data.map((validator: LighthouseValidatorResult) => ({
      pubKey: validator.voting_pubkey,
      name: faker.name.fullName()
    }))
  }
})