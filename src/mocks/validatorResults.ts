import { ValidatorStatus } from '../types/validator'

export const mockActiveValidators = [
  {
    pubKey: 'mock-pub-key-1',
    status: 'active_ongoing',
    index: 0,
    name: 'mvk-1',
  },
  {
    pubKey: 'mock-pub-key-2',
    name: 'mvk-2',
    status: 'active_ongoing',
    index: 1,
  },
  {
    pubKey: 'mock-pub-key-3',
    name: 'mvk-3',
    status: 'active_ongoing',
    index: 2,
  },
  {
    pubKey: 'mock-pub-key-4',
    name: 'mvk-4',
    status: 'active_ongoing',
    index: 3,
  },
  {
    pubKey: 'mock-pub-key-5',
    name: 'mvk-5',
    status: 'active_ongoing',
    index: 4,
  },
]

export const mockValidatorCacheResults = {
  0: [
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
  ],
  1: [
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
  ],
  2: [
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
  ],
  3: [
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
  ],
  4: [
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
    {
      epoch: 12345678,
      total_balance: 3200000000,
    },
  ],
}

export const mockValidatorInfo = {
  name: 'mock-validator',
  balance: 32000000,
  index: 0,
  pubKey: 'mock-pub-key',
  rewards: 1000000,
  slashed: false,
  status: 'active_ongoing' as ValidatorStatus,
  processed: 1,
  missed: 0,
  attested: 0,
  aggregated: 0,
}
