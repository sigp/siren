import { ValidatorStatus } from '../types/validator'

export const mockValidatorCache = {
  1234567: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 33.00004 },
    { epoch: 12345679, total_balance: 33.000045 },
    { epoch: 12345679, total_balance: 33.000046 },
    { epoch: 12345679, total_balance: 33.000047 },
    { epoch: 12345679, total_balance: 33.00005 },
    { epoch: 12345679, total_balance: 33.000054 },
  ],
  1234568: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 33.00004 },
    { epoch: 12345679, total_balance: 33.000045 },
    { epoch: 12345679, total_balance: 33.000046 },
    { epoch: 12345679, total_balance: 33.000047 },
    { epoch: 12345679, total_balance: 33.00005 },
    { epoch: 12345679, total_balance: 33.000054 },
  ],
}

export const mockShortValidatorCache = {
  1234567: [{ epoch: 12345678, total_balance: 32 }],
  1234568: [{ epoch: 12345678, total_balance: 32 }],
}

export const mockedWithdrawalCash = {
  1234567: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 32.0001 },
    { epoch: 12345679, total_balance: 32.00015 },
    { epoch: 12345679, total_balance: 32.00016 },
    { epoch: 12345679, total_balance: 32.00017 },
    { epoch: 12345679, total_balance: 32.00018 },
    { epoch: 12345679, total_balance: 32.00019 },
  ],
  1234568: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 32.0001 },
    { epoch: 12345679, total_balance: 32.00015 },
    { epoch: 12345679, total_balance: 32.00016 },
    { epoch: 12345679, total_balance: 32.00017 },
    { epoch: 12345679, total_balance: 32.00018 },
    { epoch: 12345679, total_balance: 32.00019 },
  ],
}

export const mockedRecentWithdrawalCash = {
  1234567: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 33.00015 },
    { epoch: 12345679, total_balance: 33.00016 },
    { epoch: 12345679, total_balance: 33.00017 },
    { epoch: 12345679, total_balance: 33.00018 },
    { epoch: 12345679, total_balance: 33.00019 },
    { epoch: 12345679, total_balance: 32.0001 },
  ],
  1234568: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 33.00015 },
    { epoch: 12345679, total_balance: 33.00016 },
    { epoch: 12345679, total_balance: 33.00017 },
    { epoch: 12345679, total_balance: 33.00018 },
    { epoch: 12345679, total_balance: 33.00019 },
    { epoch: 12345679, total_balance: 32.0001 },
  ],
}

export const mockedWithdrawalCashLoss = {
  1234567: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 32.0001 },
    { epoch: 12345679, total_balance: 32.000092 },
    { epoch: 12345679, total_balance: 32.000093 },
    { epoch: 12345679, total_balance: 32.000094 },
    { epoch: 12345679, total_balance: 32.000095 },
    { epoch: 12345679, total_balance: 32.000096 },
  ],
  1234568: [
    { epoch: 12345678, total_balance: 33 },
    { epoch: 12345679, total_balance: 33.00002 },
    { epoch: 12345679, total_balance: 33.000025 },
    { epoch: 12345679, total_balance: 33.00003 },
    { epoch: 12345679, total_balance: 32.0001 },
    { epoch: 12345679, total_balance: 32.000092 },
    { epoch: 12345679, total_balance: 32.000093 },
    { epoch: 12345679, total_balance: 32.000094 },
    { epoch: 12345679, total_balance: 32.000095 },
    { epoch: 12345679, total_balance: 32.000096 },
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

export const mockValInfoResult = {
  validators: {
    '1': {
      info: {
        epoch: '100',
        total_balance: '5000',
      },
    },
    '2': {
      info: {
        epoch: '101',
        total_balance: '10000',
      },
    },
    '3': {
      info: {
        epoch: '102',
        total_balance: '7500',
      },
    },
  },
}

export const mockValCacheResults = {
  1: { epoch: '100', total_balance: '5000' },
  2: { epoch: '101', total_balance: '10000' },
  3: { epoch: '102', total_balance: '7500' },
}
