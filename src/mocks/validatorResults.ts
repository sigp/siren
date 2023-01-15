import { ValidatorStatus } from '../types/validator'

export const mockValidators = [
  {
    pubKey: 'mock-pub-key-1',
    name: 'mvk-1',
  },
  {
    pubKey: 'mock-pub-key-2',
    name: 'mvk-2',
  },
  {
    pubKey: 'mock-pub-key-3',
    name: 'mvk-3',
  },
  {
    pubKey: 'mock-pub-key-4',
    name: 'mvk-4',
  },
  {
    pubKey: 'mock-pub-key-5',
    name: 'mvk-5',
  },
]

export const mockValidatorInfo = [
  {
    index: 0,
    balance: '3200000000',
    status: 'active_ongoing' as ValidatorStatus,
    validator: {
      activation_eligibility_epoch: 'mock_epoch',
      activation_epoch: 'mock_epoch',
      effective_balance: '3200000000',
      exit_epoch: 'mock_epoch',
      pubkey: 'mock-pub-key-1',
      slashed: false,
      withdrawal_epoch: 'mock_epoch',
      withdrawal_credentials: 'mock-credentials',
    },
  },
  {
    index: 1,
    balance: '3200000000',
    status: 'active_ongoing' as ValidatorStatus,
    validator: {
      activation_eligibility_epoch: 'mock_epoch',
      activation_epoch: 'mock_epoch',
      effective_balance: '3200000000',
      exit_epoch: 'mock_epoch',
      pubkey: 'mock-pub-key-2',
      slashed: false,
      withdrawal_epoch: 'mock_epoch',
      withdrawal_credentials: 'mock-credentials',
    },
  },
  {
    index: 2,
    balance: '3200000000',
    status: 'active_ongoing' as ValidatorStatus,
    validator: {
      activation_eligibility_epoch: 'mock_epoch',
      activation_epoch: 'mock_epoch',
      effective_balance: '3200000000',
      exit_epoch: 'mock_epoch',
      pubkey: 'mock-pub-key-3',
      slashed: false,
      withdrawal_epoch: 'mock_epoch',
      withdrawal_credentials: 'mock-credentials',
    },
  },
  {
    index: 3,
    balance: '3200000000',
    status: 'active_ongoing' as ValidatorStatus,
    validator: {
      activation_eligibility_epoch: 'mock_epoch',
      activation_epoch: 'mock_epoch',
      effective_balance: '3200000000',
      exit_epoch: 'mock_epoch',
      pubkey: 'mock-pub-key-4',
      slashed: false,
      withdrawal_epoch: 'mock_epoch',
      withdrawal_credentials: 'mock-credentials',
    },
  },
  {
    index: 4,
    balance: '3200000000',
    status: 'active_ongoing' as ValidatorStatus,
    validator: {
      activation_eligibility_epoch: 'mock_epoch',
      activation_epoch: 'mock_epoch',
      effective_balance: '3200000000',
      exit_epoch: 'mock_epoch',
      pubkey: 'mock-pub-key-5',
      slashed: false,
      withdrawal_epoch: 'mock_epoch',
      withdrawal_credentials: 'mock-credentials',
    },
  },
]

export const mockValidatorCacheResults = {
  validators: {
    0: {
      info: [
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
    },
    1: {
      info: [
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
    },
    2: {
      info: [
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
    },
    3: {
      info: [
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
    },
    4: {
      info: [
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
    },
  },
}
