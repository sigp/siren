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

export const mockValidatorCache = {
  1234567: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 33.00004 },
    { epoch: '12345679', total_balance: 33.000045 },
    { epoch: '12345679', total_balance: 33.000046 },
    { epoch: '12345679', total_balance: 33.000047 },
    { epoch: '12345679', total_balance: 33.00005 },
    { epoch: '12345679', total_balance: 33.000054 },
  ],
  1234568: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 33.00004 },
    { epoch: '12345679', total_balance: 33.000045 },
    { epoch: '12345679', total_balance: 33.000046 },
    { epoch: '12345679', total_balance: 33.000047 },
    { epoch: '12345679', total_balance: 33.00005 },
    { epoch: '12345679', total_balance: 33.000054 },
  ],
}

export const mockShortValidatorCache = {
  1234567: [{ epoch: '12345678', total_balance: 32 }],
  1234568: [{ epoch: '12345678', total_balance: 32 }],
}

export const mockedWithdrawalCash = {
  1234567: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 32.0001 },
    { epoch: '12345679', total_balance: 32.00015 },
    { epoch: '12345679', total_balance: 32.00016 },
    { epoch: '12345679', total_balance: 32.00017 },
    { epoch: '12345679', total_balance: 32.00018 },
    { epoch: '12345679', total_balance: 32.00019 },
  ],
  1234568: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 32.0001 },
    { epoch: '12345679', total_balance: 32.00015 },
    { epoch: '12345679', total_balance: 32.00016 },
    { epoch: '12345679', total_balance: 32.00017 },
    { epoch: '12345679', total_balance: 32.00018 },
    { epoch: '12345679', total_balance: 32.00019 },
  ],
}

export const mockedRecentWithdrawalCash = {
  1234567: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 33.00015 },
    { epoch: '12345679', total_balance: 33.00016 },
    { epoch: '12345679', total_balance: 33.00017 },
    { epoch: '12345679', total_balance: 33.00018 },
    { epoch: '12345679', total_balance: 33.00019 },
    { epoch: '12345679', total_balance: 32.0001 },
  ],
  1234568: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 33.00015 },
    { epoch: '12345679', total_balance: 33.00016 },
    { epoch: '12345679', total_balance: 33.00017 },
    { epoch: '12345679', total_balance: 33.00018 },
    { epoch: '12345679', total_balance: 33.00019 },
    { epoch: '12345679', total_balance: 32.0001 },
  ],
}

export const mockedWithdrawalCashLoss = {
  1234567: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 32.0001 },
    { epoch: '12345679', total_balance: 32.000092 },
    { epoch: '12345679', total_balance: 32.000093 },
    { epoch: '12345679', total_balance: 32.000094 },
    { epoch: '12345679', total_balance: 32.000095 },
    { epoch: '12345679', total_balance: 32.000096 },
  ],
  1234568: [
    { epoch: '12345678', total_balance: 33 },
    { epoch: '12345679', total_balance: 33.00002 },
    { epoch: '12345679', total_balance: 33.000025 },
    { epoch: '12345679', total_balance: 33.00003 },
    { epoch: '12345679', total_balance: 32.0001 },
    { epoch: '12345679', total_balance: 32.000092 },
    { epoch: '12345679', total_balance: 32.000093 },
    { epoch: '12345679', total_balance: 32.000094 },
    { epoch: '12345679', total_balance: 32.000095 },
    { epoch: '12345679', total_balance: 32.000096 },
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
  withdrawalAddress: 'mock-address',
  processed: 1,
  missed: 0,
  attested: 0,
  aggregated: 0,
}
